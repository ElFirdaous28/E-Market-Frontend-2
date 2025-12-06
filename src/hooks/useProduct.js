import { useQuery } from '@tanstack/react-query';
import axios from '../services/axios';

// --- Fetch multiple products with filters & pagination ---
export const useProducts = (limit = 8, page = 1, filters = {}) => {
  return useQuery({
    queryKey: ['products', filters, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);

      if (filters.title) params.append('title', filters.title);
      if (filters.categories?.length) params.append('categories', filters.categories.join(','));
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const res = await axios.get(`/products/search?${params.toString()}`);
      return res.data;
    },
    keepPreviousData: true, // avoid flicker when switching pages
    staleTime: 1000 * 60 * 2, // 2 min fresh
    cacheTime: 1000 * 60 * 10, // 10 min in cache
  });
};

// --- Fetch single product by ID ---
export const useProduct = (productId) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      const res = await axios.get(`/products/${productId}`);
      return res.data.data;
    },
    enabled: !!productId, // only fetch if id exists
    staleTime: 1000 * 60 * 5, // 5 min fresh
    cacheTime: 1000 * 60 * 15, // 15 min in cache
  });
};
