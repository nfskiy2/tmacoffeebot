
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '../../../shared/model/types';

export type CartStateItem = CartItem & {
  cartId: string;
};

export type DiningOption = 'dine-in' | 'takeout';

interface CartState {
  shopId: string | null; // Tracks which shop these items belong to
  items: CartStateItem[];
  diningOption: DiningOption;
  setDiningOption: (option: DiningOption) => void;
  // shopId must be passed explicitly to avoid FSD violation (Cross-entity import)
  addItem: (product: Product, shopId: string, quantity?: number, selectedAddons?: string[]) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  // Action to check if the persisted cart belongs to the current shop context
  validateSession: (currentShopId: string) => void;
  // Syncs cart items against a valid list of IDs (prevents ghost items)
  syncCart: (validCartIds: string[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      shopId: null,
      items: [],
      diningOption: 'dine-in', // Default value

      setDiningOption: (option) => set({ diningOption: option }),
      
      validateSession: (currentShopId: string) => {
          const { shopId } = get();
          // If state has a shopId, but it differs from the active one -> Clear
          if (shopId && shopId !== currentShopId) {
              set({ items: [], shopId: currentShopId });
          }
      },

      syncCart: (validCartIds: string[]) => {
          const { items } = get();
          // Keep only items that are in the validCartIds list
          // This assumes the caller has already validated which items are legitimate
          const filteredItems = items.filter(item => validCartIds.includes(item.cartId));
          
          if (filteredItems.length !== items.length) {
              set({ items: filteredItems });
          }
      },

      addItem: (product, shopId, quantity = 1, selectedAddons = []) => {
        const { items, shopId: cartShopId } = get();
        
        // Security/Logic Check: 
        // If cart has items from Shop A, but user adds item from Shop B -> Clear Cart
        if (cartShopId && shopId && cartShopId !== shopId) {
            set({ items: [], shopId: shopId });
            // Note: We continue to add the new item below to the empty cart
        } else if (!cartShopId && shopId) {
            // Initialize shop ID if empty
            set({ shopId });
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
      // STORAGE NOTE:
      // Currently using localStorage for prototype/web access.
      // For production TMA, recommend migrating to Telegram CloudStorage or a custom sync adapter 
      // to allow cross-device persistence (Desktop <-> Mobile).
      storage: createJSONStorage(() => localStorage),
      version: 4, 
    }
  )
);
