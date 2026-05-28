import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const CAROUSEL_IMAGES = [
  {
    id: 1,
    url: 'https://i.ibb.co/MDcLH3CN/609210639-1395288642055663-1235466433040535889-n.jpg',
    alt: 'Elegant Custom Tailoring',
    caption: 'Asymmetric Luxury Cuts'
  },
  {
    id: 2,
    url: 'https://i.ibb.co/ccRWL6Cs/615650219-1430169821962935-7108570969782913506-n.jpg',
    alt: 'The Lagos Power Blazer',
    caption: 'Tailored Bespoke Accents'
  },
  {
    id: 3,
    url: 'https://i.ibb.co/2196zgWV/616152630-1437775271289167-1826065590647681447-n.jpg',
    alt: 'Fluid Silks & Satins',
    caption: 'Sunset Cocktail Silhouettes'
  },
  {
    id: 4,
    url: 'https://i.ibb.co/4ZKbtn3y/616839334-1088159600053850-447108933093430639-n.jpg',
    alt: 'Exquisite African Modernism',
    caption: 'Rich Gold & Crimson Hues'
  },
  {
    id: 5,
    url: 'https://i.ibb.co/HL28WbJg/619539365-1436351858046262-7881281338952125665-n.jpg',
    alt: 'Sculpted Contemporary Forms',
    caption: 'Precision Structural Drape'
  },
  {
    id: 6,
    url: 'https://i.ibb.co/dJ2rTXZh/620518855-1390873655813132-7524487988059222208-n.jpg',
    alt: 'Lagos Couture Renaissance',
    caption: 'Regal Premium Statement'
  }
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const length = CAROUSEL_IMAGES.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + length) % length);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  // Autoplay function
  useEffect(() => {
    if (isHovered) return;
    timeoutRef.current = setInterval(nextSlide, 4500);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [activeIndex, isHovered]);

  // Helper to get relative offset index
  const getDiff = (idx: number) => {
    const diff = (idx - activeIndex + length) % length;
    if (diff === 0) return 0;
    if (diff === 1) return 1;
    if (diff === length - 1) return -1;
    return null; // Don't show if far away
  };

  return (
    <div 
      className="relative w-full flex flex-col justify-center items-center py-6 select-none bg-transparent overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Core Area */}
      <div 
        className="relative w-full h-[380px] sm:h-[420px] md:h-[480px] flex items-center justify-center overflow-hidden sm:overflow-visible"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {CAROUSEL_IMAGES.map((img, idx) => {
          const diff = getDiff(idx);

          // We only render the active center tile (-1, 0, 1) or hide others
          if (diff === null) return null;

          // Compute responsive scale, opacity and offsets
          const cardScale = diff === 0 ? 1 : (isMobile ? 0.76 : 0.82);
          const cardOpacity = diff === 0 ? 1 : (isMobile ? 0.32 : 0.45);
          const cardX = diff === 0 ? '0%' : (diff === 1 ? (isMobile ? '78%' : '44%') : (isMobile ? '-78%' : '-44%'));

          return (
            <motion.div
              key={img.id}
              className={`absolute h-[92%] rounded-xl overflow-hidden cursor-pointer ${
                isMobile 
                  ? "w-[80%]" 
                  : "w-[50%] md:w-[45%] lg:w-[48%] xl:w-[45%]"
              }`}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{
                scale: cardScale,
                opacity: cardOpacity,
                zIndex: diff === 0 ? 10 : 1,
                x: cardX,
                filter: diff === 0 ? 'brightness(100%)' : 'brightness(70%) blur(1px)',
                boxShadow: diff === 0 
                  ? '0 25px 50px -12px rgba(107,31,42,0.3), 0 8px 16px -8px rgba(0,0,0,0.15)'
                  : '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 28
              }}
              onClick={() => {
                if (diff !== 0) {
                  setActiveIndex(idx);
                }
              }}
            >
              {/* Luxury Frame Border */}
              <div className={`absolute inset-0 border-2 pointer-events-none z-20 rounded-xl transition-colors duration-300 ${diff === 0 ? 'border-gold/60' : 'border-transparent'}`} />
              
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover select-none object-[center_15%]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Pagination Dot Markers */}
      <div className="flex items-center gap-2 mt-2">
        {CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`transition-all duration-300 h-1.5 rounded-full ${
              activeIndex === i 
                ? 'w-6 bg-burgundy' 
                : 'w-1.5 bg-nearblack/20 hover:bg-nearblack/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
