import { useDispatch } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "../hooks/useAxios";
import { setCart, clearCart, setSummary } from "../store/cartSlice";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

export const useCart = ({ couponCodes = [] } = {}) => {
    const axios = useAxios();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const queryKey = ["cart", user?._id ?? "guest"];
    const summaryKey = [...queryKey, "summary", ...couponCodes];
    const basePath = user ? "/cart" : "/guest-cart";

    // --- Fetch cart ---
    const fetchCart = async () => {
        const res = await axios.get(basePath);
        return res.data.data;
    };

    const cartQuery = useQuery({
        queryKey,
        queryFn: fetchCart,
        onSuccess: (cart) => {
            dispatch(setCart(cart));
        },
        onError: (err) => {
            console.error("Fetch cart error:", err);
            toast.error("Fetching cart failed");
        },
    });

    const invalidateAll = () => {
        queryClient.invalidateQueries(queryKey);
        queryClient.invalidateQueries(summaryKey);
    };

    // --- Add to cart ---
    const addToCart = useMutation({
        mutationFn: ({ productId, quantity }) =>
            axios.post(basePath, { productId, quantity }),
        onSuccess: (res) => {
            invalidateAll();
            toast.success(res.data.message || "Product added to cart!");
        },
        onError: (err) => {
            console.error("Add to cart error:", err);
            toast.error("Adding to cart failed. Try again later");
        },
    });

    // --- Update quantity ---
    const updateQuantity = useMutation({
        mutationFn: ({ productId, quantity }) =>
            axios.put(basePath, { productId, quantity }),
        onSuccess: (res) => {
            invalidateAll();
            toast.success(res.data.message || "Quantity updated!");
        },
        onError: (err) => {
            console.error("Update quantity error:", err);
            toast.error("Updating quantity failed. Try again later");
        },
    });

    // --- Remove item ---
    const removeItem = useMutation({
        mutationFn: ({ productId }) =>
            axios.delete(basePath, { data: { productId } }),
        onSuccess: (res) => {
            invalidateAll();
            toast.success(res.data.message || "Item removed from cart!");
        },
        onError: (err) => {
            console.error("Remove item error:", err);
            toast.error("Removing item from cart failed. Try again later");
        },
    });

    // --- Clear cart ---
    const clear = useMutation({
        mutationFn: () => axios.delete(`${basePath}/clear`),
        onSuccess: (res) => {
            dispatch(clearCart());
            invalidateAll();
            toast.success(res.data.message || "Cart cleared!");
        },
        onError: (err) => {
            console.error("Clear cart error:", err);
            toast.error("Clearing cart failed. Try again later");
        },
    });

    // --- Fetch summary ---
    const fetchSummary = async () => {
        const res = await axios.post(`${basePath}/summary`, {
            couponCodes,
        });
        return res.data.data.summary;
    };

    const summaryQuery = useQuery({
        queryKey: summaryKey,
        queryFn: fetchSummary,
        enabled: !!cartQuery.data && couponCodes.length >= 0,
        onSuccess: (summary) => {
            dispatch(setSummary(summary));
        },
        onError: (err) => {
            console.error("Summary fetch error:", err);
            toast.error("Failed to fetch summary");
        },
    });

    const cartLength = cartQuery.data?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    return {
        cart: cartQuery.data,
        summary: summaryQuery.data,
        isSummaryLoading: summaryQuery.isLoading,
        isLoading: cartQuery.isLoading,
        isError: cartQuery.isError,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart: clear,
        cartLength,
    };
};
