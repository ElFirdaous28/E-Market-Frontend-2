import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        list: [],
        userOrders: [],
        loading: false,
    },
    reducers: {
        setOrders: (state, action) => {
            state.list = action.payload;
        },
        setUserOrders: (state, action) => {
            state.userOrders = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearOrders: (state) => {
            state.list = [];
            state.userOrders = [];
        },
    },
});

export const { setOrders, setUserOrders, setLoading, clearOrders } =
    orderSlice.actions;

export default orderSlice.reducer;
