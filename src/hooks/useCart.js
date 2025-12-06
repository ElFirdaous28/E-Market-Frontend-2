import { useDispatch } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from './useAxios';
import { setCart, clearCart, setSummary } from '../store/cartSlice';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';
import { useEffect, useMemo } from 'react';

export const useCart = ({ couponCodes = [] } = {}) => {
  const axios = useAxios();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();

  const isGuest = !user;
  const basePath = useMemo(() => (isGuest ? '/guest-cart' : '/cart'), [isGuest]);

  const queryKey = useMemo(() => ['cart', user?._id ?? 'guest'], [user]);
  const summaryKey = useMemo(() => [...queryKey, 'summary', ...couponCodes], [queryKey, couponCodes]);

  // --- Fetch cart only after auth is known ---
  const fetchCart = async () => {
    const res = await axios.get(basePath);
    return res.data.data;
  };

  const cartQuery = useQuery({
    queryKey,
    queryFn: fetchCart,
    enabled: !authLoading, // wait until auth state is resolved
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    onError: (err) => {
      console.error('Fetch cart error:', err);
      toast.error('Fetching cart failed');
    },
  });

  useEffect(() => {
    if (cartQuery.data) dispatch(setCart(cartQuery.data));
  }, [cartQuery.data, dispatch]);

  const invalidateAll = () => {
    queryClient.invalidateQueries(queryKey);
    queryClient.invalidateQueries(summaryKey);
  };

  // --- Mutations ---
  const addToCart = useMutation({
    mutationFn: ({ productId, quantity }) => axios.post(basePath, { productId, quantity }),
    onSuccess: (res) => {
      // update cart in cache instead of full refetch
      queryClient.setQueryData(queryKey, (old) => ({
        ...old,
        items: [...(old?.items || []), res.data.data],
      }));
      invalidateAll();
      toast.success(res.data.message || 'Product added to cart!');
    },
    onError: () => toast.error('Adding to cart failed'),
  });

  const updateQuantity = useMutation({
    mutationFn: ({ productId, quantity }) => axios.put(basePath, { productId, quantity }),
    onSuccess: invalidateAll,
    onError: () => toast.error('Updating quantity failed'),
  });

  const removeItem = useMutation({
    mutationFn: ({ productId }) => axios.delete(basePath, { data: { productId } }),
    onSuccess: invalidateAll,
    onError: () => toast.error('Removing item failed'),
  });

  const clear = useMutation({
    mutationFn: () => axios.delete(`${basePath}/clear`),
    onSuccess: () => {
      dispatch(clearCart());
      invalidateAll();
      toast.success('Cart cleared!');
    },
    onError: () => toast.error('Clearing cart failed'),
  });

  // --- Fetch summary (depends on cart & coupon codes) ---
  const fetchSummary = async () => {
    const res = await axios.post(`${basePath}/summary`, { couponCodes });
    return res.data.data.summary;
  };

  const summaryQuery = useQuery({
    queryKey: summaryKey,
    queryFn: fetchSummary,
    enabled: !!cartQuery.data && !authLoading, // wait for cart & auth
    staleTime: 1000 * 60 * 2, // cache summary for 2 minutes
    onSuccess: (summary) => dispatch(setSummary(summary)),
    onError: () => toast.error('Failed to fetch summary'),
  });

  const cartLength = useMemo(
    () => cartQuery.data?.items?.reduce((total, item) => total + item.quantity, 0) || 0,
    [cartQuery.data]
  );

  return {
    cart: cartQuery.data,
    summary: summaryQuery.data,
    isSummaryLoading: summaryQuery.isLoading,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart: clear,
    cartLength,
  };
};