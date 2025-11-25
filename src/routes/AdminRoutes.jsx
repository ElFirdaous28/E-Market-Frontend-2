import { Route } from "react-router-dom";
import { UserManagement } from "../pages/UserManagement";
import { Home } from "../pages/Home";


export default function AdminRoutes() {
    return (
        <>
            {/* <Route path="/dashboard" element={<Home />} /> */}
            <Route path="/usermanage" element={<UserManagement />} />

        </>
    )
}
