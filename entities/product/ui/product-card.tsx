
import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../../../shared/model/types';
import { cn } from '../../../shared/utils/cn';
import { Image } from '../../../shared/ui/image';
import { formatPrice } from '../../../shared/lib/currency';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  onAddToCart?: (e: React.MouseEvent) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
  onClick,
  onAddToCart,
  className
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(e);
  };

  return (
    <div 
      className={cn(
        "group relative bg-[#1c1c1e] rounded-[20px] overflow-hidden flex flex-col h-full transform transition-all duration-300 active:scale-[0.97]",
        className
      )}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] bg-zinc-800 overflow-hidden">
        <Image 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle gradient to make image sit nicer */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e]/40 to-transparent opacity-50 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <div className="mb-auto">
            <h3 className="text-white font-semibold text-[15px] leading-[1.2] mb-1 line-clamp-2 tracking-tight">
            {product.name}
            </h3>
        </div>
        
        <div className="flex items-end justify-between mt-3">
          <div className="flex flex-col">
             <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Цена</span>
             <span className="text-white text-[16px] font-bold tracking-tight">
                {formatPrice(product.price)}
             </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 flex items-center justify-center bg-white text-black rounded-[12px] shadow-lg shadow-white/5 active:bg-[#38bdf8] active:scale-90 transition-all duration-200"
            aria-label="Добавить в корзину"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
