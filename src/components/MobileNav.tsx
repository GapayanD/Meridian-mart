import React from 'react';
import { Home, Grid, ShoppingBag, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { cn } from '../lib/utils';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const navItems = [
    { icon: Home,       label: 'Home',     path: '/' },
    { icon: Grid,       label: 'Browse',   path: '/category' },
    { icon: ShoppingBag,label: 'Cart',     path: '/cart',     badge: cartCount },
    { icon: Heart,      label: 'Wishlist', path: '/wishlist', badge: wishlistCount },
    { icon: User,       label: 'Profile',  path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#FAFAF7] border-t border-stone-200 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                isActive ? 'text-amber-700' : 'text-stone-400'
              )}
            >
              <div className="relative">
                <Icon className={cn('w-6 h-6', isActive && 'stroke-[2.5px]')} />
                {item.badge ? (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[8px] font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};