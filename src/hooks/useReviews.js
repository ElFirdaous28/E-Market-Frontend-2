import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '../hooks/useAxios';
import { toast } from 'react-toastify';
import { useAuth } from './useAuth';

export const useReviews = (productId = null, page = 1, limit = 10) => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // --- FETCH PRODUCT REVIEWS (call manually)
  const productReviewsQuery = useQuery({
    queryKey: ['product-reviews', productId, page, limit],
    queryFn: async () => {
      if (!productId) return null;
      const res = await axios.get(`/reviews/product/${productId}?page=${page}&limit=${limit}`);
      return res.data;
    },
    enabled: !!productId, // only fetch if productId is truthy
  });

  // --- FETCH MY REVIEWS (auto)
  const myReviewsQuery = useQuery({
    queryKey: ['my-reviews'],
    queryFn: async () => {
      const res = await axios.get(`/reviews/me`);
      return res.data.data;
    },
    enabled: !!user,
  });

  // --- CREATE REVIEW
  const createReview = useMutation({
    mutationFn: (payload) => axios.post('/reviews', payload),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries(['product-reviews', productId]);
      queryClient.invalidateQueries(['my-reviews']);
      toast.success('Review added');
    },
  });

  // --- UPDATE REVIEW
  const updateReview = useMutation({
    mutationFn: ({ id, data }) => axios.put(`/reviews/${id}`, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries(['product-reviews', productId]);
      queryClient.invalidateQueries(['my-reviews']);
      toast.success('Review updated');
    },
  });

  // --- DELETE REVIEW
  const deleteReview = useMutation({
    mutationFn: ({ id }) => axios.delete(`/reviews/${id}`),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries(['product-reviews', productId]);
      queryClient.invalidateQueries(['my-reviews']);
      toast.success('Review deleted');
    },
  });

  return {
    // Queries
    myReviews: myReviewsQuery.data,
    isMyReviewsLoading: myReviewsQuery.isLoading,

    // Functions
    productReviews: productReviewsQuery.data,

    // Mutations
    createReview,
    updateReview: updateReview.mutate,
    deleteReview: deleteReview.mutate,
  };
};
