import { useState } from "react";
import { Home, Package, ShoppingCart, Users, BarChart3, Settings, ChevronsRight, ChevronsLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    const { user } = useAuth()

    return (
        <aside
            className={`fixed top-0 left-0 h-screen ${sidebarOpen ? 'w-64' : 'w-20'} bg-background shadow-[4px_0_6px_-1px_rgba(0,0,0,0.4)] border-r border-border transition-all duration-300 z-100`}
        >
            <div className="p-4">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-11 h-11 bg-primary rounded-lg flex items-center justify-center font-bold text-xl">
                        E
                    </div>
                    {sidebarOpen && <span className="text-xl font-semibold text-textMain">E-Market</span>}
                </div>

                <nav className="space-y-2">

                    {/* add links based on role */}
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary rounded-lg text-white">
                        <Home className="w-5 h-5" />
                        {sidebarOpen && <span>Dashboard</span>}
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-textMuted hover:bg-primary hover:text-white rounded-lg">
                        <Package className="w-5 h-5" />
                        {sidebarOpen && <span>Products</span>}
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-textMuted hover:bg-primary hover:text-white rounded-lg">
                        <ShoppingCart className="w-5 h-5" />
                        {sidebarOpen && <span>Orders</span>}
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-textMuted hover:bg-primary hover:text-white rounded-lg">
                        <Users className="w-5 h-5" />
                        {sidebarOpen && <span>Customers</span>}
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-textMuted hover:bg-primary hover:text-white rounded-lg">
                        <BarChart3 className="w-5 h-5" />
                        {sidebarOpen && <span>Analytics</span>}
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-textMuted hover:bg-primary hover:text-white rounded-lg">
                        <Settings className="w-5 h-5" />
                        {sidebarOpen && <span>Settings</span>}
                    </a>

                    <div className="flex justify-end mb-4">
                        <button
                            onClick={toggleSidebar}
                            className="flex items-center justify-center w-10 h-10 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg"
                        >
                            {sidebarOpen ? <ChevronsLeft className="w-5 h-5" /> : <ChevronsRight className="w-5 h-5" />}
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
}
