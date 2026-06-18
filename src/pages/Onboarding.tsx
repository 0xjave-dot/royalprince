import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    title: "Dress the woman you're becoming.",
    sub: "New arrivals every week."
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    title: "Fit. Style. Confidence.",
    sub: "Sizes XS – 3XL, always."
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    title: "Your wardrobe, curated.",
    sub: "Shop by mood, occasion, or trend."
  }
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (current < SLIDES.length - 1) setCurrent(current + 1);
    else navigate('/auth/signin');
  };

  const skip = () => navigate('/auth/signin');

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0"
        >
          <img 
            src={SLIDES[current].image} 
            className="h-full w-full object-cover" 
            alt="Fashion"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />

      {/* Frosted Panel */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-0 left-0 right-0 p-8 pb-12 rounded-t-[32px] bg-white/85 backdrop-blur-xl border-t border-white/20"
      >
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="font-display text-4xl leading-tight font-semibold text-ink italic">
            {SLIDES[current].title}
          </h1>
          <p className="text-ink-soft text-base">
            {SLIDES[current].sub}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  width: current === i ? 24 : 8,
                  backgroundColor: current === i ? 'var(--color-accent)' : 'var(--color-ink-ghost)'
                }}
                className="h-2 rounded-full"
              />
            ))}
          </div>

          <div className="flex items-center gap-6">
            {current < 2 && (
              <button 
                onClick={skip}
                className="text-sm font-semibold text-ink-soft uppercase tracking-wider"
              >
                Skip
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={next}
              className={`
                h-14 px-8 rounded-full font-semibold uppercase tracking-widest text-sm transition-colors
                ${current === 2 
                  ? 'bg-accent text-white w-full' 
                  : 'bg-ink text-white'
                }
              `}
            >
              {current === 2 ? 'Get Started' : 'Next'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}