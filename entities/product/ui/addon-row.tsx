
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';
import { formatPrice } from '../../../shared/lib/currency';

interface AddonRowProps {
  name: string;
  price: number;
  isSelected: boolean;
  onToggle: () => void;
}

export const AddonRow: React.FC<AddonRowProps> = ({
  name,
  price,
  isSelected,
  onToggle
}) => {
  return (
    <div 
      onClick={onToggle}
      className="flex items-center justify-between py-3 cursor-pointer group active:opacity-80 transition-opacity select-none"
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-6 h-6 rounded-[6px] flex items-center justify-center transition-all duration-200 border",
          isSelected 
            ? "bg-[#38bdf8] border-[#38bdf8] text-black" 
            : "bg-transparent border-white/20 group-hover:border-white/40"
        )}>
          {isSelected && <Check size={16} strokeWidth={3} />}
        </div>
        <span className="text-[15px] font-medium text-white">{name}</span>
      </div>
      
      <span className="text-[15px] font-semibold text-white">
        + {formatPrice(price)}
      </span>
    </div>
  );
};
