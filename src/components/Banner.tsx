import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const slides = [
  {
    id: 1,
    badge: 'Mid-Year Sale',
    heading: 'Tech Deals You Cannot Miss',
    body: 'Up to 45% off on premium electronics. Free shipping on orders over ₱2,000.',
    cta: 'Shop Electronics',
    to: '/category?type=electronics',
    img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800',
    accent: 'bg-amber-600',
    dot: 'bg-stone-900',
  },
  {
    id: 2,
    badge: 'New Arrivals',
    heading: 'Timeless Pieces for Modern Living',
    body: 'Discover the new season collection curated for style, comfort, and everyday life.',
    cta: 'Explore Fashion',
    to: '/category?type=fashion',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    accent: 'bg-stone-800',
    dot: 'bg-stone-900',
  },
];

export const Banner: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-stone-100 min-h-[280px] md:min-h-[300px] border border-stone-200">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 min-h-[280px] md:min-h-[300px]"
        >
          {/* Text */}
          <div className="flex flex-col justify-center px-8 md:px-12 py-10">
            <motion.span
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className={cn(
                'inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit mb-5 text-white',
                slide.accent
              )}
            >
              {slide.badge}
            </motion.span>

            <motion.h2
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight text-stone-900 mb-4"
            >
              {slide.heading}
            </motion.h2>

            <motion.p
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-sm text-stone-500 leading-relaxed mb-8 max-w-xs"
            >
              {slide.body}
            </motion.p>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to={slide.to}
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl text-white hover:opacity-90 transition-opacity w-fit',
                  slide.accent
                )}
              >
                {slide.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Image */}
          <div className="hidden md:block relative overflow-hidden">
            <img
              src={slide.img}
              alt={slide.heading}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-stone-100 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide dots */}
      <div className="absolute bottom-5 left-8 md:left-12 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              current === i ? 'w-8 bg-stone-800' : 'w-2 bg-stone-300 hover:bg-stone-400'
            )}
          />
        ))}
      </div>
    </div>
  );
};