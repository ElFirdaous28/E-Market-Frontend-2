import { Route } from "react-router-dom";
import Products from "../pages/Products";
import { ProductDetails } from "../pages/ProductDetails";
import ProtectedRoute from "./ProtectedRoute"

export default function UserRoutes() {
    return (
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
        </Route>
    )
}
