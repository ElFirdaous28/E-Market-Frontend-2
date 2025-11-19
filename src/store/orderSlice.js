import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        list: [],
        userOrders: [],
        sellerOrders: [],
        loading: false,
    },
    reducers: {
        setOrders: (state, action) => {
            state.list = action.payload;
        },
        setUserOrders: (state, action) => {
            state.userOrders = action.payload;
        },
        setSellerOrders: (state, action) => {
            state.sellerOrders = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearOrders: (state) => {
            state.list = [];
            state.userOrders = [];
            state.sellerOrders = [];
        },
    },
});

export const { setOrders, setUserOrders, setSellerOrders, setLoading, clearOrders } =
    orderSlice.actions;

export default orderSlice.reducer;
