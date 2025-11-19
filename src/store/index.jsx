import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import cartReducer from "./cartSlice";
import couponReducer from "./couponSlice";
import orderReducer from "./orderSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        coupon: couponReducer,
        order: orderReducer,
    },
});