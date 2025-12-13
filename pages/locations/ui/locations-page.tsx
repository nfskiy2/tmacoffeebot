
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronDown, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../../shared/api/client';
import { DELIVERY_SHOP_ID } from '../../../shared/config/constants';
import { Shop } from '../../../shared/model/types';
import { useShopStore } from '../../../entities/shop/model/shop.store';
import { useCartStore } from '../../../entities/cart/model/cart.store';
import { ShopCard } from '../../../entities/shop/ui/shop-card';
import { DeliveryToggle } from '../../../entities/shop/ui/delivery-toggle';
import { cn } from '../../../shared/utils/cn';

const LocationsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentShopId, setShopId, setDeliveryAddress } = useShopStore();
  const { items, clearCart } = useCartStore();
  
  const [activeTab, setActiveTab] = useState<'hall' | 'delivery'>('hall');

  // Warning Modal State
  const [showWarning, setShowWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Local state for address form
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apt, setApt] = useState('');

  // Validation: Street and House are required
  const isFormValid = street.trim().length > 0 && house.trim().length > 0;

  const { data: shops = [], isLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: () => api.get<Shop[]>('/api/v1/shops'),
  });

  // Filter out the technical delivery shop from the "Hall" list
  const physicalShops = shops.filter(s => s.id !== DELIVERY_SHOP_ID);

  const executeAction = (action: () => void) => {
    if (items.length > 0) {
      setPendingAction(() => action);
      setShowWarning(true);
    } else {
      action();
    }
  };

  const confirmChange = () => {
    clearCart();
    if (pendingAction) {
      pendingAction();
    }
    setShowWarning(false);
  };

  const handleSelectShop = async (id: string) => {
    // If shop is same, just go back, no clearing needed
    if (id === currentShopId) {
       navigate('/');
       return;
    }

    executeAction(async () => {
        // Mode: Hall -> Clear delivery address
        setDeliveryAddress(null);
        setShopId(id);
        localStorage.setItem('tma_shop_id', id);
        
        await queryClient.invalidateQueries();
        navigate('/');
    });
  };

  const handleConfirmAddress = async () => {
    if (!isFormValid) return;

    executeAction(async () => {
        const fullAddress = apt 
          ? `${street}, ${house}, кв/оф ${apt}` 
          : `${street}, ${house}`;

        // Mode: Delivery -> Set address & Set Technical Shop ID
        setDeliveryAddress(fullAddress);
        setShopId(DELIVERY_SHOP_ID);
        localStorage.setItem('tma_shop_id', DELIVERY_SHOP_ID);

        await queryClient.invalidateQueries();
        navigate('/');
    });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 active:bg-zinc-800"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">
            {activeTab === 'hall' ? 'Доступные кафе' : 'Доставка'}
        </h1>
      </div>

      {/* Toggle */}
      <div className="mb-8">
        <DeliveryToggle value={activeTab} onChange={setActiveTab} />
      </div>

      {/* Content Switcher */}
      {activeTab === 'hall' ? (
        // --- HALL LIST ---
        isLoading ? (
          <div className="text-gray-500 text-center py-10">Загрузка локаций...</div>
        ) : (
          <div className="space-y-3">
            {physicalShops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                isSelected={shop.id === currentShopId}
                onClick={() => handleSelectShop(shop.id)}
              />
            ))}
          </div>
        )
      ) : (
        // --- DELIVERY FORM ---
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold mb-2">Адрес доставки</h2>
            
            {/* City Select - Visual Only for now */}
            <div className="relative">
                <select className="w-full bg-[#1c1c1e] text-white h-[56px] px-4 pr-10 rounded-2xl outline-none appearance-none font-medium">
                    <option>Томск</option>
                    <option>Москва</option>
                    <option>Новосибирск</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>

            {/* Street Input */}
            <input 
                type="text" 
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Улица" 
                className="w-full bg-[#1c1c1e] text-white h-[56px] px-4 rounded-2xl outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-[#38bdf8] transition-shadow"
            />

            {/* House & Apt Row */}
            <div className="flex gap-3">
                <input 
                    type="text"
                    inputMode="numeric" 
                    value={house}
                    onChange={(e) => setHouse(e.target.value.replace(/\D/g, ''))}
                    placeholder="Дом" 
                    className="flex-1 min-w-0 bg-[#1c1c1e] text-white h-[56px] px-4 rounded-2xl outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-[#38bdf8] transition-shadow"
                />
                 <input 
                    type="text" 
                    inputMode="numeric"
                    value={apt}
                    onChange={(e) => setApt(e.target.value.replace(/\D/g, ''))}
                    placeholder="Кв/Офис" 
                    className="flex-1 min-w-0 bg-[#1c1c1e] text-white h-[56px] px-4 rounded-2xl outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-[#38bdf8] transition-shadow"
                />
            </div>

            {/* Spacer */}
            <div className="h-4" />

            {/* Submit Button */}
            <button 
                onClick={handleConfirmAddress}
                disabled={!isFormValid}
                className={cn(
                  "w-full font-bold h-[56px] rounded-2xl transition-all duration-300",
                  isFormValid 
                    ? "bg-[#38bdf8] text-black active:scale-[0.98] shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:opacity-90" 
                    : "bg-[#27272a] text-[#52525b] cursor-not-allowed"
                )}
            >
                Подтвердить адрес
            </button>
        </div>
      )}

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setShowWarning(false)}
            />
            
            {/* Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-4 right-4 top-1/2 -translate-y-1/2 bg-[#1c1c1e] rounded-[24px] p-6 z-50 shadow-2xl border border-white/5"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                        <AlertTriangle size={32} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">Сменить локацию?</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                        Ваша текущая корзина будет полностью очищена, так как ассортимент может отличаться.
                    </p>

                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setShowWarning(false)}
                            className="flex-1 bg-[#27272a] text-white font-bold h-12 rounded-xl active:scale-95 transition-transform"
                        >
                            Отмена
                        </button>
                        <button 
                            onClick={confirmChange}
                            className="flex-1 bg-[#38bdf8] text-black font-bold h-12 rounded-xl active:scale-95 transition-transform"
                        >
                            Сбросить
                        </button>
                    </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationsPage;
