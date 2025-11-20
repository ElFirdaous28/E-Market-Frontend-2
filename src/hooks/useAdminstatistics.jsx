import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../hooks/useAxios";
import { toast } from "react-toastify";

export const useAdminStatistics = () => {
  const axios = useAxios();

  // --- FETCH TOP PRODUCTS
const topProductsQuery = useQuery({
  queryKey: ["top-products"],
  queryFn: async () => {
    const res = await axios.get("/products/topproducts");
    return res.data.data;
  },
 enabled: false,
});
 

  return {
    // data
    topProducts: topProductsQuery.data,

    // states
    isLoading: topProductsQuery.isLoading,
    isError: topProductsQuery.isError,
    error: topProductsQuery.error,
  };
};
