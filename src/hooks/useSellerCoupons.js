import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from './useAxios';
import { useAuth } from './useAuth';
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export function useSellerCoupons() {
    const queryClient = useQueryClient();
    const axios = useAxios();
    const { user } = useAuth();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const couponsQuery = useQuery({
        queryKey: ['seller', 'coupons', page],
        enabled: !!user,
        queryFn: async () => {
            const res = await axios.get(`/coupons?page=${page}&limit=${limit}`);
            const all = res.data?.data || [];
            // Seller gets only own coupons according to controller but we defensively filter.
            const own = all.filter(c => c.createdBy?._id === (user?._id || user?.id));
            return { list: own, pagination: res.data?.pagination };
        },
        staleTime: 30_000
    });

    const filtered = (() => {
        const list = couponsQuery.data?.list || [];
        return list.filter(c => {
            if (search && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
            if (statusFilter && c.status !== statusFilter) return false;
            if (typeFilter && c.type !== typeFilter) return false;
            return true;
        });
    })();

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['seller', 'coupons'] });

    const createMutation = useMutation({
        mutationFn: async (payload) => {
            const res = await axios.post('/coupons', payload);
            return res.data?.data;
        },
        onSuccess: (created) => {
            toast.success('Coupon créé');
            // Optimistic append then refetch
            queryClient.setQueryData(['seller', 'coupons', page], old => {
                if (!old) return old;
                return { ...old, list: [created, ...old.list] };
            });
            invalidate();
        },
        onError: (err) => toast.error(err?.response?.data?.error || 'Création échouée')
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...payload }) => {
            const res = await axios.put(`/coupons/${id}`, payload);
            return res.data?.data;
        },
        onSuccess: (updated) => {
            toast.success('Coupon mis à jour');
            queryClient.setQueryData(['seller', 'coupons', page], old => {
                if (!old) return old;
                return { ...old, list: old.list.map(c => c._id === updated._id ? updated : c) };
            });
            invalidate();
        },
        onError: (err) => toast.error(err?.response?.data?.error || 'Mise à jour échouée')
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`/coupons/${id}`);
            return id;
        },
        onSuccess: (id) => {
            toast.success('Coupon supprimé');
            queryClient.setQueryData(['seller', 'coupons', page], old => {
                if (!old) return old;
                return { ...old, list: old.list.filter(c => c._id !== id) };
            });
            invalidate();
        },
        onError: (err) => toast.error(err?.response?.data?.error || 'Suppression échouée')
    });

    const getById = useCallback((id) => {
        return couponsQuery.data?.list?.find(c => c._id === id) || null;
    }, [couponsQuery.data]);

    return {
        couponsQuery,
        coupons: filtered,
        pagination: couponsQuery.data?.pagination,
        search, setSearch,
        statusFilter, setStatusFilter,
        typeFilter, setTypeFilter,
        page, setPage,
        createMutation,
        updateMutation,
        deleteMutation,
        getById
    };
}
