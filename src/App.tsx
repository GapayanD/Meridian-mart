import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import CategoryDetail from './pages/CategoryDetail';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import { Suspense, useEffect, lazy } from 'react';
import { ToastProvider } from './context/ToastContext';
import { OrderProvider } from './context/OrderContext';
import { OfflineBanner } from './components/OfflineBanner'; 

// Lazy loaded components
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const OrderDetail  = lazy(() => import('./pages/OrderDetail'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, [pathname]);
  return null;
}

// Added the missing PageLoader component required by <Suspense>
const PageLoader = () => (
  <div className="flex items-center justify-center py-32">
    <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <ToastProvider>
      <OrderProvider>
        <CartProvider>
          <WishlistProvider> 
            <BrowserRouter>
              
              {/* Placed inside the router, right before the routes */}
              <OfflineBanner /> 
              <ScrollToTop />

              {/* Wraps all routes to safely handle the lazy-loaded components */}
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* ── Public storefront ─────────────────────────────── */}
                  <Route path="/" element={<Layout><Home /></Layout>} />
                  <Route path="/category" element={<Layout><CategoryDetail /></Layout>} />
                  <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
                  <Route path="/cart" element={<Layout><Cart /></Layout>} />
                  <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
                  <Route path="/profile" element={<Layout><Profile /></Layout>} />
                  <Route path="/orders" element={<Layout><OrderHistory /></Layout>} />
                  <Route path="/orders/:orderId" element={<Layout><OrderDetail /></Layout>} />

                  {/* ── Admin (no storefront Layout) ──────────────────── */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin/orders"
                    element={<AdminLayout><AdminOrders /></AdminLayout>}
                  />
                  <Route
                    path="/admin/products"
                    element={<AdminLayout><AdminProducts /></AdminLayout>}
                  />
                  <Route
                    path="/admin"
                    element={<AdminLayout><AdminOrders /></AdminLayout>}
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Layout><Home /></Layout>} />
                </Routes>
              </Suspense>

            </BrowserRouter>
          </WishlistProvider> 
        </CartProvider>
      </OrderProvider> 
    </ToastProvider>
  );
}