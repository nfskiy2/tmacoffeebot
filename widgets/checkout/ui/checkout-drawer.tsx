
import React, { useMemo, useState } from 'react';
import { Drawer } from 'vaul';
import { MapPin, CreditCard, LayoutGrid, Check, Armchair, Utensils } from 'lucide-react';
import { useCartStore } from '../../../entities/cart/model/cart.store';
import { useShopStore } from '../../../entities/shop/model/shop.store';
import { Product, Shop } from '../../../shared/model/types';
import { cn } from '../../../shared/utils/cn';
import { calculateCartTotal } from '../../../entities/cart/lib/cart-helpers';
import { useCreateOrder } from '../../../features/checkout/model/use-create-order';

// Helper to generate time slots
const generateTimeSlots = () => {
  const now = new Date();
  const slots = [];
  let start = new Date(now);
  start.setMinutes(start.getMinutes() + 20); 
  const remainder = 30 - (start.getMinutes() % 30);
  start.setMinutes(start.getMinutes() + remainder);
  start.setSeconds(0);

  for (let i = 0; i < 3; i++) {
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);
    const format = (d: Date) => d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    slots.push(`${format(start)} - ${format(end)}`);
    start = end;
  }
  return slots;
};

interface CheckoutDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  shop: Shop | undefined;
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({ 
  open, 
  onOpenChange,
  products,
  shop 
}) => {
  const { items, diningOption } = useCartStore();
  const { deliveryAddress } = useShopStore();

  const [timeSlot, setTimeSlot] = useState<string>('asap');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const totalAmount = useMemo(() => {
    return calculateCartTotal(items, products);
  }, [items, products]);

  const deliveryCost = 0;
  const finalTotal = totalAmount + deliveryCost;

  // Use Feature Hook
  const createOrderMutation = useCreateOrder();

  const handlePay = () => {
    createOrderMutation.mutate({
      timeSlot,
      paymentMethod,
      onSuccess: () => onOpenChange(false)
    });
  };

  const addressDisplay = deliveryAddress 
    ? deliveryAddress 
    : (shop ? `${shop.address}` : 'Загрузка...');
  
  const AddressIcon = deliveryAddress ? MapPin : (diningOption === 'dine-in' ? Armchair : Utensils);

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 max-h-[96vh] flex flex-col bg-[#09090b] rounded-t-[24px] outline-none">
           {/* Handle */}
           <div className="w-full flex justify-center pt-3 pb-2 bg-[#09090b] rounded-t-[24px] flex-shrink-0">
             <div className="w-10 h-1 bg-zinc-700 rounded-full" />
           </div>

           {/* Title */}
           <div className="px-4 pb-4 border-b border-white/5 flex-shrink-0">
             <Drawer.Title className="text-xl font-bold text-white">Оформление заказа</Drawer.Title>
             <Drawer.Description className="sr-only">
               Выберите время готовности и способ оплаты
             </Drawer.Description>
           </div>

           {/* Scrollable Content */}
           <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-8 pb-32">
              
              {/* Address / Place */}
              <section>
                  <h3 className="text-[13px] font-medium text-gray-500 mb-2">Адрес / Место</h3>
                  <div className="bg-[#18181b] rounded-2xl p-4 flex items-center gap-3 border border-white/5">
                      <AddressIcon className="text-[#38bdf8]" size={20} />
                      <span className="text-[15px] font-bold text-white">{addressDisplay}</span>
                  </div>
              </section>

              {/* Ready Time */}
              <section>
                  <h3 className="text-[15px] font-bold text-white mb-3">Время готовности</h3>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                      <button
                      onClick={() => setTimeSlot('asap')}
                      className={cn(
                          "px-5 py-3 rounded-xl text-[14px] font-bold whitespace-nowrap transition-colors",
                          timeSlot === 'asap' 
                          ? "bg-[#38bdf8] text-black" 
                          : "bg-[#18181b] text-white border border-white/5"
                      )}
                      >
                      Побыстрее
                      </button>
                      {timeSlots.map(slot => (
                      <button
                          key={slot}
                          onClick={() => setTimeSlot(slot)}
                          className={cn(
                          "px-5 py-3 rounded-xl text-[14px] font-bold whitespace-nowrap transition-colors",
                          timeSlot === slot 
                              ? "bg-[#38bdf8] text-black" 
                              : "bg-[#18181b] text-white border border-white/5"
                          )}
                      >
                          {slot}
                      </button>
                      ))}
                  </div>
              </section>

              {/* Payment Method */}
              <section>
                <h3 className="text-[15px] font-bold text-white mb-3">Способ оплаты</h3>
                <div className="grid grid-cols-2 gap-3">
                   {/* Online Card */}
                   <button
                     onClick={() => setPaymentMethod('online')}
                     className={cn(
                       "relative h-28 rounded-2xl p-4 flex flex-col justify-between items-start text-left border transition-all",
                       paymentMethod === 'online'
                         ? "bg-[#38bdf8] border-[#38bdf8]"
                         : "bg-[#18181b] border-white/5 hover:border-white/10"
                     )}
                   >
                     <CreditCard 
                       size={32} 
                       className={cn(paymentMethod === 'online' ? "text-black" : "text-white")} 
                       strokeWidth={1.5}
                     />
                     <span className={cn(
                       "text-[13px] font-bold leading-tight",
                       paymentMethod === 'online' ? "text-black" : "text-gray-200"
                     )}>
                       Картой<br/>(в приложении)
                     </span>
                     
                     {paymentMethod === 'online' && (
                       <div className="absolute top-3 right-3 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                         <Check size={12} className="text-[#38bdf8]" strokeWidth={3} />
                       </div>
                     )}
                   </button>

                   {/* Offline / QR */}
                   <button
                     onClick={() => setPaymentMethod('offline')}
                     className={cn(
                       "relative h-28 rounded-2xl p-4 flex flex-col justify-between items-start text-left border transition-all",
                       paymentMethod === 'offline'
                         ? "bg-[#38bdf8] border-[#38bdf8]"
                         : "bg-[#18181b] border-white/5 hover:border-white/10"
                     )}
                   >
                     <LayoutGrid 
                       size={32} 
                       className={cn(paymentMethod === 'offline' ? "text-black" : "text-white")} 
                       strokeWidth={1.5}
                     />
                     <span className={cn(
                       "text-[13px] font-bold leading-tight",
                       paymentMethod === 'offline' ? "text-black" : "text-gray-200"
                     )}>
                       Карта/QR<br/>при получении
                     </span>
                     
                     {paymentMethod === 'offline' && (
                       <div className="absolute top-3 right-3 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                         <Check size={12} className="text-[#38bdf8]" strokeWidth={3} />
                       </div>
                     )}
                   </button>
                </div>
              </section>

              {/* Totals */}
              <section className="space-y-3 pt-4 border-t border-white/5">
                   <div className="flex justify-between items-center text-[15px] font-medium text-gray-400">
                      <span>Товары</span>
                      <span className="text-white">{(totalAmount / 100).toFixed(0)}₽</span>
                   </div>
                   <div className="flex justify-between items-center text-[15px] font-medium text-gray-400">
                      <span>Доставка/Сервис</span>
                      <span className="text-white">{deliveryCost}₽</span>
                   </div>
                   <div className="flex justify-between items-center text-[20px] font-bold text-[#38bdf8] mt-2">
                      <span>Итого</span>
                      <span>{(finalTotal / 100).toFixed(0)}₽</span>
                   </div>
              </section>
           </div>

           {/* Fixed Bottom Button */}
           <div className="p-4 bg-[#09090b] border-t border-white/5 safe-area-bottom">
              <button
                onClick={handlePay}
                disabled={createOrderMutation.isPending}
                className="w-full bg-[#38bdf8] text-black font-extrabold text-[16px] py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {createOrderMutation.isPending ? 'Обработка...' : `Оплатить ${(finalTotal / 100).toFixed(0)}₽`}
              </button>
           </div>

        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
