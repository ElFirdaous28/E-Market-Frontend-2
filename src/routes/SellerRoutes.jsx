import { Route } from "react-router-dom";
import SellerDashboard from "../pages/seller/SellerDashboard";
import ProductsManager from "../pages/seller/ProductsManager";
import OrdersManager from "../pages/seller/OrdersManager";
import CouponsManager from "../pages/seller/CouponsManager";

export default function SellerRoutes() {
    return (
        <>
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<ProductsManager />} />
            <Route path="/seller/orders" element={<OrdersManager />} />
            <Route path="/seller/coupons" element={<CouponsManager />} />
        </>
    );
}
