import React from 'react';
import { motion } from 'motion/react';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

export default function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Actual Page Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.25 }}
      >
        {children}
      </motion.div>

      {/* Full-Screen Burgundy Curtain Overlay (Double action) */}
      <motion.div
        className="fixed inset-0 bg-burgundy z-[9999] pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        exit={{ x: '100%' }}
        transition={{
          duration: 0.6,
          ease: [0.76, 0, 0.24, 1], // High-fidelity editorial cubic bezier
        }}
      />
    </div>
  );
}
export { PageTransitionWrapper };
