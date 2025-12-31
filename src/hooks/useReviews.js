import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '../hooks/useAxios';
import { toast } from 'react-toastify';
import { useAuth } from './useAuth';

export const useReviews = (productId = null, page = 1, limit = 10) => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // --- FETCH PRODUCT REVIEWS ---
  const productReviewsQuery = useQuery({
    queryKey: ['product-reviews', productId, page, limit],
    queryFn: async () => {
      if (!productId) return null;
      const res = await axios.get(`/reviews/product/${productId}?page=${page}&limit=${limit}`);
      return res.data;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 2, // 2 minutes fresh
    cacheTime: 1000 * 60 * 10, // 10 minutes in cache
    keepPreviousData: true, // keep old data while fetching new page
  });

  // --- FETCH MY REVIEWS ---
  const myReviewsQuery = useQuery({
    queryKey: ['my-reviews'],
    queryFn: async () => {
      const res = await axios.get(`/reviews/me`);
      return res.data.data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 10,
  });

  // --- CREATE REVIEW ---
  const createReview = useMutation({
    mutationFn: (payload) => axios.post('/reviews', payload),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries(['product-reviews', productId]);
      queryClient.invalidateQueries(['my-reviews']);
      toast.success('Review added');
    },
    onError: () => {
      toast.error('Failed to add review');
    },
  });

  // --- UPDATE REVIEW ---
  const updateReview = useMutation({
    mutationFn: ({ id, data }) => axios.put(`/reviews/${id}`, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries(['product-reviews', productId]);
      queryClient.invalidateQueries(['my-reviews']);
      toast.success('Review updated');
    },
    onError: () => {
      toast.error('Failed to update review');
    },
  });

  // --- DELETE REVIEW ---
  const deleteReview = useMutation({
    mutationFn: ({ id }) => axios.delete(`/reviews/${id}`),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries(['product-reviews', productId]);
      queryClient.invalidateQueries(['my-reviews']);
      toast.success('Review deleted');
    },
    onError: () => {
      toast.error('Failed to delete review');
    },
  });

  return {
    productReviews: productReviewsQuery.data,
    myReviews: myReviewsQuery.data,
    isProductReviewsLoading: productReviewsQuery.isLoading,
    isMyReviewsLoading: myReviewsQuery.isLoading,

    createReview,
    updateReview: updateReview.mutate,
    deleteReview: deleteReview.mutate,
  };
};
