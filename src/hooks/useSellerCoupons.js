import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from './useAxios';

export function useSellerCoupons() {
    const queryClient = useQueryClient();
    const axios = useAxios();

    const couponsQuery = useQuery({
        queryKey: ['seller', 'coupons'],
        queryFn: async () => {
            // Missing backend endpoint for seller coupons
            // Replace with: const res = await axios.get('/coupons/seller'); return res.data.data;
            return [];
        }
    });

    const createMutation = useMutation({
        mutationFn: async (payload) => {
            // Replace with a real endpoint when available
            // return (await axios.post('/coupons/seller', payload)).data;
            return {};
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['seller', 'coupons'] })
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...payload }) => {
            // Replace with a real endpoint when available
            // return (await axios.put(`/coupons/seller/${id}`, payload)).data;
            return {};
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['seller', 'coupons'] })
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            // Replace with a real endpoint when available
            // await axios.delete(`/coupons/seller/${id}`);
            return id;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['seller', 'coupons'] })
    });

    return {
        couponsQuery,
        createMutation,
        updateMutation,
        deleteMutation
    };
}
