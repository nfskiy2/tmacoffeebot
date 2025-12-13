import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { useShopStore } from '../../../entities/shop/model/shop.store';
import { useCartStore } from '../../../entities/cart/model/cart.store';
import { DELIVERY_SHOP_ID } from '../../../shared/api/mocks/data';
import { cn } from '../../../shared/utils/cn';

interface DeliveryAddressFormProps {
  onRequestChangeContext: (action: () => void) => void;
}

export const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({ onRequestChangeContext }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setShopId, setDeliveryAddress } = useShopStore();
  
  // Local state for address form
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apt, setApt] = useState('');

  // Validation: Street and House are required
  const isFormValid = street.trim().length > 0 && house.trim().length > 0;

  const handleConfirmAddress = async () => {
    if (!isFormValid) return;

    onRequestChangeContext(async () => {
        const fullAddress = apt 
          ? `${street}, ${house}, кв/оф ${apt}` 
          : `${street}, ${house}`;

        // Mode: Delivery -> Set address & Set Technical Shop ID
        setDeliveryAddress(fullAddress);
        setShopId(DELIVERY_SHOP_ID);

        await queryClient.invalidateQueries();
        navigate('/');
    });
  };

  return (
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
  );
};