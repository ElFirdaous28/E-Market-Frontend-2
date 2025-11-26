import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '../hooks/useAxios';
import { toast } from 'react-toastify';
import { useAuth } from './useAuth';

export const useOrders = (status) => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // --- FETCH ALL ORDERS (admin)
  const allOrdersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await axios.get('/orders');
      return res.data.data;
    },
    enabled: false, // only load when admin calls it
  });

  // --- FETCH USER ORDERS
  const userOrdersQuery = useQuery({
    queryKey: ['user-orders', status],
    queryFn: async () => {
      const res = await axios.get(`/orders/${user._id}`, {
        params: { status },
      });

      return res.data.data;
    },
  });

  // --- CREATE ORDER
  const createOrder = useMutation({
    mutationFn: (coupons) => axios.post('/orders', coupons),
    onSuccess: () => {
      queryClient.invalidateQueries(['user-orders']);
      toast.success('Order created!');
    },
  });

  // --- UPDATE ORDER STATUS
  const updateOrderStatus = useMutation({
    mutationFn: ({ id, newStatus }) => axios.patch(`/orders/${id}/status`, { newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries(['user-orders']);
      queryClient.invalidateQueries(['orders']);
      toast.success('Status updated!');
    },
  });

  // --- DELETE ORDER
  const deleteOrder = useMutation({
    mutationFn: (orderId) => axios.delete(`/orders/${orderId}/soft`),
    onSuccess: () => {
      queryClient.invalidateQueries(['user-orders']); // FIXED KEY
      toast.success('Order deleted');
    },
    onError: () => {
      toast.error('Failed to delete order');
    },
  });

  // --- FETCH THE RECENT 10 ORDERS :
  const recentOrdersQuery = useQuery({
    queryKey: ['recent-orders'],

    queryFn: async () => {
      const res = await axios.get('/orders/getlatestorder');
      return res.data.data;
    },
  });

  return {
    // data
    allOrders: allOrdersQuery.data,
    userOrders: userOrdersQuery.data,
    recentOrders: recentOrdersQuery.data,

    // loading
    isLoading: allOrdersQuery.isLoading || userOrdersQuery.isLoading,

    // actions
    fetchAllOrders: allOrdersQuery.refetch,
    createOrder,
    updateOrderStatus: updateOrderStatus.mutate,
    deleteOrder: deleteOrder.mutate,
    deleteOrderLoading: deleteOrder.isLoading,
  };
};
