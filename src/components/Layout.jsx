import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SellerSidebar from "./SellerSidebar";
import { useAuth } from "../hooks/useAuth";

export default function Layout() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen w-full flex">
            {/* Sidebar */}
            {user && (user.role === 'seller' ? <SellerSidebar /> : <Sidebar />)}

            {/* Right side: Header + Main */}
            <div
                className={`flex flex-col flex-1 ${user ? (user.role === 'seller' ? 'md:ml-64' : 'md:ml-38') : ''}`}
            >
                {/* Header */}
                <Header />

                {/* Main content */}
                <main className="p-6 mt-20 w-full flex flex-col flex-1 items-center justify-center gap-20">
                    <Outlet />
                </main>

                {/* Footer */}
                {!user && <Footer />}
            </div>
        </div>
    );
}
