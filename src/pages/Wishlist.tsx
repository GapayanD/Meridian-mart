import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { products as mockProducts } from '../data/mock';
import { isSupabaseConfigured } from '../lib/supabase';
import { useEffect } from 'react';

const Wishlist: React.FC = () => {
  const { wishlist } = useWishlist();
  const { products: dbProducts, loading } = useProducts({});

  const allProducts = isSupabaseConfigured
    ? dbProducts.map(p => ({
        id: p.id, name: p.name, price: p.price,
        originalPrice: p.original_price ?? undefined,
        image: p.image, images: p.images, category: p.category,
        rating: p.rating, reviewsCount: p.reviews_count,
        soldCount: p.sold_count, description: p.description,
        variants: p.variants, isFlashSale: p.is_flash_sale,
      }))
    : mockProducts;
    
  useEffect(() => {
    if (!loading && dbProducts.length > 0) {
      const validIds = new Set(dbProducts.map(p => p.id));
      const staleIds = wishlist.filter(id => !validIds.has(id));
      if (staleIds.length > 0) {
        staleIds.forEach(id => {
          // Toggle twice = remove
          // Or better: expose a `removeFromWishlist` function
        });
      }
    }
  }, [loading, dbProducts]);

  const wishlisted = allProducts.filter(p => wishlist.includes(p.id));

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 bg-pink-50 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-pink-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mt-2 mb-8 max-w-xs">
          Tap the heart on any product to save it here.
        </p>
        <Link to="/" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Your Wishlist</h2>
        <p className="text-sm text-gray-500 mt-1">
          {wishlisted.length} saved item{wishlisted.length !== 1 ? 's' : ''}
        </p>
      </div>
      {loading ? (
        <p className="text-gray-400 text-sm animate-pulse">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlisted.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;