import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useProducts, DBProduct } from '../hooks/useProducts';
import { products as mockProducts } from '../data/mock';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  X,
  Filter,
} from 'lucide-react';
import { cn } from '../lib/utils';

// ── Types ──────────────────────────────────────────────────────────────────────
type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'sold';

interface PriceRange {
  label: string;
  min: number;
  max: number;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const PRICE_RANGES: PriceRange[] = [
  { label: 'Under ₱1,500',          min: 0,     max: 1500     },
  { label: '₱1,500 – ₱6,000',       min: 1500,  max: 6000     },
  { label: '₱6,000 – ₱30,000',      min: 6000,  max: 30000    },
  { label: 'Above ₱30,000',         min: 30000, max: Infinity  },
];

const RATING_FILTERS = [5, 4, 3];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Relevance',      value: 'relevance'  },
  { label: 'Price: Low–High',value: 'price-asc'  },
  { label: 'Price: High–Low',value: 'price-desc' },
  { label: 'Top Rated',      value: 'rating'     },
  { label: 'Best Selling',   value: 'sold'       },
];

// ── Skeleton ───────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden animate-pulse">
    <div className="aspect-square bg-stone-100" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-stone-100 rounded w-3/4" />
      <div className="h-3 bg-stone-100 rounded w-1/2" />
      <div className="h-5 bg-stone-100 rounded w-1/3 mt-4" />
    </div>
  </div>
);

// ── Normalise DB → ProductCard shape ──────────────────────────────────────────
function toCardProduct(p: DBProduct) {
  return {
    id:            p.id,
    name:          p.name,
    price:         p.price,
    originalPrice: p.original_price ?? undefined,
    image:         p.image,
    images:        p.images,
    category:      p.category,
    rating:        p.rating,
    reviewsCount:  p.reviews_count,
    soldCount:     p.sold_count,
    description:   p.description,
    variants:      p.variants,
    isFlashSale:   p.is_flash_sale,
  };
}

