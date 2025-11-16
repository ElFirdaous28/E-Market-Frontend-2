import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthRoutes from "./AuthRoutes"
import NotFound from "../pages/NotFound"
import { Home } from "../pages/Home"
import ProtectedRoute from "./ProtectedRoute"
import UserRoutes from "./UserRoutes"
import AdminRoutes from "./AdminRoutes"
import GuestRoute from "./GuestRoute"
import Layout from "../components/Layout"
import Test from "../pages/test"
import { UserManagement } from "../pages/UserManagement"

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<GuestRoute />}>
                    {AuthRoutes()}
                </Route>
                <Route path="/test" element={<Test />}></Route>
                <Route path="/" element={<Layout />}>

            
                    <Route index element={<Home />}></Route>    
                    {/* Protect all user routes */}
                    <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                        {UserRoutes()}
                    </Route>

                    {/* Protect all admin routes */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        {AdminRoutes()}

                    </Route>
                </Route>
                {/* catche not found routes */}
                <Route path="*" element={<NotFound />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes