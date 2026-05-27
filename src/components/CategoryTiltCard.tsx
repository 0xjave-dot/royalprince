import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface CategoryTiltCardProps {
  category: {
    name: string;
    count: number;
    cover: string;
    slogan?: string;
  };
}

export default function CategoryTiltCard({ category }: CategoryTiltCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  const [shineStyle, setShineStyle] = useState<React.CSSProperties>({
    opacity: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid running on touch devices
    if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType === 'touch') {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // Normalizing between -1 and 1
    const normX = (x / width) * 2 - 1;
    const normY = (y / height) * 2 - 1;

    // Standard high-fashion tilt toward cursor coordinates:
    // When cursor is at top, rotateX is positive, when right, rotateY is positive.
    const maxTilt = 15;
    const rotateX = -normY * maxTilt;
    const rotateY = normX * maxTilt;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03) translateZ(10px)`);
    setShineStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 75%)`,
    });
  };

  const handleMouseLeave = () => {
    // Smooth reset transitions
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)');
    setShineStyle(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative aspect-[4/5] w-full select-none cursor-pointer group"
      style={{
        transformStyle: 'preserve-3d',
        transform,
        transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), shadow 0.15s ease',
      }}
      id={`tilt-card-wrapper-${category.name.toLowerCase()}`}
    >
      <Link
        to={`/shop?category=${category.name}`}
        id={`category-card-${category.name.toLowerCase()}`}
        className="relative block w-full h-full overflow-hidden rounded-xl border border-burgundy/10 bg-surface shadow-md hover:shadow-2xl transition-all duration-300"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <img
          src={category.cover}
          alt={`${category.name} collection`}
          className="w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-105 brightness-95 group-hover:brightness-90"
          referrerPolicy="no-referrer"
        />

        {/* Glare/Shine filter element */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 pointer-events-none z-10"
          style={shineStyle}
        />

        {/* Outer subtle gold accent border outline */}
        <div
          className="absolute inset-3 border border-gold/15 rounded-lg pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ transform: 'translateZ(15px)' }}
        />

        {/* Description Label tags */}
        <div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-nearblack/90 via-nearblack/40 to-transparent p-6 text-white flex flex-col justify-end"
          style={{ transform: 'translateZ(25px)' }}
        >
          <h3 className="font-serif text-2xl font-bold tracking-wide uppercase">{category.name}</h3>
          <span className="text-[9px] tracking-[0.25em] text-white/70 font-black mt-2 uppercase">
            VIEW COLLECTION ({category.count} STYLE FILES)
          </span>
        </div>
      </Link>
    </div>
  );
}
