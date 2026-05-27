import React, { useRef, useState, useEffect } from 'react';

interface TiltDressImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function TiltDressImage({ src, alt = '', className = '' }: TiltDressImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tiltX, setTiltX] = useState(0); // rotateX
  const [tiltY, setTiltY] = useState(0); // rotateY
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  // feature-detect whether the device actually supports hover (better than naive touch checks)
  const supportsHover = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover)').matches;

  const MAX_TILT = 20; // degrees
  const SHADOW_MAX = 12; // px

  useEffect(() => {
    if (!containerRef.current) return;
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!supportsHover) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1

    // map to -1 .. 1
    const relX = px * 2 - 1;
    const relY = py * 2 - 1;

    // Desired mapping: top-left (relX=-1, relY=-1) -> rotateX=+MAX, rotateY=-MAX
    const rotX = -relY * MAX_TILT;
    const rotY = relX * MAX_TILT;

    setTiltX(rotX);
    setTiltY(rotY);

    // glare position in percentage
    setGlarePos({ x: px * 100, y: py * 100 });
  };

  const handleMouseEnter = () => {
    if (!supportsHover) return;
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (!supportsHover) return;
    // spring back to zero
    setTiltX(0);
    setTiltY(0);
    setGlarePos({ x: 50, y: 50 });
    setIsHovering(false);
  };

  const shadowOffsetX = (-tiltY / MAX_TILT) * SHADOW_MAX;
  const shadowOffsetY = (tiltX / MAX_TILT) * SHADOW_MAX;

  const transformStyle = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0px)`;

  return (
    <div
      ref={containerRef}
      className={`tilt-dress-root ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        WebkitPerspective: 1000,
        position: 'relative',
        display: 'block',
      }}
    >
      <style>{`
        .tilt-dress-root { display: block; width: 100%; height: 100%; background: transparent; }
        .tilt-dress-inner { will-change: transform; transform-style: preserve-3d; overflow: hidden; background: transparent; }
        .tilt-dress-img { display: block; width: 100%; height: 100%; object-fit: cover; background: transparent; }
        .tilt-dress-glare { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: overlay; }
        .tilt-dress-float { animation: floatIdle 3s ease-in-out infinite; }
        @keyframes floatIdle { 0% { transform: translateY(0px); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0px); } }
      `}</style>

      <div
        className={`tilt-dress-inner ${ (!supportsHover || !isHovering) ? 'tilt-dress-float' : ''}`}
        style={{
          transform: transformStyle,
          transition: isHovering ? 'transform 0.18s cubic-bezier(0.2,0.8,0.2,1)' : 'transform 0.6s cubic-bezier(0.22,0.9,0.28,1)',
          boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px 30px rgba(10,10,10,0.18)`,
          position: 'relative',
          willChange: 'transform',
        }}
      >
        <img src={src} alt={alt} className="tilt-dress-img" />

        {/* Glare overlay */}
        <div
          className="tilt-dress-glare"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.09) 8%, rgba(255,255,255,0) 30%)`,
            transition: isHovering ? 'background 0.08s linear' : 'background 0.6s cubic-bezier(0.22,0.9,0.28,1)',
          }}
        />
      </div>
    </div>
  );
}
