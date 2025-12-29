import { Route } from 'react-router-dom';
import { lazy } from 'react';

const UserManagement = lazy(() => import('../pages/Admin_pages/UserManagement'));
const ProductManagement = lazy(() => import('../pages/Admin_pages/ProductManagement'));
const AdminDashboard = lazy(() => import('../pages/Admin_pages/AdminDashboard'));
const AdminActivities = lazy(() => import('../pages/Admin_pages/logs'));
const AdminReviews = lazy(() => import('../pages/Admin_pages/Reviews'));

export default function AdminRoutes() {
  return (
    <>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/usermanage" element={<UserManagement />} />
      <Route path="/admin/activities" element={<AdminActivities />} />
      <Route path="/admin/reviews" element={<AdminReviews />} />

      <Route path="/admin/productmanage" element={<ProductManagement />} />
    </>
  );
}
