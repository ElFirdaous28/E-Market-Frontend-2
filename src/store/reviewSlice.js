import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
    name: "reviews",
    initialState: {
        productReviews: [],
        myReviews: [],
        loading: false,
        averageRating: 0,
        total: 0,
        totalPages: 1,
        currentPage: 1,
    },
    reducers: {
        setProductReviews: (state, action) => {
            const { data, averageRating, total, totalPages, currentPage } = action.payload;
            state.productReviews = data;
            state.averageRating = averageRating;
            state.total = total;
            state.totalPages = totalPages;
            state.currentPage = currentPage;
        },
        setMyReviews: (state, action) => {
            state.myReviews = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearReviews: (state) => {
            state.productReviews = [];
            state.myReviews = [];
            state.averageRating = 0;
            state.total = 0;
            state.totalPages = 1;
            state.currentPage = 1;
        },
    },
});

export const {
    setProductReviews,
    setMyReviews,
    setLoading,
    clearReviews,
} = reviewSlice.actions;

export default reviewSlice.reducer;
