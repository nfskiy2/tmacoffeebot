
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '../../../shared/model/types';

export type CartStateItem = CartItem & {
  cartId: string;
};

export type DiningOption = 'dine-in' | 'takeout';

interface CartState {
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
      items: [],
      diningOption: 'dine-in', // Default value

      setDiningOption: (option) => set({ diningOption: option }),
      
      addItem: (product, quantity = 1, selectedAddons = []) => {
        const { items } = get();
        
        // Check for existing item with same ProductID AND exactly same Addons
        const existingItemIndex = items.findIndex((i) => {
            const sameId = i.productId === product.id;
            const existingAddons = (i.selectedAddons || []).slice().sort().join(',');
            const newAddons = (selectedAddons || []).slice().sort().join(',');
            return sameId && existingAddons === newAddons;
        });

        if (existingItemIndex !== -1) {
          const newItems = [...items];
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
            items: [...items, newItem],
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
      version: 2, // Bump version for new field
    }
  )
);
