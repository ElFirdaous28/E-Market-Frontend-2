import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '../hooks/useAxios';
import { toast } from 'react-toastify';
import { useAuth } from './useAuth';

export const useOrders = (status) => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // --- FETCH ALL ORDERS (admin) ---
  const allOrdersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await axios.get('/orders');
      return res.data.data;
    },
    enabled: user?.role === 'admin', // only for admin
    staleTime: 1000 * 60 * 2,       // 2 min
    cacheTime: 1000 * 60 * 10,      // 10 min
  });

  // --- FETCH USER ORDERS ---
  const userOrdersQuery = useQuery({
    queryKey: ['user-orders', user?._id, status],
    queryFn: async () => {
      const res = await axios.get(`/orders/${user._id}`, { params: { status } });
      return res.data.data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 10,
  });

  // --- CREATE ORDER ---
  const createOrder = useMutation({
    mutationFn: (data) => axios.post('/orders', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders', user?._id] });
      toast.success('Order created!');
    },
  });

  // --- UPDATE ORDER STATUS ---
  const updateOrderStatus = useMutation({
    mutationFn: ({ id, newStatus }) => axios.patch(`/orders/${id}/status`, { newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders', user?._id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Status updated!');
    },
  });

  // --- DELETE ORDER ---
  const deleteOrder = useMutation({
    mutationFn: (orderId) => axios.delete(`/orders/${orderId}/soft`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders', user?._id] });
      toast.success('Order deleted');
    },
    onError: () => toast.error('Failed to delete order'),
  });

  // --- FETCH RECENT ORDERS ---
  const recentOrdersQuery = useQuery({
    queryKey: ['recent-orders', user?._id],
    queryFn: async () => {
      const res = await axios.get('/orders/getlatestorder');
      return res.data.data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });

  return {
    // Data
    allOrders: allOrdersQuery.data,
    userOrders: userOrdersQuery.data,
    recentOrders: recentOrdersQuery.data,

    // Loading
    isLoading: allOrdersQuery.isLoading || userOrdersQuery.isLoading,

    // Actions
    fetchAllOrders: allOrdersQuery.refetch,
    createOrder: createOrder.mutate,
    updateOrderStatus: updateOrderStatus.mutate,
    deleteOrder: deleteOrder.mutate,
    deleteOrderLoading: deleteOrder.isLoading,
  };
};
