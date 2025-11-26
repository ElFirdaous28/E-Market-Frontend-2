import { Route } from 'react-router-dom';
import Products from '../pages/Products';
import ProtectedRoute from './ProtectedRoute';
import Orders from '../pages/Orders';
import Cart from '../pages/Cart';

export default function UserRoutes() {
  return (
    <Route element={<ProtectedRoute allowedRoles={['user']} />}>
      <Route path="/products" element={<Products />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/cart" element={<Cart />} />
    </Route>
  );
}
