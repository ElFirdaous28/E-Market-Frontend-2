import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import NotFound from '../pages/NotFound';
import { Home } from '../pages/Home';
import ProtectedRoute from './ProtectedRoute';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';
import SellerRoutes from './SellerRoutes';
import GuestRoute from './GuestRoute';
import Layout from '../components/Layout';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>{AuthRoutes()}</Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          {UserRoutes()}

          {/* Seller protected routes */}
          <Route element={<ProtectedRoute allowedRoles={['seller']} />}>{SellerRoutes()}</Route>

          {/* Protect all admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>{AdminRoutes()}</Route>
        </Route>
        <Route path="/unauthorized" element="unauthorized" />
        {/* catche not found routes */}
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
