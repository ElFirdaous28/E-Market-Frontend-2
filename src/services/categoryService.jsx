// services/categoryService.js
import axios from "./axios"; 

export const getCategories = async () => {
    const res = await axios.get("/categories/product-number");
    return res.data.data;
};
