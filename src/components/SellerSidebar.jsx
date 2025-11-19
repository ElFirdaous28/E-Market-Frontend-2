import { useState } from "react";
import { Home, Package, ShoppingCart, Percent, ChevronsRight, ChevronsLeft } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function SellerSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    const linkBase = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
    const activeClasses = "bg-primary text-white";
    const inactiveClasses = "text-textMuted hover:bg-primary hover:text-white";

    return (
        <aside
            className={`fixed top-0 left-0 h-screen ${sidebarOpen ? "w-64" : "w-20"
                } bg-background shadow-[4px_0_6px_-1px_rgba(0,0,0,0.4)] border-r border-border transition-all duration-300 z-100`}
        >
            <div className="p-4">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-11 h-11 bg-primary rounded-lg flex items-center justify-center font-bold text-xl">
                        S
                    </div>
                    {sidebarOpen && (
                        <span className="text-xl font-semibold text-textMain">
                            Seller Panel
                        </span>
                    )}
                </div>

                <nav className="space-y-2">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `${linkBase} ${isActive ? activeClasses : inactiveClasses}`}
                    >
                        <Home className="w-5 h-5" />
                        {sidebarOpen && <span>Accueil</span>}
                    </NavLink>

                    <NavLink
                        to="/seller"
                        end
                        className={({ isActive }) => `${linkBase} ${isActive ? activeClasses : inactiveClasses}`}
                    >
                        <Package className="w-5 h-5" />
                        {sidebarOpen && <span>Mes produits</span>}
                    </NavLink>

                    <NavLink
                        to="/seller/orders"
                        className={({ isActive }) => `${linkBase} ${isActive ? activeClasses : inactiveClasses}`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {sidebarOpen && <span>Commandes</span>}
                    </NavLink>

                    <NavLink
                        to="/seller/coupons"
                        className={({ isActive }) => `${linkBase} ${isActive ? activeClasses : inactiveClasses}`}
                    >
                        <Percent className="w-5 h-5" />
                        {sidebarOpen && <span>Coupons</span>}
                    </NavLink>

                    <div className="flex justify-end mb-4">
                        <button
                            onClick={toggleSidebar}
                            className="flex items-center justify-center w-10 h-10 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg"
                        >
                            {sidebarOpen ? (
                                <ChevronsLeft className="w-5 h-5" />
                            ) : (
                                <ChevronsRight className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
}
