import { lazy } from 'react';
import { Route } from 'react-router-dom';

const ProductsManager = lazy(() => import('../pages/seller/ProductsManager'));
const SellerOverview = lazy(() => import('../pages/seller/Overview'));
const CreateProduct = lazy(() => import('../pages/seller/CreateProduct'));
const EditProduct = lazy(() => import('../pages/seller/EditProduct'));
const OrdersManager = lazy(() => import('../pages/seller/OrdersManager'));
const CouponsManager = lazy(() => import('../pages/seller/CouponsManager'));
const CouponCreate = lazy(() => import('../pages/seller/CouponCreate'));
const CouponEdit = lazy(() => import('../pages/seller/CouponEdit'));


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
