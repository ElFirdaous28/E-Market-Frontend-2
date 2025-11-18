import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        count: 0,
        loading: true,
        summary: null,
    },
    reducers: {
        setCart(state, action) {
            state.items = action.payload.items || [];
            state.count = state.items.reduce((t, i) => t + i.quantity, 0);
            state.loading = false;
        },
        clearCart(state) {
            state.items = [];
            state.count = 0;
        },
        setSummary(state, action) {
            state.summary = action.payload;
        },
    }
});

export const { setCart, clearCart, setSummary } = cartSlice.actions;
export default cartSlice.reducer;