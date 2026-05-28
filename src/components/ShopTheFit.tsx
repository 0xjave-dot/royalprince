import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppState } from '../lib/StateContext';
import { Product } from '../types';
import { ChevronLeft, ChevronRight, ShoppingBag, X, Check } from 'lucide-react';

interface Hotspot {
  x: string; // Percentage value (e.g. "45%")
  y: string; // Percentage value (e.g. "20%")
  product: Product;
}

interface Outfit {
  id: string;
  title: string;
  image: string;
  hotspots: Hotspot[];
}

const OUTFITS_DATA: Outfit[] = [
  {
    id: 'outfit-power-look',
    title: '',
    image: 'https://i.ibb.co/ZpT65h1X/Untitled-design-8.png',
    hotspots: [
      {
        x: '42%',
        y: '32%',
        product: {
          id: 'fit-cream-blazer',
          name: 'Oversized Cream Blazer',
          price: 52000,
          description: 'A masterpiece of structural tailoring. Features sharp peak lapels and premium linen blend drape.',
          sizes: ['S', 'M', 'L'],
          colors: ['Cream'],
          mainImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=450&auto=format&fit=crop',
          hoverImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=450&auto=format&fit=crop',
          category: 'Blazers',
          tags: ['Exclusives', 'The Power Look']
        }
      },
      {
        x: '52%',
        y: '65%',
        product: {
          id: 'fit-black-linen-trouser',
          name: 'Black Linen two piece Trouser',
          price: 38000,
          description: 'Crafted from premium airy Lagos linen. Perfect tailored crop waist with high-rise drape.',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Black'],
          mainImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=450&auto=format&fit=crop',
          hoverImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=450&auto=format&fit=crop',
          category: 'Co-ords',
          tags: ['The Power Look']
        }
      },
      {
        x: '62%',
        y: '92%',
        product: {
          id: 'fit-black-pointed-heels',
          name: 'Black Pointed Heels',
          price: 25000,
          description: 'Sleek, iconic leather heels designed to elevate standard Lagos evening looks.',
          sizes: ['37', '38', '39', '40', '41'],
          colors: ['Black'],
          mainImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=450&auto=format&fit=crop',
          hoverImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=450&auto=format&fit=crop',
          category: 'Shoes',
          tags: ['Accessories', 'The Power Look']
        }
      }
    ]
  },
  {
    id: 'outfit-evening-look',
    title: '',
    image: 'https://i.ibb.co/PZ7mtQqL/Untitled-design-9.png',
    hotspots: [
      {
        x: '48%',
        y: '15%',
        product: {
          id: 'dress-scarlet',
          name: 'Scarlet Wrap Dress',
          price: 28000,
          description: 'An elegant, figures-flattering wrap dress cut from lightweight premium linen. Perfect for romantic dinners in Victoria Island.',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Red'],
          mainImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=450&auto=format&fit=crop',
          hoverImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=450&auto=format&fit=crop',
          category: 'Dresses',
          tags: ['Trending', 'Best Seller', 'The Evening Look']
        }
      },
      {
        x: '25%',
        y: '60%',
        product: {
          id: 'fit-gold-clutch',
          name: 'Gold Clutch Bag',
          price: 18000,
          description: 'Glossy metallic evening clutch designed as Lagos’ finest luxury statement carrier.',
          sizes: ['One Size'],
          colors: ['Gold'],
          mainImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=450&auto=format&fit=crop',
          hoverImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=450&auto=format&fit=crop',
          category: 'Bags',
          tags: ['Accessories', 'The Evening Look']
        }
      },
      {
        x: '70%',
        y: '80%',
        product: {
          id: 'fit-strappy-gold-heels',
          name: 'Strappy Gold Heels',
          price: 22000,
          description: 'Radiant wrap-around gold straps and high stiletto profile to highlight runway strides.',
          sizes: ['38', '39', '40', '41'],
          colors: ['Gold'],
          mainImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=450&auto=format&fit=crop',
          hoverImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=450&auto=format&fit=crop',
          category: 'Shoes',
          tags: ['The Evening Look']
        }
      }
    ]
  },
  {
    id: 'outfit-weekend-chic',
    title: '',
    image: 'https://i.ibb.co/S7PwrxhQ/Untitled-design-10.png ',
    hotspots: [
      {
        x: '40%',
        y: '25%',
        product: {
          id: 'fit-sage-linen-shirt',
          name: 'Sage Green Linen Shirt',
          price: 32000,
          description: 'Effortless cool silhouette. Pure premium breathable Sage linen weave for humid weekends.',
          sizes: ['S', 'M', 'L'],
          colors: ['Sage Green'],
          mainImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=450&auto=format&fit=crop',
          hoverImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=450&auto=format&fit=crop',
          category: 'Tops',
          tags: ['The Weekend Chic']
        }
      },
      {
        x: '55%',
        y: '65%',
        product: {
          id: 'fit-wide-leg-beige-trousers',
          name: 'Wide Leg Beige Trousers',
          price: 35000,
          description: 'High-waisted, beautifully relaxed flow pants suitable for a casual brunch dynamic.',
          sizes: ['XS', 'S', 'M', 'L'],
          colors: ['Beige'],
          mainImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=450&auto=format&fit=crop',
          hoverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=450&auto=format&fit=crop',
          category: 'Co-ords',
          tags: ['The Weekend Chic']
        }
      },
      {
        x: '35%',
        y: '78%',
        product: {
          id: 'fit-brown-leather-loafers',
          name: 'Brown Leather Loafers',
          price: 45000,
          description: 'Handcrafted luxury leather slip-on loafers matching all Lagos luxury leisure setups.',
          sizes: ['40', '41', '42', '43', '44'],
          colors: ['Brown'],
          mainImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=450&auto=format&fit=crop',
          hoverImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=450&auto=format&fit=crop',
          category: 'Shoes',
          tags: ['The Weekend Chic']
        }
      },
      {
        x: '65%',
        y: '35%',
        product: {
          id: 'fit-gold-hoop-earrings',
          name: 'Gold Hoop Earrings',
          price: 12000,
          description: 'Elegant heavyweight gold hoops with high polish structure to pair with sleek ponytails.',
          sizes: ['One Size'],
          colors: ['Gold'],
          mainImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=450&auto=format&fit=crop',
          hoverImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=450&auto=format&fit=crop',
          category: 'Bags',
          tags: ['Accessories', 'The Weekend Chic']
        }
      }
    ]
  }
];

