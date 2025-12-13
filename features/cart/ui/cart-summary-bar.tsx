
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../../entities/cart/model/cart.store';
import { Product } from '../../../shared/model/types';
import { calculateCartTotal } from '../../../entities/cart/lib/cart-helpers';
import { formatPrice } from '../../../shared/lib/currency';

interface CartSummaryBarProps {
  products: Product[];
}

export const CartSummaryBar: React.FC<CartSummaryBarProps> = ({ products }) => {
  const navigate = useNavigate();
  const { items } = useCartStore();

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = calculateCartTotal(items, products);

  // Don't render anything if empty
  if (totalQuantity === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 120, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 120, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto"
      >
        <button
          onClick={() => navigate('/cart')}
          className="group w-full relative overflow-hidden bg-[#38bdf8] text-black p-1.5 pl-2 pr-2 rounded-[22px] flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.5)] active:scale-[0.97] transition-transform"
        >
           {/* Glass Shine Effect */}
           <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          <div className="flex items-center gap-3 bg-black/10 rounded-[18px] pl-1 pr-4 py-1.5 h-12">
            <div className="bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-sm">
               <ShoppingBag size={16} className="text-black fill-black" />
            </div>
            <div className="flex flex-col items-start justify-center h-full">
               <span className="font-bold text-[15px] leading-none">
                 {formatPrice(totalPrice)}
               </span>
               <span className="text-[10px] text-black/60 font-bold uppercase tracking-wide leading-tight mt-0.5">
                 {totalQuantity} шт.
               </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pr-3">
            <span className="font-bold text-[14px]">В корзину</span>
            <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
