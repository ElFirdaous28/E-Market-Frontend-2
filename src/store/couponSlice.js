import { createSlice } from "@reduxjs/toolkit";

const couponSlice = createSlice({
    name: "coupon",
    initialState: {
        activeCoupon: null,
    },
    reducers: {
        setActiveCoupon: (state, action) => {
            state.activeCoupon = action.payload;
        },
        clearCoupon: (state) => {
            state.activeCoupon = null;
        }
    }
});

export const { setActiveCoupon, clearCoupon } = couponSlice.actions;
export default couponSlice.reducer;
