import { useQuery } from '@tanstack/react-query';
import { useAxios } from './useAxios';

export const useCategories = ({ forceRefresh = false } = {}) => {
  const axios = useAxios();

  const query = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/categories/product-number');
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // cache 5 min
    cacheTime: 1000 * 60 * 30, // keep cache 30 min
    refetchOnWindowFocus: false,
    enabled: !forceRefresh,
  });

  return {
    categories: query.data ?? [],
    loading: query.isLoading,
    error: query.isError,
    refresh: query.refetch,
  };
};