export default function ShopTheFit() {
  const { addToCart } = useAppState();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  
  // Size selection map recorded as: { [productId]: size }
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  // Check mobile width dynamically
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update default sizes when look changes
  useEffect(() => {
    setActiveHotspot(null);
    const defaults: { [key: string]: string } = {};
    OUTFITS_DATA[currentSlide].hotspots.forEach((h) => {
      defaults[h.product.id] = h.product.sizes[0] || 'S';
    });
    setSelectedSizes((prev) => ({ ...prev, ...defaults }));
  }, [currentSlide]);

  // Handle outside click to close popovers on desktop
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (activeHotspot !== null && containerRef.current) {
        const target = e.target as HTMLElement;
        if (!target.closest('.hotspot-spot') && !target.closest('.hotspot-card')) {
          setActiveHotspot(null);
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [activeHotspot]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const dragEndX = e.changedTouches[0].clientX;
    const diff = dragStartX - dragEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // swipe left -> next outfit
        handleNext();
      } else {
        // swipe right -> prev outfit
        handlePrev();
      }
    }
    setDragStartX(null);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === OUTFITS_DATA.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? OUTFITS_DATA.length - 1 : prev - 1));
  };

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes[0] || 'S';
    addToCart(product, size, 1);
  };

  const handleAddAllToCart = () => {
    const currentOutfit = OUTFITS_DATA[currentSlide];
    currentOutfit.hotspots.forEach((h) => {
      const size = selectedSizes[h.product.id] || h.product.sizes[0] || 'S';
      addToCart(h.product, size, 1);
    });
  };

  const outfit = OUTFITS_DATA[currentSlide];

  return (
    <section id="shop-the-fit" className="py-24 px-4 sm:px-6 md:px-16 bg-[#FAF6F0] border-t border-b border-burgundy/5 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Module Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <span className="font-mono text-xs font-black tracking-[0.2em] text-burgundy uppercase mb-2"></span>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-nearblack tracking-wide uppercase leading-tight">
            Shop the Fit
          </h2>
          <p className="font-sans text-xs sm:text-sm text-nearblack/60 font-semibold tracking-wide mt-2 uppercase">
            
          </p>
          <div className="w-12 h-[2px] bg-gold mt-4" />
        </div>

        {/* Carousel Container */}
        <div 
          ref={containerRef}
          className="relative w-full max-w-xl mx-auto flex flex-col items-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Image Viewport with absolute hotspots */}
          <div className="relative w-full aspect-[4/5] md:aspect-[3/4] bg-nearblack/5 rounded-3xl overflow-hidden border border-burgundy/10 shadow-2xl group select-none">
            
            {/* Slide Showpiece Image */}
            <AnimatePresence mode="wait">
              <motion.img 
                key={outfit.id}
                src={outfit.image} 
                alt={outfit.title} 
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Vignette Shadow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

            {/* Title Overlay in the premium left corner */}
            <div className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur-md py-2 px-5 rounded-full border border-burgundy/5 shadow-md">
              <span className="font-serif text-sm sm:text-base tracking-widest uppercase font-bold text-burgundy">{outfit.title}</span>
            </div>

            {/* Previous Look Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-burgundy hover:text-white transition shadow-lg flex items-center justify-center border border-burgundy/10 cursor-pointer z-35"
              aria-label="Previous Look"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next Look Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-burgundy hover:text-white transition shadow-lg flex items-center justify-center border border-burgundy/10 cursor-pointer z-35"
              aria-label="Next Look"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Interactive Pulse Hotspots */}
            {outfit.hotspots.map((hs, i) => {
              const isActive = activeHotspot === i;
              return (
                <div 
                  key={hs.product.id}
                  className="absolute z-30 hotspot-spot"
                  style={{ top: hs.y, left: hs.x }}
                  onMouseEnter={() => {
                    if (!isMobile) setActiveHotspot(i);
                  }}
                >
                  <button
                    onClick={() => setActiveHotspot(isActive ? null : i)}
                    className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white cursor-pointer active:scale-95 transition focus:outline-none"
                    aria-label={`Hotspot for ${hs.product.name}`}
                  >
                    {/* Sonar Ping Ring when NOT active */}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-full bg-[#6B1F2A] animate-sonar-ping pointer-events-none" />
                    )}
                    
                    {/* Inner gold / burgundy dot */}
                    <span className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-burgundy scale-125' : 'bg-[#C9A84C]'
                    }`} />
                  </button>

                  {/* Desktop Popover: anchored to the hotspot */}
                  {!isMobile && (
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.85, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.85, y: 10 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-4 border border-burgundy/15 w-[240px] hotspot-card z-50 text-nearblack"
                        >
                          {/* Close button */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveHotspot(null);
                            }}
                            className="absolute top-2.5 right-2.5 text-nearblack/40 hover:text-burgundy"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* Mini Details */}
                          <img 
                            src={hs.product.mainImage} 
                            alt={hs.product.name} 
                            className="w-full h-28 object-cover rounded-xl mb-3 border border-burgundy/5"
                            referrerPolicy="no-referrer"
                          />
                          <h4 className="font-serif text-sm font-bold uppercase tracking-wider mb-1 leading-tight">{hs.product.name}</h4>
                          <span className="font-mono text-xs font-black text-burgundy block mb-3">
                            ₦{hs.product.price.toLocaleString()}
                          </span>

                          {/* Size Selection */}
                          <div className="flex items-center justify-between gap-1 mb-3">
                            <span className="font-mono text-[9px] tracking-widest text-nearblack/50 uppercase font-black">Size:</span>
                            <select 
                              value={selectedSizes[hs.product.id] || hs.product.sizes[0]}
                              onChange={(e) => handleSizeChange(hs.product.id, e.target.value)}
                              className="bg-[#FAF6F0] border border-burgundy/10 text-xs py-1 px-2.5 rounded-lg outline-none font-bold"
                            >
                              {hs.product.sizes.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>

                          {/* Add Single to Cart */}
                          <button
                            onClick={() => handleAddToCart(hs.product)}
                            className="w-full bg-burgundy hover:bg-gold text-white hover:text-burgundy text-[10px] tracking-widest uppercase font-black py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> ADD TO CART
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex gap-2.5 mt-5">
            {OUTFITS_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 pointer-events-auto ${
                  currentSlide === idx ? 'w-8 bg-burgundy' : 'w-2.5 bg-burgundy/25 hover:bg-burgundy/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Outfit Progress Count overlay */}
          <span className="font-mono text-[10px] text-nearblack/40 uppercase tracking-widest mt-2">
            Look {currentSlide + 1} of {OUTFITS_DATA.length}
          </span>

          {/* Add Complete Look Button below the image viewport */}
          <div className="w-full mt-6 px-1">
            <button
              onClick={handleAddAllToCart}
              id={`btn-add-all-${outfit.id}`}
              className="w-full bg-burgundy hover:bg-gold border border-gold/20 text-white hover:text-burgundy py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm font-sans uppercase tracking-[0.15em] font-black cursor-pointer"
            >
              <ShoppingBag className="w-4.5 h-4.5 animate-bounce" /> Add Complete Look to Cart
            </button>
          </div>
        </div>

        {/* Mobile Bottom Sheet Drawer Portal (rendered inline over the screen on activeHotspot SM screen) */}
        <AnimatePresence>
          {isMobile && activeHotspot !== null && (
            <>
              {/* Backing Shade */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveHotspot(null)}
                className="fixed inset-0 bg-black z-[100] pb-safe"
              />

              {/* Bottom Sheet pop */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="fixed bottom-0 inset-x-0 bg-white rounded-t-[2.5rem] border-t border-burgundy/15 px-6 pt-5 pb-9 z-[101] text-nearblack shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
              >
                {/* Drag handle line */}
                <div className="w-12 h-1 bg-nearblack/10 rounded-full mx-auto mb-2" />

                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-burgundy">Shop the look item</h3>
                  <button 
                    onClick={() => setActiveHotspot(null)}
                    className="w-8 h-8 rounded-full bg-nearblack/5 flex items-center justify-center text-nearblack/60 hover:bg-nearblack/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="flex gap-4 items-start">
                  <img 
                    src={outfit.hotspots[activeHotspot].product.mainImage} 
                    alt={outfit.hotspots[activeHotspot].product.name} 
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border border-burgundy/5 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col flex-1">
                    <h4 className="font-serif text-base font-bold uppercase text-nearblack leading-tight">
                      {outfit.hotspots[activeHotspot].product.name}
                    </h4>
                    <span className="font-mono text-sm font-black text-burgundy mt-1">
                      ₦{outfit.hotspots[activeHotspot].product.price.toLocaleString()}
                    </span>
                    <p className="text-xs text-nearblack/60 mt-2 line-clamp-2 leading-relaxed">
                      {outfit.hotspots[activeHotspot].product.description}
                    </p>
                  </div>
                </div>

                {/* Interactive size & shop row */}
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex items-center justify-between bg-surface/50 border border-burgundy/5 rounded-2xl p-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] tracking-widest text-nearblack/60 uppercase font-black">CHOOSE SIZE</span>
                      <span className="text-[10px] text-nearblack/40 italic font-serif">Tailored fits match standard fits</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {outfit.hotspots[activeHotspot].product.sizes.map((sz) => {
                        const isChosen = (selectedSizes[outfit.hotspots[activeHotspot!].product.id] || outfit.hotspots[activeHotspot!].product.sizes[0]) === sz;
                        return (
                          <button
                            key={sz}
                            onClick={() => handleSizeChange(outfit.hotspots[activeHotspot!].product.id, sz)}
                            className={`w-10 h-10 rounded-full font-mono text-[10px] font-bold border transition flex items-center justify-center ${
                              isChosen 
                                ? 'bg-burgundy text-gold border-gold' 
                                : 'bg-white text-nearblack/60 border-nearblack/10'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCart(outfit.hotspots[activeHotspot!].product);
                      setActiveHotspot(null);
                    }}
                    className="w-full bg-burgundy hover:bg-gold text-white hover:text-burgundy py-4 rounded-2xl flex items-center justify-center gap-2 font-sans text-xs tracking-widest uppercase font-black transition-all shadow-md active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4" /> ADD TO MY CART
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
