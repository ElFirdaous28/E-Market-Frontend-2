import { Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { UserManagement } from "../pages/Admin_pages/UserManagement";
import { ProductManagement } from "../pages/Admin_pages/ProductManagement";
import { AdminDashboard } from "../pages/Admin_pages/AdminDashboard";
import AdminActivities from "../pages/Admin_pages/logs";

export default function AdminRoutes() {
  return (
    <>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/usermanage" element={<UserManagement />} />
      <Route path="/admin/activities" element={<AdminActivities />} />

      <Route path="/admin/productmanage" element={<ProductManagement />} />
    </>
  );
}
