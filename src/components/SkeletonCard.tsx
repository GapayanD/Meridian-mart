import React from 'react';
import { motion } from 'motion/react';

export const SkeletonCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
    >
      <div className="aspect-square bg-gray-100 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-16 bg-gray-100 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

export const SkeletonCards: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);