// ── Component ──────────────────────────────────────────────────────────────────
const CategoryDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const search    = searchParams.get('search') ?? undefined;
  const type      = searchParams.get('type')   ?? undefined;
  const flashOnly = searchParams.get('flash') === '1';

  // Filter + sort state
  const [priceRange,    setPriceRange]    = useState<PriceRange | null>(null);
  const [minRating,     setMinRating]     = useState<number | null>(null);
  const [sortBy,        setSortBy]        = useState<SortOption>('relevance');
  const [mobileFilters, setMobileFilters] = useState(false);

  // Live Supabase fetch
  const { products: dbProducts, loading } = useProducts({
    category:      type,
    search,
    flashSaleOnly: flashOnly || undefined,
  });

  // Mock fallback when Supabase is not configured
  const filteredMock = useMemo(() => {
    if (isSupabaseConfigured) return [];
    return mockProducts.filter(p => {
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchType  = !type || p.category.toLowerCase() === type.toLowerCase();
      const matchFlash = !flashOnly || p.isFlashSale;
      const matchPrice = !priceRange ||
        (p.price >= priceRange.min && p.price < priceRange.max);
      const matchRating = !minRating || p.rating >= minRating;
      return matchSearch && matchType && matchFlash && matchPrice && matchRating;
    });
  }, [search, type, flashOnly, priceRange, minRating]);

  // Apply client-side filters + sort to DB products
  const products = useMemo(() => {
    let list = isSupabaseConfigured
      ? dbProducts.map(toCardProduct)
      : filteredMock;

    // Price filter (for DB results — Supabase query doesn't filter price)
    if (priceRange && isSupabaseConfigured) {
      list = list.filter(
        p => p.price >= priceRange.min && p.price < priceRange.max,
      );
    }

    // Rating filter
    if (minRating && isSupabaseConfigured) {
      list = list.filter(p => p.rating >= minRating);
    }

    // Sort
    const sorted = [...list];
    switch (sortBy) {
      case 'price-asc':  sorted.sort((a, b) => a.price - b.price);           break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price);           break;
      case 'rating':     sorted.sort((a, b) => b.rating - a.rating);         break;
      case 'sold':       sorted.sort((a, b) => b.soldCount - a.soldCount);   break;
      default:           break;
    }
    return sorted;
  }, [dbProducts, filteredMock, priceRange, minRating, sortBy]);

  const isLoading = isSupabaseConfigured && loading;

  const activeFilterCount =
    (priceRange ? 1 : 0) + (minRating ? 1 : 0);

  const clearFilters = () => {
    setPriceRange(null);
    setMinRating(null);
  };

  const pageTitle = search
    ? `Results for "${search}"`
    : flashOnly
    ? 'Flash Sale'
    : type
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : 'All Products';

  // ── Sidebar content (shared between desktop and mobile) ────────────────────
  const SidebarFilters = () => (
    <div className="space-y-8">
      {/* Price range */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Price Range
        </h4>
        <div className="space-y-2.5">
          {PRICE_RANGES.map(r => (
            <label
              key={r.label}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all',
                    priceRange?.label === r.label
                      ? 'border-amber-600 bg-amber-600'
                      : 'border-stone-200 group-hover:border-amber-400',
                  )}
                >
                  {priceRange?.label === r.label && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm transition-colors',
                    priceRange?.label === r.label
                      ? 'text-amber-700 font-semibold'
                      : 'text-stone-500 group-hover:text-stone-700',
                  )}
                >
                  {r.label}
                </span>
              </div>
              <input
                type="radio"
                name="price"
                className="sr-only"
                checked={priceRange?.label === r.label}
                onChange={() =>
                  setPriceRange(
                    priceRange?.label === r.label ? null : r,
                  )
                }
              />
            </label>
          ))}
        </div>
        {priceRange && (
          <button
            onClick={() => setPriceRange(null)}
            className="mt-3 text-xs text-amber-700 font-semibold hover:underline"
          >
            Clear price filter
          </button>
        )}
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-4">
          Customer Rating
        </h4>
        <div className="space-y-2.5">
          {RATING_FILTERS.map(r => (
            <label
              key={r}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all',
                  minRating === r
                    ? 'border-amber-600 bg-amber-600'
                    : 'border-stone-200 group-hover:border-amber-400',
                )}
              >
                {minRating === r && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span
                className={cn(
                  'text-sm flex items-center gap-1 transition-colors',
                  minRating === r
                    ? 'text-amber-700 font-semibold'
                    : 'text-stone-500 group-hover:text-stone-700',
                )}
              >
                {'★'.repeat(r)}{'☆'.repeat(5 - r)}
                <span className="text-stone-400 ml-1">&amp; up</span>
              </span>
              <input
                type="radio"
                name="rating"
                className="sr-only"
                checked={minRating === r}
                onChange={() => setMinRating(minRating === r ? null : r)}
              />
            </label>
          ))}
        </div>
        {minRating && (
          <button
            onClick={() => setMinRating(null)}
            className="mt-3 text-xs text-amber-700 font-semibold hover:underline"
          >
            Clear rating filter
          </button>
        )}
      </div>

      {/* Clear all */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-500 hover:border-stone-300 hover:text-stone-700 transition"
        >
          Clear all filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ── Top bar ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            {pageTitle}
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            {isLoading
              ? 'Loading…'
              : `${products.length} item${products.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilters(true)}
            className={cn(
              'lg:hidden flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition',
              activeFilterCount > 0
                ? 'border-amber-300 bg-amber-50 text-amber-700'
                : 'border-stone-200 text-stone-500 hover:bg-stone-50',
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View toggles */}
          <div className="flex items-center gap-1 border-r border-stone-100 pr-3 mr-1">
            <button
              className="p-2 bg-amber-50 text-amber-700 rounded-lg"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-stone-300 hover:bg-stone-50 rounded-lg transition"
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="appearance-none h-10 pl-3 pr-8 border border-stone-200 bg-white rounded-xl text-sm font-medium text-stone-600 outline-none focus:border-amber-400 cursor-pointer transition"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ───────────────────────────────── */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <h3 className="font-display font-bold text-stone-900">Filters</h3>
              <button
                onClick={() => setMobileFilters(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-50 transition"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <SidebarFilters />
            </div>
            <div className="p-5 border-t border-stone-100">
              <button
                onClick={() => setMobileFilters(false)}
                className="w-full h-12 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition"
              >
                Show {products.length} result{products.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main layout ───────────────────────────────────────── */}
      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-28">
            <SidebarFilters />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {priceRange && (
                <button
                  onClick={() => setPriceRange(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full hover:bg-amber-100 transition"
                >
                  {priceRange.label}
                  <X className="w-3 h-3" />
                </button>
              )}
              {minRating && (
                <button
                  onClick={() => setMinRating(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full hover:bg-amber-100 transition"
                >
                  {minRating}★ &amp; up
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-5 border border-stone-100">
                <Filter className="w-9 h-9 text-stone-300" />
              </div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                No matching products
              </h3>
              <p className="text-stone-400 text-sm max-w-xs mt-2">
                Try adjusting your filters, sort order, or search keywords.
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-5 px-6 py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition text-sm"
                >
                  Clear all filters
                </button>
              )}
              {activeFilterCount === 0 && (
                <button
                  onClick={() => window.history.back()}
                  className="mt-5 px-6 py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition text-sm"
                >
                  Go Back
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;