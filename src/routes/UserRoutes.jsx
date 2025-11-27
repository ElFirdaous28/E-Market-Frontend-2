import { Route } from 'react-router-dom';
import Products from '../pages/Products';
import { ProductDetails } from '../pages/ProductDetails';
import ProtectedRoute from './ProtectedRoute';
import Orders from '../pages/Orders';
import Cart from '../pages/Cart';

export default function UserRoutes() {
  return (
    <Route element={<ProtectedRoute allowedRoles={['user']} />}>
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/cart" element={<Cart />} />
    </Route>
  );
}
