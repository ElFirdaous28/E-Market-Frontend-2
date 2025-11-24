import { Route } from "react-router-dom";
import ProductsManager from "../pages/seller/ProductsManager";
import SellerOverview from "../pages/seller/Overview";
import CreateProduct from "../pages/seller/CreateProduct";
import EditProduct from "../pages/seller/EditProduct";
import OrdersManager from "../pages/seller/OrdersManager";
import CouponsManager from "../pages/seller/CouponsManager";
import CouponCreate from "../pages/seller/CouponCreate";
import CouponEdit from "../pages/seller/CouponEdit";

export default function SellerRoutes() {
    return (
        <>
            {/* <Route path="/seller/dashboard" element={<SellerDashboard />} /> */}
            <Route path="/seller/overview" element={<SellerOverview />} />
            <Route path="/seller/products" element={<ProductsManager />} />
            <Route path="/seller/products/create" element={<CreateProduct />} />
            <Route path="/seller/products/edit/:id" element={<EditProduct />} />
            <Route path="/seller/orders" element={<OrdersManager />} />
            <Route path="/seller/coupons" element={<CouponsManager />} />
            <Route path="/seller/coupons/create" element={<CouponCreate />} />
            <Route path="/seller/coupons/edit/:id" element={<CouponEdit />} />
        </>
    );
}
