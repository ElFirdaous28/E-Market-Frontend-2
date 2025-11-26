import { useQuery, useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useAxios } from './useAxios';
import { useAuth } from './useAuth';
import { setSellerOrders } from '../store/orderSlice';
import { toast } from 'react-toastify';

export function useSellerOrders() {
    const dispatch = useDispatch();
    const axios = useAxios();
    const { user } = useAuth();
    
    const ordersQuery = useQuery({
        queryKey: ['seller', 'orders', user?._id],
        queryFn: async () => {
            if (!user?._id && !user?.id) return [];
            try {
                const sellerId = user._id || user.id;
                const res = await axios.get(`/orders/seller/${sellerId}`);
                const list = res.data?.orders || res.data?.data || [];
                const cleaned = list.map(o => ({
                    ...o,
                    items: Array.isArray(o.items) ? o.items : []
                }));
                dispatch(setSellerOrders(cleaned));
                return cleaned;
            } catch (err) {
                const msg = err?.response?.data?.message || 'Erreur chargement commandes vendeur';
                toast.error(msg);
                dispatch(setSellerOrders([]));
                throw err;
            }
        },
        enabled: Boolean(user),
        staleTime: 60_000
    });

    const statusMutation = useMutation({
        mutationFn: async ({ orderId, newStatus }) => {
            await axios.patch(`/orders/${orderId}/status`, { newStatus });
        },
        onSuccess: () => {
            toast.success('Statut mis à jour');
            ordersQuery.refetch();
        },
        onError: (err) => {
            const msg = err?.response?.data?.message || 'Échec mise à jour statut';
            toast.error(msg);
        }
    });

    const updateStatus = (orderId, newStatus, currentStatus) => {
        if (!orderId || !newStatus || newStatus === currentStatus) return;
        statusMutation.mutate({ orderId, newStatus });
    };

    return { ordersQuery, updateStatus, statusUpdating: statusMutation.isLoading };
}
