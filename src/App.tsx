import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";

// Layout & Contexts
import { AppShell } from "./components/layout/AppShell";
import { ToastProvider } from "./context/ToastContext";
import { SettingsProvider } from "./context/SettingsContext";
import { BrowseModeProvider } from "./context/BrowseModeContext";
import { WishlistProvider } from "./context/WishlistContext";
import AllProducts from "./pages/shop/AllProducts";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { useAuth } from "./lib/auth";
import PinVerify from "./pages/auth/PinVerify";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Shop Pages
import Home from "./pages/shop/Home";
import Search from "./pages/shop/Search";
import SearchResults from "./pages/shop/SearchResults";

import CategoryList from "./pages/shop/CategoryList";
import ProductDetail from "./pages/shop/ProductDetail";
import ProductReviews from "./pages/shop/ProductReviews";

// Cart & Checkout
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import PaymentProcessing from "./pages/checkout/PaymentProcessing";
import PaymentSuccess from "./pages/checkout/PaymentSuccess";

// Account Pages
import Profile from "./pages/account/Profile";
import EditProfile from "./pages/account/EditProfile";
import Orders from "./pages/account/Orders";
import OrderTracking from "./pages/account/OrderTracking";
import WriteReview from "./pages/account/WriteReview";
import ReviewDone from "./pages/account/ReviewDone";
import Wishlist from "./pages/account/Wishlist";

// Settings Pages
import Settings from "./pages/settings/Settings";
import ShippingAddress from "./pages/settings/ShippingAddress";
import EditShippingAddress from "./pages/settings/EditShippingAddress";
import Sizes from "./pages/settings/Sizes";
import Currency from "./pages/settings/Currency";
import Language from "./pages/settings/Language";
import Country from "./pages/settings/Country";
import Vouchers from "./pages/settings/Vouchers";
import Rewards from "./pages/settings/Rewards";
import About from "./pages/settings/About";

// Chat Support Page
import ChatSupport from "./pages/support/ChatSupport";
import AdminGate from "./pages/admin/AdminGate";

export default function App() {
  const { user, loading } = useAuth();
  const requireAuth = (element: ReactElement) => (user ? element : <Navigate to="/login" replace />);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-[3px] border-blue border-t-transparent animate-spin" />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <ToastProvider>
        <SettingsProvider>
          <BrowseModeProvider>
            <WishlistProvider>
              <CartProvider>
                <OrdersProvider>
                  <Routes>
                  {/* Authentication pathways */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/pin-verify" element={<PinVerify />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/adminpanel" element={<AdminGate />} />
                  <Route path="/admin" element={<Navigate to="/adminpanel" replace />} />

                  <Route element={<AppShell />}>
                    {/* Main Shop routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/search/results" element={<SearchResults />} />

                    {/* Categories system */}
                    <Route path="/category/:slug" element={<CategoryList />} />
                    <Route path="/all" element={<AllProducts />} />

                    {/* Products specifications */}
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/product/:id/reviews" element={<ProductReviews />} />

                    {/* Cart operations */}
                    <Route path="/cart" element={<Cart />} />

                    {/* Checkout and payments */}
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/checkout/processing" element={<PaymentProcessing />} />
                  <Route path="/checkout/success" element={<PaymentSuccess />} />

                    {/* Profile and client tracking */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<EditProfile />} />
                    <Route path="/wishlist" element={user ? <Wishlist /> : <Navigate to="/login" replace />} />

                    {/* Order histories and reviews */}
                    <Route path="/orders" element={requireAuth(<Orders />)} />
                    <Route path="/orders/:id/track" element={<OrderTracking />} />
                    <Route path="/orders/:id/review" element={<WriteReview />} />
                    <Route path="/orders/:id/review/done" element={<ReviewDone />} />

                    {/* System controls */}
                    <Route path="/settings" element={requireAuth(<Settings />)} />
                    <Route path="/settings/shipping-address" element={requireAuth(<ShippingAddress />)} />
                    <Route path="/settings/shipping-address/edit" element={requireAuth(<EditShippingAddress />)} />

                    {/* Metric lists */}
                    <Route path="/settings/sizes" element={requireAuth(<Sizes />)} />
                    <Route path="/settings/currency" element={requireAuth(<Currency />)} />
                    <Route path="/settings/language" element={requireAuth(<Language />)} />
                    <Route path="/settings/country" element={requireAuth(<Country />)} />
                    <Route path="/settings/vouchers" element={requireAuth(<Vouchers />)} />
                    <Route path="/settings/rewards" element={requireAuth(<Rewards />)} />
                    <Route path="/settings/about" element={requireAuth(<About />)} />

                    {/* Direct customer helper chat */}
                    <Route path="/support/chat" element={<ChatSupport />} />

                    {/* Wildcard redirects back to home store boards */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                  </Routes>
                </OrdersProvider>
              </CartProvider>
            </WishlistProvider>
          </BrowseModeProvider>
        </SettingsProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
