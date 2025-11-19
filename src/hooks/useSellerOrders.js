import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useAxios } from './useAxios';
import { useAuth } from './useAuth';
import { setSellerOrders } from '../store/orderSlice';

export function useSellerOrders() {
    const dispatch = useDispatch();
    const axios = useAxios();
    const { user } = useAuth();

    const ordersQuery = useQuery({
        queryKey: ['seller', 'orders'],
        queryFn: async () => {
            // Missing backend: need endpoint to fetch orders containing seller's products
            // e.g., GET /orders/seller or /orders?sellerId=:id
            // For now, return empty array and set state accordingly.
            // If you add an endpoint, replace the next line with a real request.
            // const res = await axios.get(`/orders/seller/${user._id}`);
            const data = [];
            dispatch(setSellerOrders(data));
            return data;
        },
        enabled: Boolean(user)
    });

    return { ordersQuery };
}
