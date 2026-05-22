import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#F8FAFC] flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
          {product.isFlashSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
              Flash Deal
            </div>
          )}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn(
              'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center border transition-all',
              wishlisted
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-gray-100 text-gray-300 opacity-0 group-hover:opacity-100'
            )}
          >
            <Heart className={cn('w-4 h-4', wishlisted && 'fill-red-500')} />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-[#1E293B] text-sm line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition mb-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-[#2563EB] font-extrabold text-lg">
              {formatCurrency(product.price)}
            </span>
            <button
              onClick={handleAddToCart}
              className="h-8 w-8 bg-[#F1F5F9] rounded-full flex items-center justify-center text-[#64748B] hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#94A3B8]">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-bold text-[#475569]">{product.rating}</span>
            </div>
            <span className="font-medium">{product.soldCount.toLocaleString()} sold</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};