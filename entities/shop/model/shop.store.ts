
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ShopState {
  currentShopId: string | null;
  deliveryAddress: string | null; // If set, we are in delivery mode
  setShopId: (id: string) => void;
  setDeliveryAddress: (address: string | null) => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      // Set default shop to ensure app works out-of-the-box with strict API client
      currentShopId: 'shop_1', 
      deliveryAddress: null,
      setShopId: (id) => set({ currentShopId: id }),
      setDeliveryAddress: (address) => set({ deliveryAddress: address }),
    }),
    {
      name: 'tma-shop-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
