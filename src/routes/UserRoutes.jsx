import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Orders from '../pages/Orders';
import Cart from '../pages/Cart';
const Products = lazy(() => import('../pages/Products'));

export default function UserRoutes() {
  return (
    <Route element={<ProtectedRoute allowedRoles={['user']} />}>
      <Route path="/products" element={<Products />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/cart" element={<Cart />} />
    </Route>
  );
}
