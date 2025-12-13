import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '../../../shared/model/types';
import { useShopStore } from '../../shop/model/shop.store';

export type CartStateItem = CartItem & {
  cartId: string;
};

export type DiningOption = 'dine-in' | 'takeout';

interface CartState {
  shopId: string | null; // Tracks which shop these items belong to
  items: CartStateItem[];
  diningOption: DiningOption;
  setDiningOption: (option: DiningOption) => void;
  addItem: (product: Product, quantity?: number, selectedAddons?: string[]) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      shopId: null,
      items: [],
      diningOption: 'dine-in', // Default value

      setDiningOption: (option) => set({ diningOption: option }),
      
      addItem: (product, quantity = 1, selectedAddons = []) => {
        const { items, shopId: cartShopId } = get();
        
        // Access current shop from ShopStore to ensure isolation
        const currentShopId = useShopStore.getState().currentShopId;

        // Security/Logic Check: 
        // If cart has items from Shop A, but user adds item from Shop B -> Clear Cart
        if (cartShopId && currentShopId && cartShopId !== currentShopId) {
            set({ items: [], shopId: currentShopId });
            // Note: We continue to add the new item below to the empty cart
        } else if (!cartShopId && currentShopId) {
            // Initialize shop ID if empty
            set({ shopId: currentShopId });
        }

        // Re-read items in case they were cleared above
        const currentItems = get().items;

        // Check for existing item with same ProductID AND exactly same Addons
        const existingItemIndex = currentItems.findIndex((i) => {
            const sameId = i.productId === product.id;
            const existingAddons = (i.selectedAddons || []).slice().sort().join(',');
            const newAddons = (selectedAddons || []).slice().sort().join(',');
            return sameId && existingAddons === newAddons;
        });

        if (existingItemIndex !== -1) {
          const newItems = [...currentItems];
          newItems[existingItemIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          // Create new line item with unique ID
          const newItem: CartStateItem = {
             cartId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
             productId: product.id,
             quantity,
             selectedAddons: selectedAddons || []
          };
          set({
            items: [...currentItems, newItem],
          });
        }
      },

      removeItem: (cartId) => {
        set({
          items: get().items.filter((i) => i.cartId !== cartId),
        });
      },

      updateQuantity: (cartId, delta) => {
        const { items } = get();
        const newItems = items.map((item) => {
          if (item.cartId === cartId) {
            const newQuantity = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        }).filter(item => item.quantity > 0);

        set({ items: newItems });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: 'tma-cart-storage',
      storage: createJSONStorage(() => localStorage),
      version: 3, // Bump version
      // Safety check on hydration: if shop context changed while app was closed
      onRehydrateStorage: () => (state) => {
         const currentShop = useShopStore.getState().currentShopId;
         if (state && state.shopId && currentShop && state.shopId !== currentShop) {
             // Invalidate stale cart data from a different shop
             state.items = [];
             state.shopId = currentShop;
         }
      }
    }
  )
);