import React, { useState } from 'react';
import { Product } from '../types';
import { useAppState } from '../lib/StateContext';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

export default function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist, addToCart } = useAppState();
  const [hovered, setHovered] = useState(false);
  const [quickSizeOpen, setQuickSizeOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const isWishlisted = wishlist.includes(product.id);

  const handleQuickAdd = (size: string) => {
    addToCart(product, size);
    setQuickSizeOpen(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Express relative pointer position as coords between -1 and 1
    const x = (e.clientX - rect.left - width / 2) / (width / 2);
    const y = (e.clientY - rect.top - height / 2) / (height / 2);
    
    // Max 12 degrees tilt
    setTilt({ x: -y * 12, y: x * 12 });

    // Express glare coordinates as percentage (0% to 100%)
    const glX = ((e.clientX - rect.left) / width) * 100;
    const glY = ((e.clientY - rect.top) / height) * 100;
    setGlare({ x: glX, y: glY });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setQuickSizeOpen(false);
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50 });
  };

  return (
    <motion.div 
      className="relative flex flex-col group h-full"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      {/* Product Image Stage - Interactive 3D Canvas */}
      <div 
        className="relative aspect-[3/4] overflow-hidden bg-surface rounded-xl border border-burgundy/10 cursor-pointer shadow-md transition-shadow duration-300 group-hover:shadow-2xl"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${hovered ? 1.02 : 1}, ${hovered ? 1.02 : 1}, 1)`,
          transition: hovered ? "transform 0.05s ease-out, shadow 0.15s ease-out" : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        id={`product-card-${product.id}`}
      >
        {/* Dynamic Golden Glare Light Overlay */}
        <div 
          className="absolute inset-0 z-1 pointer-events-none mix-blend-color-dodge transition-opacity duration-300 opacity-0 group-hover:opacity-45"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(243,215,165,0.4) 0%, rgba(243,215,165,0.1) 40%, transparent 80%)`
          }}
        />
        <Link to={`/shop?id=${product.id}`}>
          {/* Main image */}
          <img 
            src={product.mainImage} 
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              hovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
            }`}
            referrerPolicy="no-referrer"
          />
          {/* Hover image */}
          <img 
            src={product.hoverImage} 
            alt={`${product.name} hover`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              hovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Wishlist toggle */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-cream/90 backdrop-blur-sm shadow flex items-center justify-center transition cursor-pointer ${
            isWishlisted ? 'text-burgundy hover:scale-110' : 'text-nearblack/60 hover:text-burgundy'
          }`}
          aria-label="Add to wishlist"
          id={`btn-wishlist-${product.id}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Labels / Tags on upper left */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.tags.slice(0, 2).map((tag) => (
            <span 
              key={tag}
              className="bg-burgundy text-gold text-[8px] font-sans font-black tracking-widest uppercase px-2.5 py-1 rounded shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Quick Add Overlay on Hover on Desktop */}
        <AnimatePresence>
          {hovered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 right-4 z-20"
            >
              {!quickSizeOpen ? (
                <button 
                  onClick={() => setQuickSizeOpen(true)}
                  className="w-full bg-nearblack/90 hover:bg-burgundy text-white font-sans text-xs font-bold tracking-widest uppercase py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 border border-white/10 transition cursor-pointer"
                  id={`btn-quick-add-${product.id}`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  QUICK ADD
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-cream/95 backdrop-blur-md p-3 rounded-lg border border-burgundy/15 shadow-2xl flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center border-b border-burgundy/5 pb-1.5">
                    <span className="font-sans text-[10px] tracking-widest uppercase font-black text-burgundy">SELECT SIZE:</span>
                    <button onClick={() => setQuickSizeOpen(false)} className="text-burgundy/60 hover:text-burgundy font-sans text-[10px] font-bold">X</button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {product.sizes.map((sz) => (
                      <button 
                        key={sz}
                        onClick={() => handleQuickAdd(sz)}
                        className="bg-white hover:bg-burgundy hover:text-white border border-burgundy/10 text-nearblack font-mono font-bold text-xs py-1.5 rounded transition cursor-pointer"
                        id={`btn-size-${product.id}-${sz.replace('/', '-')}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Information */}
      <div className="mt-4 flex flex-col">
        <div className="flex items-start justify-between">
          <Link to={`/shop?id=${product.id}`} className="hover:text-burgundy transition">
            <h3 className="font-serif text-base font-semibold leading-tight text-nearblack group-hover:text-burgundy transition-colors duration-300">
              {product.name}
            </h3>
          </Link>
          <span className="font-mono text-sm font-bold text-burgundy pl-2 whitespace-nowrap">
            ₦{product.price.toLocaleString()}
          </span>
        </div>
        
        {/* Category & Tags strip */}
        <div className="flex items-center justify-between mt-1 border-t border-burgundy/5 pt-1.5">
          <span className="font-sans text-[10px] tracking-wider uppercase text-nearblack/50 font-bold">
            {product.category}
          </span>
          <span className="font-mono text-[9px] tracking-wider text-gold font-bold">
            {product.sizes.join(' · ')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
