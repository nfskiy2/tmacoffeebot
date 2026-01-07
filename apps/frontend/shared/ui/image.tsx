
import React, { useState, ImgHTMLAttributes } from 'react';
import { ImageOff, Coffee } from 'lucide-react';
import { cn } from '../utils/cn';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackIcon?: 'coffee' | 'default';
}

export const Image: React.FC<ImageProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackIcon = 'coffee',
  ...props 
}) => {
  const [isError, setIsError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const Icon = fallbackIcon === 'coffee' ? Coffee : ImageOff;

  if (isError || !src) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-zinc-800 text-zinc-600 w-full h-full", 
        className
      )}>
        <Icon className="w-1/3 h-1/3 opacity-50" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <>
      {!isLoaded && (
        <div className={cn("absolute inset-0 bg-zinc-800 animate-pulse", className)} />
      )}
      <img 
        src={src} 
        alt={alt} 
        className={cn(
          "transition-opacity duration-500", 
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        {...props} 
      />
    </>
  );
};
