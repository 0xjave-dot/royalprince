import React, { useState, useEffect } from 'react';
import { useAppState } from '../lib/StateContext';
import { STATIC_PRODUCTS } from '../lib/seed';
import { ProductCard } from '../components/ProductCard';
import VirtualTryOnModal from '../components/VirtualTryOnModal';
import { ArrowRight, MessageSquare, Heart, X, ChevronLeft, ChevronRight, Bell, ShoppingBag, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import CategoryTiltCard from '../components/CategoryTiltCard';
import HeroCarousel from '../components/HeroCarousel';
import ShopTheFit from '../components/ShopTheFit';

const GALLERY_ITEMS = [
  {
    id: "gallery-boutique-1",
    title: "Flagship Walk-In",
    tag: "Boutique Space",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop",
    desc: "Our Gbagada sanctuary where luxury meets personalized style guidance. Stop by today for standard client fittings.",
    isReel: false,
    bentoClass: "md:col-span-2 md:row-span-1 md:min-h-[300px]"
  },
  {
    id: "gallery-reel-1",
    title: "Styling Camel Sets",
    tag: "Instagram Reel",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&auto=format&fit=crop",
    desc: "\"One suit, three distinct ways.\" 15k+ luxury views. Our signature aesthetic matched for business, brunch, and social events.",
    isReel: true,
    bentoClass: "md:col-span-1 md:row-span-2 md:min-h-[400px]"
  },
  {
    id: "gallery-client-1",
    title: "Kemi in Scarlet Wrap",
    tag: "Client Diary",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop",
    desc: "Looking absolutely radiant for a luxury dinner setup in Victoria Island. Pure linen elegance commanding the room!",
    isReel: false,
    bentoClass: "md:col-span-1 md:row-span-1 md:min-h-[240px]"
  },
  {
    id: "gallery-boutique-2",
    title: "Golden Hangers",
    tag: "The Collections",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop",
    desc: "Every thread is chosen painstakingly. Feel the pure premium texture of heavy linen, luxury crepes, and breathable knits.",
    isReel: false,
    bentoClass: "md:col-span-1 md:row-span-1 md:min-h-[240px]"
  },
  {
    id: "gallery-reel-2",
    title: "Lekki Brunch Aesthetic",
    tag: "Instagram Reel",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop",
    desc: "Vibrant co-ord transitions for high-fashion sunny Saturdays. The ultimate statement that matches your positive aura.",
    isReel: true,
    bentoClass: "md:col-span-1 md:row-span-1 md:min-h-[240px]"
  },
  {
    id: "gallery-client-2",
    title: "Tola in Emerald Linen",
    tag: "Client Diary",
    image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=1200&auto=format&fit=crop",
    desc: "Commanding the executive boardroom dynamic with absolute ease. Our tailored structures bring unmatched elegance.",
    isReel: false,
    bentoClass: "md:col-span-2 md:row-span-1 md:min-h-[300px]"
  }
];

export default function Home() {
  const { wishlist } = useAppState();
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState<any>(STATIC_PRODUCTS[0]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleNextGallery = () => {
    setActiveGalleryIndex((prev) => (prev === null ? 0 : (prev + 1) % GALLERY_ITEMS.length));
  };

  const handlePrevGallery = () => {
    setActiveGalleryIndex((prev) => (prev === null ? 0 : (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNextGallery();
    } else if (diff < -50) {
      handlePrevGallery();
    }
    setTouchStartX(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeGalleryIndex !== null) {
        if (e.key === 'ArrowRight') {
          handleNextGallery();
        } else if (e.key === 'ArrowLeft') {
          handlePrevGallery();
        } else if (e.key === 'Escape') {
          setActiveGalleryIndex(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGalleryIndex]);
 
  // Filter trending arrivals
  const trendingProduct = STATIC_PRODUCTS.filter(p => p.tags.includes('Trending')).slice(0, 4);

  const categoryGridData = [
    { name: 'Shoes', count: 2, cover: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop' },
    { name: 'Bags', count: 2, cover: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop' },
    { name: 'Two-pieces', count: 4, cover: 'https://i.ibb.co/zH71Jx0b/8DTTA.jpg' },
    { name: 'Dresses', count: 4, cover: 'https://i.ibb.co/xtsvGHF4/v-Fe-CH.jpg' },
  ];

  const handleOpenTryOn = (p: any) => {
    setTryOnProduct(p);
    setTryOnOpen(true);
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col bg-bg min-h-screen pb-24"
    >
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-line">
        <h1 className="font-display text-2xl font-semibold text-accent italic">Fabruby</h1>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-ink" />
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-ink" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">2</span>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-6 py-4">
        <div className="h-12 bg-surface rounded-full border border-line flex items-center px-4 gap-3 text-ink-ghost">
          <Search className="w-4.5 h-4.5" />
          <span className="text-sm">Search dresses, tops, bags...</span>
        </div>
      </div>

      {/* Category Row */}
      <div className="flex gap-2 overflow-x-auto px-6 pb-4 no-scrollbar">
        {categories.map((cat, i) => (
          <button 
            key={cat}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest whitespace-nowrap transition-colors
              ${i === 0 ? 'bg-accent text-white' : 'bg-surface border border-line text-ink-soft'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hero Banner */}
      <div className="px-6 mb-12">
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-card group">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" 
            className="w-full h-full object-cover" 
            alt="Summer collection"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
            <h2 className="font-display text-2xl text-white italic mb-2">Summer Bloom</h2>
            <button className="w-fit px-6 py-2 bg-white rounded-full text-xs font-bold uppercase tracking-widest">Shop Collection</button>
          </div>
        </div>
      </div>

      {/* New In Section */}
      <section className="mb-12">
        <div className="px-6 flex justify-between items-end mb-6">
          <h3 className="font-display text-xl text-ink">New Arrivals</h3>
          <span className="text-xs font-bold text-accent uppercase tracking-widest border-b border-accent/20 pb-1">See All</span>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar">
          {STATIC_PRODUCTS.slice(0, 5).map(product => (
            <div key={product.id} className="w-[200px] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Trending Masonry Grid */}
      <section className="px-6">
        <h3 className="font-display text-xl text-ink mb-6">Trending Now</h3>
        <div className="grid grid-cols-2 gap-4">
          {STATIC_PRODUCTS.slice(5, 9).map((product, i) => (
            <div key={product.id} className={i % 3 === 0 ? 'mt-0' : 'mt-4'}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Nav Placeholder */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-surface/90 backdrop-blur-lg border-t border-line px-6 py-3 flex justify-between items-center z-50">
        <HomeIcon className="text-accent" />
        <Compass className="text-ink-ghost" />
        <ShoppingBag className="text-ink-ghost" />
        <Heart className="text-ink-ghost" />
        <User className="text-ink-ghost" />
      </nav>
      <section className="relative w-full bg-white py-12 md:py-16 lg:py-20 border-b border-burgundy/10 overflow-visible">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 overflow-visible grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
          
          {/* Left column: Typography of high fashion */}
          <div className="flex flex-col justify-center text-left py-6 relative z-10" id="hero-designer-text">
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-5xl md:text-7xl tracking-normal text-nearblack font-semibold leading-[0.95] mb-6 z-10"
            >
              Dress Like You <br />
              <span className="italic font-light text-burgundy">Mean It</span>
            </motion.h1>
  
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-sans text-sm text-nearblack/75 max-w-sm leading-relaxed tracking-wide font-normal border-l-2 border-gold pl-4 mb-8 z-10"
            >
              We dress influential women in pieces that work as hard as they do. From boardroom to dinner, from Lagos to the world. Premium quality, zero compromise, every single time.
            </motion.p>
  

  
          </div>
  
          {/* Right column: Carousel of fashion images sliding tiles */}
          <div className="w-full relative z-20 overflow-visible lg:-mr-4">
            <HeroCarousel />
          </div>
        </div>
      </section>



      {/* SECTION 3: SHOP BY CURATED CATEGORY */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto w-full overflow-hidden">
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-nearblack font-light uppercase">
            What're we looking for today?
          </h2>
          <div className="w-12 h-[2px] bg-gold mt-4" />
        </div>

        {/* Horizontal scrollable categories starting from the left */}
        <div 
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth" 
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#C9A84C rgba(0,0,0,0.05)'
          }}
        >
          {categoryGridData.map((c) => (
            <div key={c.name} className="flex-none w-[270px] sm:w-[310px] snap-center">
              <CategoryTiltCard category={c} />
            </div>
          ))}
        </div>
      </section>



      {/* SECTION 4: SHOWSTOPPER INTERACTIVE HOTSPOT LOOKBOOK */}
      <ShopTheFit />

      {/* SECTION 5: TRENDING STYLE SELECTIONS */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
          <div>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-nearblack font-light uppercase">
              POPULAR
            </h2>
          </div>
          <Link 
            to="/shop" 
            className="font-sans text-xs uppercase font-black tracking-widest text-burgundy hover:text-gold transition flex items-center gap-1 border-b border-burgundy/15 pb-1 self-start"
          >
            Shop now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trendingProduct.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 6: THE RED-WINE LUXURY STYLE BANNER (RUBY INTRO) */}
      <section id="stylist-intro" className="py-20 px-6 md:px-16 max-w-7xl mx-auto w-full">
        <div className="bg-burgundy text-cream rounded-3xl overflow-hidden border border-gold/30 shadow-2xl relative grid grid-cols-1 lg:grid-cols-2">
          {/* Subtle decorative gold details */}
          <div className="absolute top-8 left-8 border border-white/10 pointer-events-none w-16 h-16 rounded-tl-lg hidden md:block" />
          
          <div className="p-10 md:p-16 flex flex-col justify-center items-start relative z-10">
            <span className="bg-gold text-burgundy text-[9px] font-sans font-black tracking-widest uppercase px-3 py-1 rounded mb-6 flex items-center gap-1.5 shadow-sm">
              INTRODUCING RUBY
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-light tracking-tight mb-6 uppercase leading-none">
              Not sure what <br />
              to wear?
            </h2>
            <p className="text-sm md:text-base text-cream/70 leading-relaxed mb-8 max-w-md">
              Ask Ruby, our AI stylist connected directly to our boutique’s collection. Whether it's a vibrant celebration event. or a business dinner, Ruby will curate your perfect, ready-to-wear look in seconds.
            </p>
            
            {/* Launch Stylist widget trigger */}
            <button 
              onClick={() => {
                const btn = document.getElementById('btn-stylist-bubble');
                if (btn) btn.click();
              }}
              className="bg-gold hover:bg-cream text-burgundy font-sans text-xs tracking-widest uppercase font-black px-8 py-3.5 rounded-xl shadow-lg flex items-center gap-2 border border-gold/15 transition duration-300"
            >
              CHAT WITH RUBY <img src="https://i.ibb.co/99TKMHkW/Gemini-Generated-Image-v4rgvmv4rgvmv4rg-removebg-preview.png" alt="Ruby Chat" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
            </button>
          </div>

          <div className="relative aspect-[4/3] lg:aspect-auto min-h-[300px]">
            <img 
              src="https://i.ibb.co/hRRDm7t4/Gemini-Generated-Image-bumeiqbumeiqbume.png" 
              alt="Stylish young Lagos woman representing Ruby Stylist Agent"
              className="absolute inset-0 w-full h-full object-cover brightness-95"
              referrerPolicy="no-referrer"
            />

          </div>
        </div>
      </section>

      {/* SECTION 7: FAB RUBY SOCIALS & CLIENT GALLERY */}
      <section className="py-24 px-6 md:px-16 bg-cream border-t border-burgundy/5 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="font-mono text-xs font-black tracking-[0.2em] text-burgundy uppercase mb-2">#FABRUBYBABE</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-nearblack tracking-wide uppercase leading-tight">
              Boutique & Client Gallery
            </h2>
            <p className="font-sans text-xs sm:text-sm text-nearblack/60 font-semibold tracking-wide mt-2 uppercase">
              Step into our world: walk-in moments, curated reels, and clients commanding rooms
            </p>
            <div className="w-12 h-[2px] bg-gold mt-4" />
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
            {GALLERY_ITEMS.map((item, index) => (
              <div 
                key={item.id}
                onClick={() => setActiveGalleryIndex(index)}
                className={`bg-white rounded-2xl overflow-hidden border border-burgundy/5 shadow-md hover:shadow-xl transition duration-300 flex flex-col group cursor-pointer ${item.bentoClass}`}
              >
                <div className="relative overflow-hidden aspect-[4/3] md:flex-1 md:min-h-[220px] md:aspect-auto">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute top-4 left-4 font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-sm ${
                    item.isReel ? 'bg-red-600 text-white' : item.tag === 'Client Diary' ? 'bg-gold text-burgundy' : 'bg-burgundy text-cream'
                  }`}>
                    {item.isReel && "📹 "}{item.tag}
                  </span>

                  {item.isReel && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition duration-300">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg text-burgundy transform scale-95 group-hover:scale-105 transition duration-300">
                        <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col justify-between bg-white">
                  <h3 className="font-serif text-base md:text-lg font-light text-nearblack mb-1 uppercase tracking-wider">{item.title}</h3>
                  <p className="font-sans text-xs text-nearblack/60 leading-relaxed font-semibold">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY DETAIL MODAL WITH TOUCH SWIPE AND ARROW NAVIGATION */}
      <AnimatePresence>
        {activeGalleryIndex !== null && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8" 
            id="gallery-modal-root"
          >
            {/* Top Navigation Bar */}
            <div className="flex justify-between items-center w-full text-white py-2 px-1 z-50">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold">
                  {GALLERY_ITEMS[activeGalleryIndex].tag}
                </span>
                <span className="font-serif text-lg tracking-wider uppercase font-light">
                  {GALLERY_ITEMS[activeGalleryIndex].title}
                </span>
              </div>
              <button 
                onClick={() => setActiveGalleryIndex(null)}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
                id="btn-close-gallery-modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Interactive Stage */}
            <div className="flex-1 flex items-center justify-center relative my-4 select-none">
              {/* Left/Right controls for Desktop */}
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrevGallery(); }}
                className="absolute left-2 md:left-6 z-50 p-3 md:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
                aria-label="Previous item"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>

              {/* Main Sliding Content Frame */}
              <div 
                className="w-full max-w-4xl h-[60vh] md:h-[70vh] flex items-center justify-center relative overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <motion.img 
                  key={activeGalleryIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  src={GALLERY_ITEMS[activeGalleryIndex].image} 
                  alt={GALLERY_ITEMS[activeGalleryIndex].title}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); handleNextGallery(); }}
                className="absolute right-2 md:right-6 z-50 p-3 md:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
                aria-label="Next item"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            {/* Bottom Caption and Counter */}
            <div className="w-full text-center max-w-xl mx-auto pb-6 z-50">
              <p className="font-sans text-xs md:text-sm text-cream/80 mb-4 font-normal px-4">
                {GALLERY_ITEMS[activeGalleryIndex].desc}
              </p>
              <div className="flex justify-center gap-1.5">
                {GALLERY_ITEMS.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveGalleryIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeGalleryIndex === index ? 'bg-gold w-6' : 'bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to item ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Try-on popup portal */}
      {tryOnOpen && (
        <VirtualTryOnModal 
          isOpen={tryOnOpen} 
          onClose={() => setTryOnOpen(false)} 
          initialProduct={tryOnProduct || undefined}
        />
      )}
    </motion.div>
  );
}
