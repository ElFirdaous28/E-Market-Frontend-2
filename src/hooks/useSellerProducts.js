import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useAxios } from './useAxios';
import { useAuth } from './useAuth';
import {
    setSellerProducts,
    addSellerProduct,
    updateSellerProduct as updateSellerProductAction,
    deleteSellerProduct as deleteSellerProductAction,
    setSelectedProduct,
    clearSelectedProduct
} from '../store/productSlice';


export function useSellerProducts() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const axios = useAxios();
    const { user } = useAuth();

    const productsQuery = useQuery({
        queryKey: ['seller', 'products'],
        queryFn: async () => {
            const res = await axios.get('/products');
            const list = res.data?.data || [];
            const sellerId = user?._id || user?.id;
            const mine = sellerId ? list.filter(p => (p.seller_id === sellerId) || (p.seller_id?._id === sellerId)) : [];
            dispatch(setSellerProducts(mine));
            return mine;
        },
        enabled: Boolean(user)
    });

    const createMutation = useMutation({
        mutationFn: async (payload) => {
            const fd = new FormData();
            fd.append('title', payload.title);
            fd.append('description', payload.description || '');
            fd.append('price', String(payload.price));
            if (payload.ex_price != null) fd.append('ex_price', String(payload.ex_price));
            fd.append('stock', String(payload.stock));
            const categories = Array.isArray(payload.categories)
                ? payload.categories
                : (payload.categories || '').split(',').map(s => s.trim()).filter(Boolean);
            categories.forEach(c => fd.append('categories', c));
            if (payload.primaryImage) fd.append('primaryImage', payload.primaryImage);
            (payload.secondaryImages || []).forEach(f => fd.append('secondaryImages', f));
            const res = await axios.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            return res.data?.data || res.data;
        },
        onSuccess: (data) => {
            dispatch(addSellerProduct(data));
            queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
            dispatch(clearSelectedProduct());
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...payload }) => {
            const fd = new FormData();
            if (payload.title) fd.append('title', payload.title);
            if (payload.description != null) fd.append('description', payload.description);
            if (payload.price != null) fd.append('price', String(payload.price));
            if (payload.ex_price != null) fd.append('ex_price', String(payload.ex_price));
            if (payload.stock != null) fd.append('stock', String(payload.stock));
            if (payload.categories != null) {
                const categories = Array.isArray(payload.categories)
                    ? payload.categories
                    : (payload.categories || '').split(',').map(s => s.trim()).filter(Boolean);
                categories.forEach(c => fd.append('categories', c));
            }
            if (payload.primaryImage) fd.append('primaryImage', payload.primaryImage);
            (payload.secondaryImages || []).forEach(f => fd.append('secondaryImages', f));
            const res = await axios.put(`/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            return res.data?.data || res.data;
        },
        onSuccess: (data) => {
            dispatch(updateSellerProductAction(data));
            queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
            dispatch(clearSelectedProduct());
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`/products/${id}/soft`);
            return id;
        },
        onSuccess: (id) => {
            dispatch(deleteSellerProductAction(id));
            queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
        }
    });

    const selectProduct = (p) => dispatch(setSelectedProduct(p));
    const clearSelection = () => dispatch(clearSelectedProduct());

    return {
        productsQuery,
        createMutation,
        updateMutation,
        deleteMutation,
        selectProduct,
        clearSelection
    };
}
