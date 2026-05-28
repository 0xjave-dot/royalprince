import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppState } from '../lib/StateContext';
import { STATIC_PRODUCTS } from '../lib/seed';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import VirtualTryOnModal from '../components/VirtualTryOnModal';
import { Filter, SlidersHorizontal, Heart, MessageSquare, Star, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STATIC_REVIEWS = [
  { id: 'r1', name: 'Funmi O.', rating: 5, date: 'May 12, 2026', comment: 'The material of this Scarlet dress is heavy and premium, not cheap at all! Got so many compliments at a wedding in Ikoyi. Exquisite workmanship.', verified: true },
  { id: 'r2', name: 'Kemi A.', rating: 5, date: 'May 10, 2026', comment: 'Extremely perfect shoulders on the Camel Blazer! It fits exactly as described. Best tailored suit I have purchased in Nigeria.', verified: true },
  { id: 'r3', name: 'Tosin D.', rating: 4, date: 'Apr 28, 2026', comment: 'Breezy Ivory shift dress. Perfect for afternoon Lagos brunch. Fits slightly loose, so keep that in mind babe, but it feels so luxurious.', verified: true },
];

export default function Shop() {
  const { wishlist, toggleWishlist, addToCart } = useAppState();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL parameters query sync
  const categoryFilter = searchParams.get('category') || 'All';
  const sizeFilter = searchParams.get('size') || 'All';
  const sortOption = searchParams.get('sort') || 'featured';
  const searchQuery = searchParams.get('q') || '';
  const selectedproductId = searchParams.get('id');

  // Local state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailSize, setDetailSize] = useState('M');
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>(STATIC_REVIEWS);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Sync selected product detail from URL ?id=productId
  useEffect(() => {
    if (selectedproductId) {
      const match = STATIC_PRODUCTS.find(p => p.id === selectedproductId);
      if (match) {
        setSelectedProduct(match);
        setDetailSize(match.sizes[0]);
      } else {
        setSelectedProduct(null);
      }
    } else {
      setSelectedProduct(null);
    }
  }, [selectedproductId]);

  // Sync tryon mode from URL ?tryon=true
  useEffect(() => {
    if (searchParams.get('tryon') === 'true') {
      setTryOnOpen(true);
      // Clean query parameter after trigger
      const next = new URLSearchParams(searchParams);
      next.delete('tryon');
      setSearchParams(next);
    }
  }, [searchParams]);

  // Handle filtrations
  const filteredProducts = STATIC_PRODUCTS.filter((product) => {
    // 1. Category Filter Choice
    if (categoryFilter !== 'All') {
      if (product.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }
    }
    // 2. Size Filter Choice
    if (sizeFilter !== 'All' && !product.sizes.includes(sizeFilter)) {
      return false;
    }
    // 3. Search Query terms
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchDesc) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    // Sort logic
    if (sortOption === 'low-high') {
      return a.price - b.price;
    }
    if (sortOption === 'high-low') {
      return b.price - a.price;
    }
    return 0; // featured defaults
  });

  const handleSetCategory = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') next.delete('category');
    else next.set('category', cat);
    setSearchParams(next);
  };

  const handleSetSize = (sz: string) => {
    const next = new URLSearchParams(searchParams);
    if (sz === 'All') next.delete('size');
    else next.set('size', sz);
    setSearchParams(next);
  };

  const handleSetSort = (s: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', s);
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;
    const rev = {
      id: "r-" + Math.random(),
      name: newReviewName,
      comment: newReviewText,
      rating: newReviewRating,
      date: 'Today',
      verified: true
    };
    setReviews(prev => [rev, ...prev]);
    setNewReviewName('');
    setNewReviewText('');
    setNewReviewRating(5);
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-6 md:px-12 max-w-7xl mx-auto w-full" id="shop-page-root">
      
      {/* Search Header notification */}
      {searchQuery && (
        <div className="mb-8 p-4 bg-burgundy/5 border border-burgundy/15 rounded-xl flex items-center justify-between">
          <p className="font-serif text-sm text-burgundy italic">Showing results for query: <span className="font-sans not-italic font-bold">"{searchQuery}"</span></p>
          <button onClick={clearAllFilters} className="text-xs font-sans font-bold uppercase text-nearblack hover:text-burgundy underline">Clear Query</button>
        </div>
      )}

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: FILTERS RAIL */}
        <div className="lg:col-span-1 flex flex-col gap-8 bg-white border border-burgundy/10 p-6 rounded-2xl h-fit sticky top-28">
          <div className="flex items-center justify-between border-b border-burgundy/10 pb-4">
            <h2 className="font-serif text-lg uppercase tracking-wider font-bold text-burgundy flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters Closet
            </h2>
            <button 
              onClick={clearAllFilters}
              className="text-[10px] font-sans font-bold uppercase text-nearblack/50 hover:text-burgundy cursor-pointer underline"
            >
              Reset All
            </button>
          </div>

          {/* Categories select checklist */}
          <div className="flex flex-col gap-3">
            <h3 className="font-sans text-[10px] tracking-widest font-black uppercase text-burgundy mb-2">Category Collections</h3>
            {['All', 'Two-pieces', 'Bags', 'Dresses', 'Shoes'].map((cat) => (
              <button 
                key={cat}
                onClick={() => handleSetCategory(cat)}
                className={`text-left text-sm font-sans tracking-wide py-1 border-l-2 pl-3 transition cursor-pointer ${
                  categoryFilter === cat || (cat === 'All' && categoryFilter === 'All')
                    ? 'border-burgundy text-burgundy font-bold' 
                    : 'border-transparent text-nearblack/60 hover:text-burgundy'
                }`}
              >
                {cat === 'All' ? 'All Silhouettes' : cat}
              </button>
            ))}
          </div>

          {/* Sizes filter list */}
          <div>
            <h3 className="font-sans text-[10px] tracking-widest font-black uppercase text-burgundy mb-4">Search by Sizing</h3>
            <div className="grid grid-cols-3 gap-2">
              {['All', 'XS', 'S', 'M', 'L', 'XL', 'O/S'].map((sz) => (
                <button 
                  key={sz}
                  onClick={() => handleSetSize(sz)}
                  className={`border font-mono font-bold text-xs py-2 rounded-lg cursor-pointer transition ${
                    sizeFilter === sz 
                      ? 'bg-burgundy text-white border-burgundy' 
                      : 'bg-white text-nearblack border-burgundy/15 hover:border-burgundy'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting drawer */}
          <div>
            <h3 className="font-sans text-[10px] tracking-widest font-black uppercase text-burgundy mb-3">Order Hierarchy</h3>
            <select 
              value={sortOption}
              onChange={(e) => handleSetSort(e.target.value)}
              className="w-full bg-cream/70 border border-burgundy/15 px-3 py-2.5 rounded-lg outline-none font-sans text-xs tracking-wider uppercase font-medium"
              id="sel-sort-option"
            >
              <option value="featured">Featured Selections</option>
              <option value="low-high">₦ Price: Low to High</option>
              <option value="high-low">₦ Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCTS ARCHIVES */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-burgundy/10 rounded-2xl p-8 flex flex-col items-center justify-center">
              <Filter className="w-12 h-12 text-burgundy/20 mb-4" />
              <p className="font-serif text-xl italic text-nearblack/70">"No garments found matching your select parameters."</p>
              <p className="text-xs text-nearblack/40 mt-1 uppercase max-w-sm">Try reseting filters or searching with general look files like blazers or dresses.</p>
              <button 
                onClick={clearAllFilters}
                className="mt-6 bg-burgundy hover:bg-nearblack text-white font-sans text-xs font-black tracking-widest uppercase px-6 py-3 rounded-xl shadow cursor-pointer transition"
              >
                RESET FILTERS CLOSET
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((p) => (
                <React.Fragment key={p.id}>
                  <ProductCard product={p} />
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* FULL RANGE PRODUCT DETAIL PAGE - SLIDING DETAILED VIEWPORT PANEL OVERLAY */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            {/* Backdrop mesh */}
            <div 
              className="fixed inset-0 z-40 bg-nearblack/70 backdrop-blur-sm cursor-pointer"
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.delete('id');
                setSearchParams(next);
              }}
              id="detail-mask"
            />

            {/* Scrolling Slate drawer container */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-3xl bg-cream border-l border-gold/15 shadow-2xl flex flex-col h-full overflow-hidden"
              id="product-detail-layout"
            >
              {/* Floating Header */}
              <div className="p-5 border-b border-burgundy/10 bg-cream/90 backdrop-blur flex items-center justify-between sticky top-0 z-10">
                <button 
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete('id');
                    setSearchParams(next);
                  }}
                  className="font-sans text-xs uppercase font-black tracking-widest text-burgundy flex items-center gap-1.5 cursor-pointer leading-none"
                  id="btn-back-to-archives"
                >
                  <ArrowLeft className="w-4 h-4" /> BACK TO ALL COLLECTIONS
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className="p-1.5 text-burgundy rounded hover:scale-105 transition"
                  >
                    <Heart className={`w-5 h-5 ${wishlist.includes(selectedProduct.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Scrollable details Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12">
                
                {/* Visual splits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  
                  {/* Left segment: Image sliders */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border bg-white group shadow-lg">
                    <img 
                      src={selectedProduct.mainImage} 
                      alt={selectedProduct.name} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 flex gap-1.5">
                      {selectedProduct.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="bg-burgundy text-gold text-[8px] font-black font-sans tracking-widest uppercase px-2 py-0.5 rounded shadow">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right segment: Detailed purchase forms */}
                  <div className="flex flex-col gap-6">
                    <div>
                      <span className="font-sans text-[10px] tracking-widest uppercase text-nearblack/40 font-black">{selectedProduct.category}</span>
                      <h1 className="font-serif text-2xl md:text-3xl font-bold text-nearblack uppercase mt-1 leading-tight">{selectedProduct.name}</h1>
                      <p className="font-mono text-xl font-black text-burgundy mt-2">₦{selectedProduct.price.toLocaleString()}</p>
                    </div>

                    <p className="text-sm text-nearblack/75 leading-relaxed font-sans">{selectedProduct.description}</p>
                    
                    {/* Size selectors */}
                    <div>
                      <span className="block font-sans text-[10px] tracking-widest uppercase font-black text-burgundy mb-2">SIZE MATRIX:</span>
                      <div className="flex flex-wrap gap-2 text-center">
                        {selectedProduct.sizes.map((sz) => (
                          <button 
                            key={sz}
                            onClick={() => setDetailSize(sz)}
                            className={`px-4.5 py-2.5 font-mono font-bold text-xs rounded-lg cursor-pointer transition border ${
                              detailSize === sz 
                                ? 'bg-burgundy text-white border-burgundy shadow' 
                                : 'bg-white text-nearblack border-burgundy/15 hover:border-burgundy'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick try-on drawer banner inside */}
                    <div className="p-4 bg-burgundy/5 border border-burgundy/10 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div>
                          <p className="font-sans text-xs font-bold text-burgundy uppercase leading-none">VIRTUAL DRESS ROOM</p>
                          <p className="text-[10px] text-nearblack/60 italic font-serif mt-1">Drape this look over Sade to check silhouette fit.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setTryOnOpen(true)}
                        className="bg-burgundy text-white px-3 py-1.5 font-sans font-bold text-[9px] tracking-widest uppercase rounded hover:bg-nearblack cursor-pointer transition whitespace-nowrap"
                      >
                        TRY IT ON
                      </button>
                    </div>

                    {/* Main action triggers */}
                    <button 
                      onClick={() => addToCart(selectedProduct, detailSize)}
                      className="w-full bg-nearblack hover:bg-burgundy text-white font-sans text-xs uppercase font-black tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 shadow-2xl transition cursor-pointer"
                      id="btn-detail-add-to-bag"
                    >
                      <ShoppingBag className="w-4 h-4 text-gold" />
                      ADD TO SHOPPING BAG
                    </button>
                  </div>
                </div>

                {/* Verified Customer Reviews segmentation */}
                <div className="border-t border-burgundy/10 pt-10 space-y-6">
                  <div className="flex justify-between items-baseline border-b border-burgundy/5 pb-4">
                    <h3 className="font-serif text-lg uppercase tracking-wider font-bold text-burgundy flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-burgundy" /> Customers Feedback
                    </h3>
                    <span className="text-xs text-nearblack/50 font-mono">3 Verified Reviews (4.8 Stars Avg)</span>
                  </div>

                  {/* Add Review inline form */}
                  <form onSubmit={handleAddReview} className="bg-white p-5 rounded-2xl border border-burgundy/5 space-y-4">
                    <p className="font-serif text-sm font-semibold text-burgundy">Share Your Fitting Review:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] tracking-widest font-black uppercase text-nearblack/45 mb-1.5">Your Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Adebisi K."
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          className="w-full text-xs font-sans p-2.5 bg-cream/40 border border-burgundy/15 rounded outline-none"
                          required
                          id="inp-rev-name"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] tracking-widest font-black uppercase text-nearblack/45 mb-1.5">Rating (1 to 5 Stars)</label>
                        <select 
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="w-full text-xs font-sans p-2.5 bg-cream/40 border border-burgundy/15 rounded outline-none font-medium"
                          id="sel-rev-rating"
                        >
                          <option value="5">★★★★★ Outstanding Style (5/5)</option>
                          <option value="4">★★★★ Very Classy Fit (4/5)</option>
                          <option value="3">★★★ Average Sizing (3/5)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] tracking-widest font-black uppercase text-nearblack/45 mb-1.5">Fabric & Match Comments</label>
                      <textarea 
                        placeholder="Tell the community how the garment drapes and aligns..."
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        rows={3}
                        className="w-full text-xs font-sans p-3 bg-cream/40 border border-burgundy/15 rounded outline-none resize-none"
                        required
                        id="inp-rev-comment"
                      />
                    </div>
                    <button 
                      type="submit" 
                      id="btn-rev-submit"
                      className="bg-burgundy text-white hover:bg-gold text-[9px] font-sans font-black tracking-widest uppercase px-5 py-2.5 rounded transition cursor-pointer"
                    >
                      PUBLISH FEEDBACK
                    </button>
                  </form>

                  {/* Existing Review loop */}
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-white/70 border border-burgundy/5 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-xs text-nearblack/75">
                          <span className="font-sans font-semibold text-burgundy">{rev.name}</span>
                          <span className="font-mono text-nearblack/40">{rev.date}</span>
                        </div>
                        <div className="flex gap-1 text-gold">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-nearblack/75 leading-relaxed italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Try-on popup view portal */}
      {tryOnOpen && selectedProduct && (
        <VirtualTryOnModal 
          isOpen={tryOnOpen} 
          onClose={() => setTryOnOpen(false)} 
          initialProduct={selectedProduct}
        />
      )}
    </div>
  );
}
