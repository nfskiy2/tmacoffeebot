import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../utils/cn';

interface QuantitySelectorProps {
  value: number;
  onIncrease: (e: React.MouseEvent) => void;
  onDecrease: (e: React.MouseEvent) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onIncrease,
  onDecrease,
  className,
  size = 'md'
}) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between bg-[#38bdf8] text-black rounded-full select-none",
        size === 'sm' ? "h-8 px-2 min-w-[80px]" : "h-10 px-3 min-w-[100px]",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <button 
        onClick={onDecrease}
        className="active:opacity-60 transition-opacity p-1"
        type="button"
      >
        <Minus size={size === 'sm' ? 14 : 18} strokeWidth={3} />
      </button>
      
      <span className={cn(
        "font-bold text-center w-6",
        size === 'sm' ? "text-sm" : "text-base"
      )}>
        {value}
      </span>
      
      <button 
        onClick={onIncrease}
        className="active:opacity-60 transition-opacity p-1"
        type="button"
      >
        <Plus size={size === 'sm' ? 14 : 18} strokeWidth={3} />
      </button>
    </div>
  );
};