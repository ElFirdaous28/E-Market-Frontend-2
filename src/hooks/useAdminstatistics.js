import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "./useAxios";
import { toast } from "react-toastify";

export const useAdminStatistics = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  // --- FETCH TOP PRODUCTS
  const topProductsQuery = useQuery({
    queryKey: ["top-products"],
    queryFn: async () => {
      const res = await axios.get("/products/topproducts");
      return res.data.data;
    },
    staleTime: 1000 * 60,
  });

  // FETCH STATISTICS
  const statisticsQuery = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const res = await axios.get("/orders/getStatics");
      return res.data.data;
    },
    staleTime: 1000 * 60,
  });

  // FETCH ACTIVITIES
  const activitiesQuery = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const res = await axios.get("/users/getactivitie");
      return res.data.data;
    },
    staleTime: 1000 * 60,
  });

  // FETCH PRODUCTS
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("/products");
      return res.data.data;
    },
    staleTime: 1000 * 60,
  });

  // FETCH USERS
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("/users");
      return res.data.data.users;
    },
    staleTime: 1000 * 60,
  });
  // FETCH REVIEWS
  const reviewsQuery = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axios.get("/reviews/");
      return res.data.data;
    },
    staleTime: 1000 * 60,
  });
// FETCH GENERAL STATICS
const staticsQuery = useQuery({
  queryKey: ["statics"],
  queryFn: async () => {
    const res = await axios.get("/orders/getStatics");
    return res.data.data;
  },
    staleTime: 1000 * 60,

});
  // DELETE USER MUTATION
  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/users/${id}/soft`);
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  // EDIT USER ROLE MUTATION
  const editUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      await axios.put(`/users/${id}/${role}`);
    },
    onSuccess: () => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });

  // DELETE PRODUCT MUTATION
  const deleteProductMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/products/${id}`);
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  return {
    // data
    topProducts: topProductsQuery.data || [],
    statistics: statisticsQuery.data || {},
    activities: activitiesQuery.data || [],
    products: productsQuery.data || [],
    users: usersQuery.data || [],
    reviews: reviewsQuery.data || [],
    statics: staticsQuery.data || [],

    // actions
    deleteProduct: deleteProductMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    editUserRole: editUserRoleMutation.mutate,

    // states
    isLoading: topProductsQuery.isLoading || usersQuery.isLoading || reviewsQuery.isLoading || staticsQuery.isLoading,
    isError: topProductsQuery.isError || usersQuery.isError,
    error: topProductsQuery.error || usersQuery.error,
  };
};
