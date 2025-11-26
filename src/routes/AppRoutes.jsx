import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import ProtectedRoute from './ProtectedRoute';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';
import SellerRoutes from './SellerRoutes';
import GuestRoute from './GuestRoute';
import { lazy, Suspense } from 'react';

// Lazy load pages
const Profile = lazy(() => import('../pages/Profile'));
const Layout = lazy(() => import('../components/Layout'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Products = lazy(() => import('../pages/Products'));
const Home = lazy(() => import('../pages/Home'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* guest routes- not loged in! */}
          <Route element={<GuestRoute />}>
            {AuthRoutes()}
          </Route>

          {/* routes any one can acces  */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            {UserRoutes()}

            {/* Seller protected routes */}
            <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
              {SellerRoutes()}
            </Route>

            {/* Protect all admin routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              {AdminRoutes()}
            </Route>
          </Route>

          <Route path="/unauthorized" element="unauthorized" />
          {/* catche not found routes */}
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
