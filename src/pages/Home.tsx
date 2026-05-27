import React, { useState, useEffect } from 'react';
import { useAppState } from '../lib/StateContext';
import { STATIC_PRODUCTS } from '../lib/seed';
import ProductCard from '../components/ProductCard';
import VirtualTryOnModal from '../components/VirtualTryOnModal';
import { ArrowRight, MessageSquare, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import CategoryTiltCard from '../components/CategoryTiltCard';
import HeroCarousel from '../components/HeroCarousel';
import ShopTheFit from '../components/ShopTheFit';

export default function Home() {
  const { wishlist } = useAppState();
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState<any>(STATIC_PRODUCTS[0]);
 
  // Filter trending arrivals
  const trendingProduct = STATIC_PRODUCTS.filter(p => p.tags.includes('Trending')).slice(0, 4);

  const categories = [
    { name: 'Dresses', count: 4, cover: 'https://i.ibb.co/xtsvGHF4/v-Fe-CH.jpg' },
    { name: 'Two-pieces', count: 4, cover: 'https://i.ibb.co/zH71Jx0b/8DTTA.jpg' },
    { name: 'Bags', count: 2, cover: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop' },
    { name: 'Shoes', count: 2, cover: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop' },
  ];

  const handleOpenTryOn = (p: any) => {
    setTryOnProduct(p);
    setTryOnOpen(true);
  };

  return (
    <div className="flex flex-col bg-cream" id="homepage-root">
      
      {/* SECTION 1: ELEGANT PRIVÉ HERO CLOSET */}
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

        {/* Horizontal scrollable categories wrapping right-to-left */}
        <div 
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth" 
          dir="rtl"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#C9A84C rgba(0,0,0,0.05)'
          }}
        >
          {categories.map((c) => (
            <div key={c.name} className="flex-none w-[270px] sm:w-[310px] snap-center" dir="ltr">
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
            <span className="font-mono text-xs font-black tracking-widest text-burgundy uppercase mb-2 block">HIGH IN DEMAND</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-nearblack font-light uppercase">
              Trending Silhouettes
            </h2>
          </div>
          <Link 
            to="/shop" 
            className="font-sans text-xs uppercase font-black tracking-widest text-burgundy hover:text-gold transition flex items-center gap-1 border-b border-burgundy/15 pb-1 self-start"
          >
            DISCOVER ALL ARCHIVES <ArrowRight className="w-3.5 h-3.5" />
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
              INTRODUCING RUBY STYLIST AI
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-light tracking-tight mb-6 uppercase leading-none">
              Doubt what <br />
              to wear, <span className="italic font-serif text-gold lowercase">babe?</span>
            </h2>
            <p className="text-sm md:text-base text-cream/70 leading-relaxed mb-8 max-w-md">
              Speak with Ruby, our neural stylist grounded in our boutique's real stock files. Whether it is an Owanbe assembly or a business dinner in Ikoyi, Ruby crafts complete ensembles instantly.
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
              src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop" 
              alt="Stylish young Lagos woman representing Ruby Stylist Agent"
              className="absolute inset-0 w-full h-full object-cover brightness-95"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-burgundy via-transparent p-6 flex flex-col justify-end text-white max-w-xs ml-4">
              <p className="font-serif italic text-gold text-sm">"I style you with standard Lagos attitude & sharp boutique coordinates. No guesswork."</p>
              <p className="font-sans uppercase text-[9px] tracking-widest font-black text-white/50 mt-1">― ruby, a.i stylist</p>
            </div>
          </div>
        </div>
      </section>

      {/* Try-on popup portal */}
      {tryOnOpen && (
        <VirtualTryOnModal 
          isOpen={tryOnOpen} 
          onClose={() => setTryOnOpen(false)} 
          initialProduct={tryOnProduct || undefined}
        />
      )}
    </div>
  );
}
