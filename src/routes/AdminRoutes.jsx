import { Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { UserManagement } from "../pages/Admin_pages/UserManagement";
import { ProductManagement } from "../pages/Admin_pages/ProductManagement";


export default function AdminRoutes() {
    return (
        <>
            {/* <Route path="/dashboard" element={<Home />} /> */}
            <Route path="/admin/usermanage" element={<UserManagement />} />
            
            <Route path="/admin/productmanage" element={<ProductManagement />} />

        </>
    )
}
