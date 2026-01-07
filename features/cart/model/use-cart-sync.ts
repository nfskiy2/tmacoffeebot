
import { useEffect, useMemo } from 'react';
import { useCartStore } from '../../../entities/cart/model/cart.store';
import { Product } from '../../../shared/model/types';

export const useCartSync = (products: Product[], isLoading: boolean) => {
  const { items, syncCart } = useCartStore();

  // Create a memoized map of valid product IDs for performance
  const validProductIds = useMemo(() => {
    return new Set(products.map(p => p.id));
  }, [products]);

  useEffect(() => {
    if (!isLoading && products.length > 0 && items.length > 0) {
      // Find items in cart that actually exist in the current product list
      const validCartIds = items
        .filter(item => validProductIds.has(item.productId))
        .map(item => item.cartId);
      
      // If the count differs, it means we have ghost items
      if (validCartIds.length !== items.length) {
        console.log('[CartSync] Cleaning up ghost items...');
        syncCart(validCartIds);
      }
    }
  }, [isLoading, products.length, items.length, syncCart, validProductIds]);
};
