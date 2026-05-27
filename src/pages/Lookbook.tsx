import React, { useState } from 'react';
import { useAppState } from '../lib/StateContext';
import { STATIC_PRODUCTS } from '../lib/seed';
import { ShoppingBag, Eye, Heart, ArrowRight, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import VirtualTryOnModal from '../components/VirtualTryOnModal';

interface LookbookItem {
  id: string;
  name: string;
  slogan: string;
  image: string;
  description: string;
  hotspots: {
    top: string;
    left: string;
    productId: string;
    label: string;
    price: number;
  }[];
}

const LOOKBOOK_SETS: LookbookItem[] = [
  {
    id: "look-01",
    name: "Lagos Boardroom Majesty",
    slogan: "Look 01 / Vol. 4",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&auto=format&fit=crop",
    description: "The complete visual embodiment of tailored strength. Deep red tones command boardroom arrays, styled to transition seamlessly into Lekki cocktail assemblies.",
    hotspots: [
      {
        top: "40%",
        left: "55%",
        productId: "coord-burgundy",
        label: "Burgundy Power Dress Set",
        price: 48000
      },
      {
        top: "78%",
        left: "48%",
        productId: "accessory-maroon", // matches leather tote bag
        label: "Maroon Designer Clutch",
        price: 38000
      }
    ]
  },
  {
    id: "look-02",
    name: "Victoria Island Sunset Soirée",
    slogan: "Look 02 / Vol. 4",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop",
    description: "Effortless drapey wrap shapes that catch direct light beautifully of Atlantic coasts. Perfect luxury statement dressing for high-fashion dinners.",
    hotspots: [
      {
        top: "35%",
        left: "45%",
        productId: "dress-scarlet",
        label: "Scarlet Wrap Dress",
        price: 28000
      }
    ]
  },
  {
    id: "look-03",
    name: "Lekki High-Tea Assemblies",
    slogan: "Look 03 / Vol. 4",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&auto=format&fit=crop",
    description: "Camel power tailoring paired beautifully under structured core structures. Radiate classic elegance during your weekend VIP assemblies.",
    hotspots: [
      {
        top: "38%",
        left: "42%",
        productId: "coord-camel",
        label: "Camel Blazer Suit Set",
        price: 45000
      }
    ]
  }
];

export default function Lookbook() {
  const { addToCart, wishlist, toggleWishlist } = useAppState();
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<any>(null);
  
  // AI Try-on integrations
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState<any>(null);

  const activeLook = LOOKBOOK_SETS[activeLookIndex];

  const handleOpenTryOn = (productId: string) => {
    const product = STATIC_PRODUCTS.find(p => p.id === productId);
    if (product) {
      setTryOnProduct(product);
      setTryOnOpen(true);
    }
  };

  const handleAddToCart = (productId: string) => {
    const product = STATIC_PRODUCTS.find(p => p.id === productId);
    if (product) {
      addToCart(product, "M", 1);
      // Set hotspot detail reset
      setSelectedHotspot(null);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4 md:px-12" id="lookbook-page-viewport">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Title */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="font-mono text-xs font-black tracking-[0.25em] text-burgundy uppercase mb-2 flex items-center gap-1.5 animate-pulse">
            FAB RUBY SHOWROOM ARCHIVE
          </span>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-nearblack uppercase font-light">
            THE LAGOS LOOKBOOK
          </h1>
          <p className="font-sans text-xs text-nearblack/60 tracking-widest max-w-lg mt-3 uppercase">
            Interact with our Vol. 4 Lookbook directly. Click/Tap look hotspots to inspect, style, or trial on virtually.
          </p>
          <div className="w-16 h-[2.5px] bg-gold mt-4" />
        </div>

        {/* Carousel and Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LOOKBOARD DETAILS COLUMN (LEFT) */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full lg:sticky lg:top-28">
            <div className="flex flex-col gap-6">
              <span className="font-mono text-xs tracking-[0.2em] font-extrabold text-gold uppercase bg-nearblack py-1 px-3 self-start rounded-md">
                {activeLook.slogan}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-nearblack uppercase font-normal tracking-wide leading-tight">
                {activeLook.name}
              </h2>
              <p className="text-sm text-nearblack/75 leading-relaxed bg-white/40 p-6 rounded-2xl border border-burgundy/5 shadow-inner">
                {activeLook.description}
              </p>

              {/* Guide instruction */}
              <div className="flex items-start gap-2 text-xs text-nearblack/50 uppercase font-mono tracking-wider mt-2 border-t border-dashed border-burgundy/10 pt-4">
                <span>Hover over image nodes to unlock tailoring files & AI tools!</span>
              </div>
            </div>

            {/* Look Selector buttons */}
            <div className="flex items-center gap-4 mt-12 bg-white/90 p-4 rounded-xl border border-burgundy/5 shadow-md">
              <button
                onClick={() => {
                  setSelectedHotspot(null);
                  setActiveLookIndex(prev => (prev === 0 ? LOOKBOOK_SETS.length - 1 : prev - 1));
                }}
                className="w-10 h-10 rounded-lg bg-cream hover:bg-neutral-100 flex items-center justify-center border border-burgundy/10 transition cursor-pointer"
                id="btn-lookbook-prev"
              >
                <ChevronLeft className="w-5 h-5 text-burgundy" />
              </button>
              
              <div className="flex-1 text-center font-mono text-[10px] uppercase font-bold tracking-widest text-nearblack">
                {activeLookIndex + 1} OF {LOOKBOOK_SETS.length} ARCHIVES
              </div>

              <button
                onClick={() => {
                  setSelectedHotspot(null);
                  setActiveLookIndex(prev => (prev === LOOKBOOK_SETS.length - 1 ? 0 : prev + 1));
                }}
                className="w-10 h-10 rounded-lg bg-cream hover:bg-neutral-100 flex items-center justify-center border border-burgundy/10 transition cursor-pointer"
                id="btn-lookbook-next"
              >
                <ChevronRight className="w-5 h-5 text-burgundy" />
              </button>
            </div>
          </div>

          {/* INTERACTIVE HOTSPOT IMAGE INTERFACE (RIGHT) */}
          <div className="lg:col-span-8 flex flex-col items-center">
            
            <div className="relative w-full aspect-[3/4] max-w-[500px] rounded-2xl overflow-hidden border-4 border-white shadow-2xl group">
              
              {/* Image element */}
              <img 
                src={activeLook.image} 
                alt={activeLook.name}
                className="w-full h-full object-cover select-none transition-filter duration-700 brightness-[0.93] group-hover:brightness-90"
                referrerPolicy="no-referrer"
              />

              {/* Dark subtle shade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Hotspot triggers overlay */}
              {activeLook.hotspots.map((spot, index) => {
                const product = STATIC_PRODUCTS.find(p => p.id === spot.productId);
                return (
                  <div 
                    key={index}
                    className="absolute z-20 group/spot cursor-pointer"
                    style={{ top: spot.top, left: spot.left }}
                    onClick={() => setSelectedHotspot({ ...spot, product })}
                  >
                    <div className="relative flex items-center justify-center">
                      
                      {/* Interstellar Outer Ring pulsing */}
                      <div className="absolute w-8 h-8 rounded-full bg-gold/50 animate-ping" />
                      
                      {/* Micro Center Node */}
                      <button 
                        className="w-6 h-6 rounded-full bg-burgundy border-2 border-gold text-white text-[10px] font-mono font-black flex items-center justify-center group-hover/spot:bg-gold group-hover/spot:text-burgundy transition shadow-xl"
                        id={`btn-hotspot-${spot.productId}`}
                      >
                        +
                      </button>

                      {/* Small text hover prompt */}
                      <span className="absolute left-8 bg-nearblack/90 text-white text-[8px] tracking-wider py-1 px-2.5 rounded shadow shadow-xl border border-white/10 hidden group-hover/spot:inline whitespace-nowrap uppercase font-sans font-bold">
                        {spot.label}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* SELECTED HOTSPOT CABINET DISPLAY OVERLAY */}
              <AnimatePresence>
                {selectedHotspot && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    className="absolute bottom-6 inset-x-6 z-30 bg-cream/95 backdrop-blur-md p-5 rounded-xl border border-gold/30 shadow-2xl flex flex-col md:flex-row gap-4 justify-between items-center"
                    id="hotspot-detail-cabinet"
                  >
                    {/* Visual Thumb representation */}
                    <div className="flex items-center gap-3 w-full">
                      {selectedHotspot.product ? (
                        <img 
                          src={selectedHotspot.product.mainImage} 
                          alt={selectedHotspot.product.name}
                          className="w-12 h-16 object-cover rounded shadow border border-burgundy/10"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-burgundy/20 rounded border border-dashed flex items-center justify-center font-serif text-lg text-burgundy font-bold">R</div>
                      )}
                      
                      <div className="flex flex-col text-left">
                        <span className="font-serif text-xs italic text-burgundy font-bold uppercase tracking-tight">Active Silhouette //</span>
                        <h4 className="font-serif text-base text-nearblack font-bold leading-tight">{selectedHotspot.product?.name || selectedHotspot.label}</h4>
                        <span className="font-mono text-xs text-gold font-bold mt-0.5">₦{(selectedHotspot.product?.price || selectedHotspot.price).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Quick Trigger control options inside hotspot box */}
                    <div className="flex items-center gap-2 w-full md:w-auto shrink-0 mt-3 md:mt-0 justify-end">
                      {selectedHotspot.product && (
                        <button
                          onClick={() => handleOpenTryOn(selectedHotspot.productId)}
                          className="flex-1 md:flex-initial bg-nearblack hover:bg-neutral-800 text-white font-sans text-[10px] font-black tracking-widest uppercase px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition whitespace-nowrap border border-gold/20"
                          id="btn-hotspot-tryon"
                        >
                          Try On 3D
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleAddToCart(selectedHotspot.productId)}
                        className="flex-1 md:flex-initial bg-burgundy hover:bg-gold text-white hover:text-burgundy font-sans text-[10px] font-black tracking-widest uppercase px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition whitespace-nowrap border border-burgundy/10"
                        id="btn-hotspot-add"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> ADD TO BAG
                      </button>

                      <button 
                        onClick={() => setSelectedHotspot(null)}
                        className="w-8 h-8 rounded-lg bg-cream border border-nearblack/10 hover:bg-neutral-100 flex items-center justify-center text-nearblack cursor-pointer transition"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Hint message when no hotspot active */}
            {!selectedHotspot && (
              <p className="mt-4 font-mono text-[9px] text-nearblack/45 tracking-wider uppercase bg-white/50 border border-burgundy/5 rounded py-1 px-4 text-center animate-pulse">
                Tap any pulsating (+) node to open options cabinet directly
              </p>
            )}

          </div>

        </div>

      </div>

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
