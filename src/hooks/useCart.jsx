import { useDispatch } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "../hooks/useAxios";
import { setCart, clearCart } from "../store/cartSlice";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

export const useCart = () => {
    const axios = useAxios();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const queryKey = ["cart", user?._id ?? "guest"];
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

    // --- Add to cart ---
    const addToCart = useMutation({
        mutationFn: ({ productId, quantity }) =>
            axios.post(basePath, { productId, quantity }),
        onSuccess: (res) => {
            queryClient.invalidateQueries(queryKey);
            toast.success(res.data.message || "Product added to cart!");
            console.log(res.data);
            
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
            queryClient.invalidateQueries(queryKey);
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
            queryClient.invalidateQueries(queryKey);
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
            queryClient.invalidateQueries(queryKey);
            toast.success(res.data.message || "Cart cleared!");
        },
        onError: (err) => {
            console.error("Clear cart error:", err);
            toast.error("Clearing cart failed. Try again later");
        },
    });

    return {
        cart: cartQuery.data,
        isLoading: cartQuery.isLoading,
        isError: cartQuery.isError,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart: clear,
    };
};
