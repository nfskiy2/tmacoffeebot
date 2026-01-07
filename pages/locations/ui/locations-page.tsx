
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeliveryToggle } from '../../../entities/shop/ui/delivery-toggle';
import { ShopList } from '../../../features/shop/ui/shop-list';
import { DeliveryAddressForm } from '../../../features/delivery/ui/delivery-address-form';
import { useCartStore } from '../../../entities/cart/model/cart.store';

const LocationsPage = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const [activeTab, setActiveTab] = useState<'hall' | 'delivery'>('hall');

  // Warning Modal State Logic (Lifted here to coordinate context change)
  const [showWarning, setShowWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

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
        // Feature: Shop List with Context Switching Logic
        <ShopList onRequestChangeContext={executeAction} />
      ) : (
        // Feature: Delivery Form with Context Switching Logic
        <DeliveryAddressForm onRequestChangeContext={executeAction} />
      )}

      {/* Warning Modal (View) */}
      <AnimatePresence>
        {showWarning && (
          <>
            {/* Backdrop */}
            <motion.div 
              {...({
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 }
              } as any)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setShowWarning(false)}
            />
            
            {/* Modal */}
            <motion.div 
              {...({
                initial: { opacity: 0, scale: 0.9, y: 20 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.9, y: 20 }
              } as any)}
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
