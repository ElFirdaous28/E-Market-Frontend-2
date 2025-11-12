import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../contexts/AuthContext";

export default function Layout() {
    const { user } = useAuth();
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            {user && <Sidebar />}

            {/* Right side: Header + Main */}
            <div
                className={`flex flex-col flex-1 ${user && "md:ml-38"}`}
            >
                {/* Header */}
                <Header />

                {/* Main content */}
                <main className="p-6 mt-20 w-full">
                    <Outlet />
                </main>

                {/* Footer */}
                {!user && <Footer />}
            </div>
        </div>
    );
}
