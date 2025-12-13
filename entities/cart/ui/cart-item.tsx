
import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType, Product } from '../../../shared/model/types';
import { calculateItemTotal } from '../lib/cart-helpers';
import { Image } from '../../../shared/ui/image';
import { formatPrice } from '../../../shared/lib/currency';

interface CartItemProps {
  item: CartItemType;
  product: Product;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  product,
  onIncrease,
  onDecrease,
  onRemove
}) => {
  // 1. Resolve selected addons objects from product.addons using IDs
  const selectedAddons = product.addons?.filter(a => item.selectedAddons?.includes(a.id)) || [];
  
  // 2. Use helper for total
  const totalPrice = calculateItemTotal(item, product);

  return (
    <div className="flex gap-4 w-full bg-[#18181b] p-3 rounded-2xl relative group">
      {/* Remove Button (Top Right) */}
      {onRemove && (
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-400 active:text-red-400 p-1 -mr-1 -mt-1 z-10"
        >
          <X size={18} />
        </button>
      )}

      {/* Image */}
      <div className="w-[100px] h-[100px] rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 relative">
        <Image 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 py-1">
        {/* Header */}
        <h3 className="text-white font-bold text-[16px] leading-tight mb-1 pr-6">
            {product.name}
        </h3>
        
        {/* Addons List */}
        <div className="flex flex-col mb-auto">
             {selectedAddons.map(addon => (
               <div key={addon.id} className="text-[13px] text-gray-400 font-medium leading-5">
                 + {addon.name}
               </div>
             ))}
        </div>

        {/* Footer: Counter + Price */}
        <div className="flex items-center justify-between mt-3">
           {/* Custom Counter matching screenshot */}
           <div className="flex items-center gap-4">
              <button 
                onClick={(e) => { e.stopPropagation(); onDecrease(); }}
                className="text-white p-1 active:opacity-60"
                aria-label="Decrease quantity"
              >
                 <Minus size={16} strokeWidth={3} />
              </button>
              
              <div className="bg-[#38bdf8] text-black font-extrabold text-[15px] w-8 h-8 rounded-full flex items-center justify-center">
                 {item.quantity}
              </div>

              <button 
                 onClick={(e) => { e.stopPropagation(); onIncrease(); }}
                 className="text-white p-1 active:opacity-60"
                 aria-label="Increase quantity"
              >
                 <Plus size={16} strokeWidth={3} />
              </button>
           </div>
           
           {/* Total Price */}
           <span className="text-white font-black text-[18px]">
              {formatPrice(totalPrice)}
           </span>
        </div>
      </div>
    </div>
  );
};
