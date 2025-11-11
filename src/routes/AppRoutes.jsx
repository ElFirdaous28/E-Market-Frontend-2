import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthRoutes from "./AuthRoutes"
import NotFound from "../pages/NotFound"
import { Home } from "../pages/Home"
import ProtectedRoute from "./ProtectedRoute"
import UserRoutes from "./UserRoutes"
import GuestRoute from "./GuestRoute"
import Layout from "../components/Layout"

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<GuestRoute />}>
                    {AuthRoutes()}
                </Route>
                <Route path="/" element={<Layout />}>

                    <Route index element={<Home />}></Route>

                    {/* Protect all user routes */}
                    <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                        {UserRoutes()}
                    </Route>
                </Route>
                {/* catche not found routes */}
                <Route path="*" element={<NotFound />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes