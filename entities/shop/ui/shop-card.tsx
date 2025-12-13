
import React from 'react';
import { Shop } from '../../../shared/model/types';
import { cn } from '../../../shared/utils/cn';
import { Check } from 'lucide-react';
import { Image } from '../../../shared/ui/image';

interface ShopCardProps {
  shop: Shop;
  isSelected?: boolean;
  onClick: () => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, isSelected, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full text-left bg-[#1c1c1e] p-4 rounded-2xl flex items-center gap-4 transition-transform active:scale-[0.98]",
        isSelected ? "ring-2 ring-[#38bdf8]" : "border border-transparent"
      )}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-zinc-800 relative">
        <Image 
          src={shop.logoUrl} 
          alt={shop.name} 
          className="w-full h-full object-cover"
          fallbackIcon="default"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-[16px] leading-tight truncate">
          {shop.name}
        </h3>
        <p className="text-gray-400 text-[14px] font-medium truncate mt-0.5">
          {shop.description}
        </p>
      </div>

      {isSelected && (
        <div className="w-6 h-6 bg-[#38bdf8] rounded-full flex items-center justify-center text-black">
          <Check size={14} strokeWidth={3} />
        </div>
      )}
    </button>
  );
};