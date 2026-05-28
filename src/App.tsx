import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StateProvider } from './lib/StateContext';
import { seedDatabase } from './lib/seed';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AIStylistChat from './components/AIStylistChat';
import { AnimatePresence } from 'motion/react';
import PageTransitionWrapper from './components/PageTransitionWrapper';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import OrderConfirmation from './pages/OrderConfirmation';
import Lookbook from './pages/Lookbook';
import Stylist from './pages/Stylist';

function AppContent() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-cream selection:bg-burgundy selection:text-white">
      <Header />
      <CartDrawer />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <React.Fragment key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<PageTransitionWrapper><Home /></PageTransitionWrapper>} />
              <Route path="/shop" element={<PageTransitionWrapper><Shop /></PageTransitionWrapper>} />
              <Route path="/wishlist" element={<PageTransitionWrapper><Wishlist /></PageTransitionWrapper>} />
              <Route path="/account" element={<PageTransitionWrapper><Account /></PageTransitionWrapper>} />
              <Route path="/order-confirmation" element={<PageTransitionWrapper><OrderConfirmation /></PageTransitionWrapper>} />
              <Route path="/lookbook" element={<PageTransitionWrapper><Lookbook /></PageTransitionWrapper>} />
              <Route path="/stylist" element={<PageTransitionWrapper><Stylist /></PageTransitionWrapper>} />
            </Routes>
          </React.Fragment>
        </AnimatePresence>
      </main>
      
      <Footer />
      <AIStylistChat />
    </div>
  );
}

export default function App() {
  // Automatically seed the catalogue collections on startup
  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <StateProvider>
      <Router>
        <AppContent />
      </Router>
    </StateProvider>
  );
}
