import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { lazy } from 'react';
import { Link } from 'react-router-dom';
const Logo = lazy(() => import('./Logo'));

export default function Footer() {
  return (
    <footer className="mt-20 bg-background border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.4)] z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Logo />
            <p className="mt-4 text-textMuted text-sm max-w-xs">
              The best place to shop for high-quality products at the best prices.
            </p>
          </div>

          <div>
            <p role="heading" aria-level="2" className="text-lg font-semibold text-textMain">
              Quick Links
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to='/' className="text-textMuted hover:text-textMain text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to='/' className="text-textMuted hover:text-textMain text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to='/' className="text-textMuted hover:text-textMain text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to='/' className="text-textMuted hover:text-textMain text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p role="heading" aria-level="2" className="text-lg font-semibold text-textMain">
              Customer Service
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to='/' className="text-textMuted hover:text-textMain text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to='/' className="text-textMuted hover:text-textMain text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to='/' className="text-textMuted hover:text-textMain text-sm">
                  Returns
                </Link>
              </li>
              <li>
                <Link to='/' className="text-textMuted hover:text-textMain text-sm">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p role="heading" aria-level="2" className="text-lg font-semibold text-textMain">
              Newsletter
            </p>
            <p className="mt-4 text-textMuted text-sm">Get special offers and updates.</p>
            <button className="mt-4 bg-brand-green text-textMain px-5 py-2 rounded-lg font-semibold  border border-primary hover:bg-primary transition-colors text-sm">
              Sign Up
            </button>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">&copy; 2024 E-Market. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to='/' aria-label="Instagram" className="text-textMuted hover:text-textMain">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link to='/' aria-label="LinkedIn" className="text-textMuted hover:text-textMain">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link to='/' aria-label="Facebook" className="text-textMuted hover:text-textMain">
              <Facebook className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
