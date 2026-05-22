import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const ImageWithFallback: React.FC<Props> = ({
  src,
  alt,
  className,
  containerClassName,
}) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={cn('bg-gray-100 flex items-center justify-center', containerClassName)}>
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <ImageOff className="w-8 h-8" />
          <span className="text-xs">No image</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
    />
  );
};