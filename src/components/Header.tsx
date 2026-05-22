import React, { useState, useEffect } from 'react';
import {
  Search, ShoppingCart, Heart, Menu, Bell, X, User,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

const NAV_LINKS = [
  { label: 'Home',        path: '/'          },
  { label: 'Electronics', path: '/category?type=electronics' },
  { label: 'Fashion',     path: '/category?type=fashion'     },
  { label: 'Flash Sale',  path: '/category?flash=1'          },
  { label: 'My Orders',   path: '/orders' },
];

export const Header: React.FC = () => {
  const { cartCount }     = useCart();
  const { wishlistCount } = useWishlist();
  const [searchValue, setSearchValue] = useState('');
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  // Scroll direction detection
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/category?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setMobileOpen(false);
    }
  };

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 w-full bg-[#FAFAF7] transition-transform duration-300',
        hidden && 'md:translate-y-0 -translate-y-full'
      )}
    >
      {/* ── Announcement bar ──────────────────────────────────── */}
      <div className="hidden md:block bg-stone-900">
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center h-9 text-[11px] font-medium text-stone-400">
          <div className="flex gap-4 items-center">
            <span>Free delivery on orders over ₱2,000</span>
            <span className="border-l border-stone-700 pl-4 text-amber-400 font-semibold">
              Cash on Delivery available nationwide
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">
              Support
            </span>
            <Link
              to="/cart"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-3 h-3" />
              Cart ({cartCount})
            </Link>
            <span className="border-l border-stone-700 pl-4 text-white font-semibold cursor-pointer">
              Login / Register
            </span>
          </div>
        </div>
      </div>

      {/* ── Main bar ──────────────────────────────────────────── */}
      <div className="border-b border-stone-200">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 md:h-20 items-center gap-4 md:gap-6">

            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <span className="font-display text-2xl font-bold tracking-tight text-stone-900">
                MERIDIAN
              </span>
              <span className="font-display text-2xl font-bold tracking-tight text-amber-600">
                MART
              </span>
            </Link>

            {/* Desktop search */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-2xl hidden md:flex"
            >
              <div className="w-full h-11 flex items-center bg-stone-100 border border-stone-200 rounded-xl px-4 gap-3 focus-within:bg-white focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search products…"
                  className="bg-transparent border-none outline-none w-full text-sm text-stone-700 placeholder-stone-400"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => setSearchValue('')}
                    className="text-stone-300 hover:text-stone-500 transition"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Action icons */}
            <div className="flex items-center gap-1.5 ml-auto md:ml-0">
              <button
                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-500 hover:bg-stone-200 transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>

              <Link
                to="/wishlist"
                className="relative hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-500 hover:bg-stone-200 transition"
                aria-label={`Wishlist — ${wishlistCount} item${wishlistCount !== 1 ? 's' : ''}`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-500 hover:bg-stone-200 transition"
                aria-label={`Cart — ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              <button
                className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition shadow-sm"
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 text-stone-600 hover:text-stone-900 transition"
                onClick={() => setMobileOpen(o => !o)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen
                  ? <X className="w-6 h-6" />
                  : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 pb-3">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-colors pb-2 border-b-2',
                  location.pathname + location.search === link.path ||
                  (link.path !== '/' && location.pathname.startsWith(link.path.split('?')) &&
                   (link.path.includes('?') ? location.search.includes(link.path.split('?')) : true))
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-stone-500 hover:text-stone-800',
                )}
              >
                {link.label}
                {link.label === 'Flash Sale' && (
                  <span className="ml-1.5 text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded uppercase align-middle">
                    Live
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-4">
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-stone-100 border border-stone-200 rounded-xl px-3 h-10 focus-within:border-amber-400 transition"
            >
              <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search products…"
                className="bg-transparent border-none outline-none w-full text-sm text-stone-700 placeholder-stone-400"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue('')}
                  className="text-stone-300 hover:text-stone-500 transition"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ── Mobile full-screen menu ───────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[calc(4rem+2.25rem)] bg-[#FAFAF7] z-40 overflow-y-auto border-t border-stone-200">
          <nav className="container mx-auto px-4 py-6 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition',
                  location.pathname === link.path.split('?')
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-stone-600 hover:bg-stone-100',
                )}
              >
                {link.label}
                {link.label === 'Flash Sale' && (
                  <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded uppercase">
                    Live
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-4 border-t border-stone-100 mt-4 space-y-2">
              <Link
                to="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 transition"
              >
                <span className="flex items-center gap-3">
                  <Heart className="w-4 h-4" /> Wishlist
                </span>
                {wishlistCount > 0 && (
                  <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 transition"
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4" /> Cart
                </span>
                {cartCount > 0 && (
                  <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 transition"
              >
                <User className="w-4 h-4" /> Profile
              </Link>
            </div>

            <div className="pt-4">
              <button className="w-full h-12 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition text-sm">
                Login / Register
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};