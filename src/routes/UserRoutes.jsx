import { Route } from "react-router-dom";
import Products from "../pages/Products";
import { ProductDetails } from "../pages/ProductDetails";


export default function UserRoutes() {
    return (
        <>
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
        </>
    )
}
