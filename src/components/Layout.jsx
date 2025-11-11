import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col w-full">
            {/* Header */}
            <Header />

            {/* Main content */}
            <main className="w-full flex-1 flex items-center justify-center flex-col gap-20 p-4 pt-24">
                {/* This will render the current page */}
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};