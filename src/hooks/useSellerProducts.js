import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useAxios } from './useAxios';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';
import {
  setSellerProducts,
  addSellerProduct,
  updateSellerProduct as updateSellerProductAction,
  deleteSellerProduct as deleteSellerProductAction,
  setSelectedProduct,
  clearSelectedProduct,
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
      const mine = sellerId
        ? list.filter((p) => p.seller_id === sellerId || p.seller_id?._id === sellerId)
        : [];
      dispatch(setSellerProducts(mine));
      return mine;
    },
    enabled: Boolean(user),,
        staleTime: 30_000,
        cacheTime: 300_000,
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const fd = new FormData();
      fd.append('title', payload.title);
      fd.append('description', payload.description || '');
      fd.append('price', String(payload.price));
      fd.append('stock', String(payload.stock));
      const categories = Array.isArray(payload.categories) ? payload.categories : [];
      categories.forEach((c) => fd.append('categories', c));
      if (payload.primaryImage) fd.append('primaryImage', payload.primaryImage);
      (payload.secondaryImages || []).forEach((f) => fd.append('secondaryImages', f));
      const res = await axios.post('/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data?.data || res.data;
    },
    onSuccess: (data) => {
      dispatch(addSellerProduct(data));
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
      dispatch(clearSelectedProduct());
      toast.success('Produit créé');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || 'Erreur création produit');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const fd = new FormData();
      if (payload.title) fd.append('title', payload.title);
      if (payload.description != null) fd.append('description', payload.description);
      if (payload.price != null) fd.append('price', String(payload.price));
      if (payload.stock != null) fd.append('stock', String(payload.stock));
      if (payload.categories) {
        const categories = Array.isArray(payload.categories) ? payload.categories : [];
        categories.forEach((c) => fd.append('categories', c));
      }
      if (payload.primaryImage) fd.append('primaryImage', payload.primaryImage);
      (payload.secondaryImages || []).forEach((f) => fd.append('secondaryImages', f));
      const res = await axios.put(`/products/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data?.data || res.data;
    },
    onSuccess: (data) => {
      dispatch(updateSellerProductAction(data));
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
      dispatch(clearSelectedProduct());
      toast.success('Produit mis à jour');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || 'Erreur mise à jour produit');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/products/${id}/soft`);
      return id;
    },
    onSuccess: (id) => {
      dispatch(deleteSellerProductAction(id));
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
      toast.success('Produit supprimé');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || 'Erreur suppression produit');
    },
  });

  // Publish (sets published true)
  const publishMutation = useMutation({
    mutationFn: async (id) => {
      await axios.patch(`/products/${id}/publish`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
      toast.success('Produit publié');
    },
    onError: (err) => toast.error(err?.response?.data?.error || 'Erreur publication'),
  });

  // Unpublish (set published false via update route)
  const unpublishMutation = useMutation({
    mutationFn: async (id) => {
      await axios.patch(`/products/${id}/unpublish`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
      toast.success('Produit dépublié');
    },
    onError: (err) => toast.error(err?.response?.data?.error || 'Erreur dépublication'),
  });

  // Deleted products query (soft-deleted)
  const deletedProductsQuery = useQuery({
    queryKey: ['seller', 'products', 'deleted'],
    queryFn: async () => {
      const res = await axios.get('/products/deleted');
      const list = res.data?.products || res.data?.data || [];
      const sellerId = user?._id || user?.id;
      return sellerId
        ? list.filter((p) => p.seller_id === sellerId || p.seller_id?._id === sellerId)
        : [];
    },
    enabled: Boolean(user),
  });

  // Restore soft-deleted product
  const restoreMutation = useMutation({
    mutationFn: async (id) => {
      await axios.patch(`/products/${id}/restore`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products', 'deleted'] });
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] });
      toast.success('Produit restauré');
    },
    onError: (err) => toast.error(err?.response?.data?.error || 'Erreur restauration'),
  });

  const selectProduct = (p) => dispatch(setSelectedProduct(p));
  const clearSelection = () => dispatch(clearSelectedProduct());

  return {
    productsQuery,
    deletedProductsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    publishMutation,
    unpublishMutation,
    restoreMutation,
    selectProduct,
    clearSelection,
  };
}
