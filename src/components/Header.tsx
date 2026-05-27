import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppState } from '../lib/StateContext';
import { Search, Heart, ShoppingBag, User, Menu, X, Shirt, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { STATIC_PRODUCTS } from '../lib/seed';

export default function Header() {
  const { cart, wishlist, setSearchOpen, searchOpen, setCartOpen, stylistOpen, setStylistOpen } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Close loaders on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [location]);

  // Handle live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = STATIC_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
    setSearchResults(matches.slice(0, 5));
  }, [searchQuery]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Lookbook', path: '/lookbook' },
    { label: 'AI Stylist', path: '/stylist' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* COMPACT MOBILE TOP BAR: logo aligned to left, no top nav */}
      <header className="md:hidden sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-burgundy/5 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group ml-0" id="lnk-logo-mobile">
          <img 
            src="https://i.ibb.co/G4BYJN9h/Gemini-Generated-Image-j1yadkj1yadkj1ya-removebg-preview.png" 
            alt="Fab Ruby Logo" 
            className="w-9 h-9 object-contain transition duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col leading-none">
            <span className="font-logo text-sm tracking-[0.05em] font-bold text-brightred uppercase">Fab Ruby</span>
          </div>
        </Link>

        {/* Action Icons (mobile) - keep on the right, smaller */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSearchOpen(true)}
            id="btn-search-trigger-mobile"
            className="text-nearblack hover:text-burgundy transition cursor-pointer p-1"
            aria-label="Search items"
          >
            <Search className="w-5 h-5 pointer-events-none" />
          </button>

          <Link 
            to="/wishlist" 
            id="lnk-wishlist-mobile"
            className="text-nearblack hover:text-burgundy transition relative p-1"
            aria-label="Saved products"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link 
            to="/account" 
            id="lnk-account-mobile"
            className="text-nearblack hover:text-burgundy transition p-1"
            aria-label="User Account"
          >
            <User className="w-5 h-5" />
          </Link>

          <button 
            onClick={() => setCartOpen(true)}
            id="btn-cart-trigger-mobile"
            className="text-nearblack hover:text-burgundy transition relative cursor-pointer p-1"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 pointer-events-none" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-burgundy text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* FULL HEADER for md+ screens */}
      <header className="hidden md:flex sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-burgundy/5 px-6 py-4 md:px-12 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group" id="lnk-logo">
          <img 
            src="https://i.ibb.co/G4BYJN9h/Gemini-Generated-Image-j1yadkj1yadkj1ya-removebg-preview.png" 
            alt="Fab Ruby Logo" 
            className="w-11 h-11 object-contain transition duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="font-logo text-lg tracking-[0.05em] font-bold text-brightred uppercase leading-none">Fab Ruby</span>
            <span className="font-sans text-[9px] tracking-[0.25em] text-nearblack/60 uppercase font-medium leading-none">Clothiers · Lagos</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.label}
              to={link.path}
              id={`nav-link-${link.label.toLowerCase().replace(' ', '-')}`}
              className={`font-sans text-sm font-medium uppercase tracking-wider relative transition duration-300 py-1 ${
                location.pathname === link.path ? 'text-burgundy' : 'text-nearblack/70 hover:text-burgundy'
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-burgundy"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => setSearchOpen(true)}
            id="btn-search-trigger"
            className="text-nearblack hover:text-burgundy transition cursor-pointer"
            aria-label="Search items"
          >
            <Search className="w-5 h-5 pointer-events-none" />
          </button>

          <Link 
            to="/wishlist" 
            id="lnk-wishlist"
            className="text-nearblack hover:text-burgundy transition relative"
            aria-label="Saved products"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link 
            to="/account" 
            id="lnk-account"
            className="text-nearblack hover:text-burgundy transition"
            aria-label="User Account"
          >
            <User className="w-5 h-5" />
          </Link>

          <button 
            onClick={() => setCartOpen(true)}
            id="btn-cart-trigger"
            className="text-nearblack hover:text-burgundy transition relative cursor-pointer"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 pointer-events-none" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-burgundy text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MOBILE FULLSCREEN HAMBURGER OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-cream flex flex-col p-6"
            id="mobile-nav-overlay"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <img 
                  src="https://i.ibb.co/G4BYJN9h/Gemini-Generated-Image-j1yadkj1yadkj1ya-removebg-preview.png" 
                  alt="Fab Ruby Logo" 
                  className="w-11 h-11 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="font-logo text-lg tracking-[0.05em] font-bold text-brightred uppercase">Fab Ruby</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-burgundy p-2"
                id="btn-close-mobile-menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-center">
              {navLinks.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.label}
                >
                  <Link 
                    to={link.path}
                    className="font-serif text-3xl tracking-wide text-nearblack hover:text-burgundy transition py-2 block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <hr className="border-burgundy/10 my-4" />
              <Link
                to="/account"
                className="font-sans font-medium uppercase tracking-wider text-burgundy text-lg flex items-center justify-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" /> Account Details
              </Link>
            </nav>

            <div className="mt-auto text-center text-nearblack/50 text-xs">
              <p className="font-serif italic text-sm text-burgundy mb-1">"Dress Like You Mean It"</p>
              <p>© 2026 Fab Ruby Clothiers. Gbagada, Lagos.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN SEARCH OVERLAY */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-nearblack/90 backdrop-blur-md flex flex-col px-6 py-12 md:px-24"
            id="search-overlay"
          >
            <div className="flex justify-end mb-8">
              <button 
                onClick={() => setSearchOpen(false)}
                className="text-white hover:text-gold p-2 cursor-pointer transition"
                id="btn-close-search"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="max-w-3xl mx-auto w-full">
              <form onSubmit={handleSearchSubmit} className="relative mb-8">
                <input 
                  type="text"
                  placeholder="SEARCH WOMEN'S BLAZERS, SETS, DRESSES..."
                  className="w-full bg-transparent border-b-2 border-white/20 hover:border-white/50 focus:border-gold py-4 text-2xl md:text-3xl font-serif text-white outline-none placeholder:text-white/30 transition text-center focus:placeholder:opacity-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  id="inp-search-query"
                />
                <button type="submit" className="hidden" />
              </form>

              {/* Suggestions / Results */}
              <div className="mt-8 text-white">
                {searchResults.length > 0 ? (
                  <div>
                    <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/40 mb-4 font-bold">MATCHING CATALOGUE ITEMS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.map((p) => (
                        <Link 
                          key={p.id}
                          to={`/shop?id=${p.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg group transition"
                          id={`search-result-${p.id}`}
                        >
                          <img 
                            src={p.mainImage} 
                            alt={p.name}
                            className="w-12 h-16 object-cover rounded shadow"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-sans text-sm font-medium tracking-wide group-hover:text-gold transition text-white">{p.name}</p>
                            <p className="font-mono text-xs text-gold mt-0.5">₦{p.price.toLocaleString()}</p>
                            <p className="font-sans text-[10px] text-white/50 capitalize mt-0.5">{p.category}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : searchQuery.trim() ? (
                  <p className="text-center text-white/50 text-sm mt-12 font-serif italic">"No matching products found. Try looking for 'blazer', 'dress', or 'sets'."</p>
                ) : (
                  <div className="text-center md:text-left">
                    <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/40 mb-6 font-bold">TRENDING LOOKS RIGHT NOW</h3>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      {['Burgundy Power Set', 'Camel Blazer Set', 'Scarlet Wrap Dress', 'Noir Bodycon Midi'].map((term) => (
                        <button 
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-4 py-2 border border-white/15 hover:border-gold hover:text-gold text-xs font-sans tracking-widest text-white/80 rounded z-10 cursor-pointer transition"
                        >
                          {term.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE FLOATING PERSISTENT BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-md border-t border-burgundy/10 flex items-center justify-around py-3 px-2 shadow-lg">
        <Link 
          to="/" 
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition ${
            location.pathname === '/' ? 'text-burgundy font-black' : 'text-nearblack/50'
          }`}
          id="nav-mob-home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Home</span>
        </Link>

        <Link 
          to="/shop" 
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition ${
            location.pathname === '/shop' ? 'text-burgundy font-black' : 'text-nearblack/50'
          }`}
          id="nav-mob-shop"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Shop</span>
        </Link>

        <Link 
          to="/stylist"
          className={`flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
            location.pathname === '/stylist' ? 'text-burgundy font-black' : 'text-nearblack/50'
          }`}
          id="nav-mob-stylist"
        >
          <Shirt className={`w-5 h-5 ${location.pathname === '/stylist' ? 'animate-pulse text-burgundy' : ''}`} />
          <span className="text-[10px] uppercase tracking-widest font-bold">Stylist</span>
        </Link>
      </nav>
      {/* Spacer to prevent mobile floating bottom bar covering content */}
      <div className="md:hidden h-14" />
    </>
  );
}
