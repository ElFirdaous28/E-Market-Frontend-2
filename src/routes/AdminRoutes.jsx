import { Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { UserManagement } from "../pages/Admin_pages/UserManagement";
import { ProductManagement } from "../pages/Admin_pages/ProductManagement";
import { AdminDashboard } from "../pages/Admin_pages/AdminDashboard";

export default function AdminRoutes() {
  return (
    <>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/usermanage" element={<UserManagement />} />

      <Route path="/admin/productmanage" element={<ProductManagement />} />
    </>
  );
}
