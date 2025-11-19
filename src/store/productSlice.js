import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProducts: [],
        selectedProduct: null,
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload;
        },
        addSellerProduct: (state, action) => {
            state.sellerProducts.push(action.payload);
        },
        updateSellerProduct: (state, action) => {
            const idx = state.sellerProducts.findIndex(p => p.id === action.payload.id);
            if (idx !== -1) state.sellerProducts[idx] = action.payload;
        },
        deleteSellerProduct: (state, action) => {
            state.sellerProducts = state.sellerProducts.filter(p => p.id !== action.payload);
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        }
    }
});

export const {
    setSellerProducts,
    addSellerProduct,
    updateSellerProduct,
    deleteSellerProduct,
    setSelectedProduct,
    clearSelectedProduct
} = productSlice.actions;

export default productSlice.reducer;
