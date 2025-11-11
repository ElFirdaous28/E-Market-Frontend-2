import { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton';
import DarkToggel from './darkToggel';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
    ];


    return (
        <header className="bg-background border-b border-border shadow-md fixed top-0 left-0 w-full z-50">
            <nav className="container mx-auto px-2 md:px-4 lg:px-20 flex items-center justify-between h-20">

                {/* Logo */}
                {!user && <Logo />}

                {/* Mobile menu toggle */}
                <button
                    className="md:hidden text-textMain"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Search */}
                <div className="hidden md:block w-full max-w-md mx-6">
                    <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                        <input
                            type="text"
                            placeholder="Search Products..."
                            className="bg-brand-surface text-sm text-textMain w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-primary border border-border"
                        />
                    </div>
                </div>

                {/* Right section */}
                <div className="hidden md:flex items-center space-x-6">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`transition-colors ${location.pathname === item.path
                                ? "text-textMain"
                                : "text-textMuted hover:text-textMain"
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}

                    <DarkToggel />

                    <a href="#" className="relative text-textMuted hover:text-textMain">
                        <ShoppingCart className="w-6 h-6" />
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
                    </a>
                </div>

                {/* User Section */}
                <div
                    className="relative"
                    tabIndex={0} // allows onBlur to work
                    onBlur={() => setDropdownOpen(false)} // close dropdown when focus leaves
                >
                    {user ? (
                        <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                        >
                            {user.avatar ? (
                                <img
                                    src={user.avatar || '/default-avatar.png'}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 bg-surface rounded-full p-2" />
                            )}
                            <div className="hidden lg:block">
                                <div className="text-sm font-medium text-textMain">{user.fullname}</div>
                                <div className="text-xs text-textMain">{user.email}</div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/80"
                        >
                            Sign In
                        </Link>
                    )}

                    {/* Dropdown menu */}
                    {dropdownOpen && user && (
                        <div className="absolute right-0 mt-2 w-40 bg-surface rounded-md shadow-lg overflow-hidden pl-3 z-20">
                            <Link
                                to="/profile"
                                className="w-full block px-4 py-2 text-textMuted hover:bg-border"
                            >
                                Profile
                            </Link>
                            <LogoutButton />
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Menu */}
            {
                menuOpen && (
                    <div className="md:hidden bg-background border-t border-border shadow-md">
                        <div className="flex flex-col space-y-3 p-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMenuOpen(false)}
                                    className={`${location.pathname === item.path
                                        ? "text-textMain"
                                        : "text-textMuted hover:text-textMain"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <DarkToggel />
                            <a href="#" className="flex items-center space-x-2">
                                <ShoppingCart className="w-5 h-5" /> <span>Cart</span>
                            </a>
                        </div>
                    </div>
                )
            }
        </header >
    );
}