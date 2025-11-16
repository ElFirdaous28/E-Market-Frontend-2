import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        count: 0,
        loading: true,
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
    }
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;