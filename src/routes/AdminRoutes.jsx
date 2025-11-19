import { Route } from "react-router-dom";
import { UserManagement } from "../pages/UserManagement";
import { Home } from "../pages/Home";
import { ProductManagement } from "../pages/ProductManagement";


export default function AdminRoutes() {
    return (
        <>
            {/* <Route path="/dashboard" element={<Home />} /> */}
            <Route path="/usermanage" element={<UserManagement />} />
            <Route path="/productmanage" element={<ProductManagement />} />

        </>
    )
}
