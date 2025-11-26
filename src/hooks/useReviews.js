import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "../hooks/useAxios";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";

export const useReviews = () => {
    const axios = useAxios();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // --- FETCH PRODUCT REVIEWS (call manually)
    const getProductReviews = (productId, page = 1, limit = 10) =>
        //TODO: fix eslint warning about react-hooks/rules-of-hooks
        useQuery({
            queryKey: ["product-reviews", productId, page, limit],
            queryFn: async () => {
                const res = await axios.get(
                    `/reviews/product/${productId}?page=${page}&limit=${limit}`
                );
                return res.data;
            },
            enabled: !!productId,
        });

    // --- FETCH MY REVIEWS (auto)
    const myReviewsQuery = useQuery({
        queryKey: ["my-reviews"],
        queryFn: async () => {
            const res = await axios.get(`/reviews/me`);
            return res.data.data;
        },
        enabled: !!user,
    });

    // --- CREATE REVIEW
    const createReview = useMutation({
        mutationFn: (payload) => axios.post("/reviews", payload),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries(["product-reviews", productId]);
            queryClient.invalidateQueries(["my-reviews"]);
            toast.success("Review added");
        },
    });

    // --- UPDATE REVIEW
    const updateReview = useMutation({
        mutationFn: ({ id, data }) => axios.put(`/reviews/${id}`, data),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries(["product-reviews", productId]);
            queryClient.invalidateQueries(["my-reviews"]);
            toast.success("Review updated");
        },
    });

    // --- DELETE REVIEW
    const deleteReview = useMutation({
        mutationFn: ({ id }) => axios.delete(`/reviews/${id}`),
        onSuccess: (_, { productId }) => {
            queryClient.invalidateQueries(["product-reviews", productId]);
            queryClient.invalidateQueries(["my-reviews"]);
            toast.success("Review deleted");
        },
    });

    return {
        // Queries
        myReviews: myReviewsQuery.data,
        isMyReviewsLoading: myReviewsQuery.isLoading,

        // Functions
        getProductReviews,

        // Mutations
        createReview,
        updateReview: updateReview.mutate,
        deleteReview: deleteReview.mutate,
    };
};
