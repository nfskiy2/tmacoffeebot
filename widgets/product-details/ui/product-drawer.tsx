
import React, { useState, useEffect, useMemo } from 'react';
import { Drawer } from 'vaul';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { api } from '../../../shared/api/client';
import { Product } from '../../../shared/model/types';
import { useCartStore } from '../../../entities/cart/model/cart.store';
import { useShopStore } from '../../../entities/shop/model/shop.store';
import { QuantitySelector } from '../../../shared/ui/quantity-selector';
import { AddonRow } from '../../../entities/product/ui/addon-row';
import { cn } from '../../../shared/utils/cn';
import { calculatePrice } from '../../../entities/cart/lib/cart-helpers';
import { Image } from '../../../shared/ui/image';

interface AddonGroupProps {
  title: string;
  addons: NonNullable<Product['addons']>;
  selectedAddons: Set<string>;
  onToggle: (id: string) => void;
}

const AddonGroup = ({ title, addons, selectedAddons, onToggle }: AddonGroupProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-[#1c1c1e] rounded-xl overflow-hidden mb-3 border border-white/5">
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="w-full flex items-center justify-between p-4 bg-[#1c1c1e] active:bg-[#27272a] transition-colors"
       >
         <span className="font-bold text-white text-[15px]">{title}</span>
         <ChevronDown 
             size={20} 
             className={cn("text-gray-400 transition-transform duration-300", isOpen ? "rotate-180" : "")} 
         />
       </button>
       <AnimatePresence initial={false}>
         {isOpen && (
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="px-4 pb-2 border-t border-white/5">
                    {addons.map(addon => (
                        <AddonRow 
                            key={addon.id}
                            name={addon.name}
                            price={addon.price}
                            isSelected={selectedAddons.has(addon.id)}
                            onToggle={() => onToggle(addon.id)}
                        />
                    ))}
                </div>
            </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

export const ProductDrawer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const productId = searchParams.get('product');
  const isOpen = !!productId;

  const { addItem } = useCartStore();
  const currentShopId = useShopStore(s => s.currentShopId);

  // Local State for the drawer interaction
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  // Reset state when opening a new product
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedAddons(new Set());
    }
  }, [isOpen, productId]);

  // Fetch product data
  const { data: productsData } = useQuery({ 
    queryKey: ['products', currentShopId], 
    queryFn: () => api.get<{ items: Product[] }>('/api/v1/products'),
    enabled: isOpen
  });
  
  const product = useMemo(() => 
    productsData?.items.find(p => p.id === productId), 
  [productsData, productId]);

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('product');
    setSearchParams(newParams, { replace: true });
  };

  const toggleAddon = (id: string) => {
    const newSet = new Set(selectedAddons);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedAddons(newSet);
  };

  const groupedAddons = useMemo(() => {
    if (!product?.addons) return {};
    const groups: Record<string, typeof product.addons> = {};
    
    product.addons.forEach(addon => {
        const g = addon.group || 'Дополнительно';
        if (!groups[g]) groups[g] = [];
        groups[g].push(addon);
    });
    
    return groups;
  }, [product]);

  const calculateTotal = () => {
    if (!product) return 0;
    return calculatePrice(product, Array.from(selectedAddons), quantity);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, Array.from(selectedAddons));
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 max-h-[96vh] flex flex-col bg-[#09090b] rounded-t-[24px] outline-none">
          {/* Accessible Title (Visually Hidden) */}
          <Drawer.Title className="sr-only">
            {product ? product.name : 'Детали продукта'}
          </Drawer.Title>

          {/* Handle */}
          <div className="w-full flex justify-center pt-3 pb-2 bg-[#09090b] rounded-t-[24px]">
             <div className="w-10 h-1 bg-zinc-700 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
            {!product ? (
               <div className="h-64 flex items-center justify-center text-gray-500">Загрузка...</div>
            ) : (
              <>
                {/* Product Cover */}
                <div className="w-full aspect-[16/10] bg-zinc-800 relative">
                   <Image 
                     src={product.imageUrl} 
                     alt={product.name}
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent opacity-80 pointer-events-none" />
                </div>

                {/* Info Container */}
                <div className="px-4 -mt-6 relative z-10">
                   <h1 className="text-2xl font-bold text-white leading-tight mb-2">
                     {product.name}
                   </h1>
                   <p className="text-gray-400 text-sm leading-relaxed mb-6">
                     {product.description}
                   </p>

                   {/* Addons Section */}
                   {product.addons && product.addons.length > 0 && (
                     <div className="mb-6">
                       {Object.entries(groupedAddons).map(([group, addons]) => (
                            <AddonGroup 
                                key={group} 
                                title={group} 
                                addons={addons!} 
                                selectedAddons={selectedAddons}
                                onToggle={toggleAddon}
                            />
                        ))}
                     </div>
                   )}
                   
                   {/* Spacer for scroll */}
                   <div className="h-4" />
                </div>
              </>
            )}
          </div>

          {/* Action Bar (Fixed Bottom) */}
          {product && (
            <div className="p-4 border-t border-white/5 bg-[#09090b] safe-area-bottom">
              <div className="flex items-center justify-between mb-4">
                 <span className="text-xl font-bold text-white">Итог</span>
                 <span className="text-xl font-bold text-white">
                   {(calculateTotal() / 100).toFixed(0)}₽
                 </span>
              </div>
              
              <div className="flex gap-3">
                <QuantitySelector 
                  value={quantity}
                  onIncrease={() => setQuantity(q => q + 1)}
                  onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
                  className="bg-[#1c1c1e] text-white border border-white/10"
                />
                
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#38bdf8] text-black font-bold text-[16px] rounded-xl py-3 active:scale-[0.98] transition-transform"
                >
                  Оформить заказ
                </button>
              </div>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
