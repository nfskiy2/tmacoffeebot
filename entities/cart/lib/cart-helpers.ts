
import { CartItem, Product } from '../../../shared/model/types';

/**
 * Calculates the total price for a product configuration (Base + Addons) * Quantity
 */
export const calculatePrice = (
  product: Product, 
  selectedAddonIds: string[] = [], 
  quantity: number = 1
): number => {
  if (!product) return 0;

  let unitPrice = product.price;

  if (selectedAddonIds.length > 0) {
    selectedAddonIds.forEach(addonId => {
      const addon = product.addons?.find(a => a.id === addonId);
      if (addon) {
        unitPrice += addon.price;
      }
    });
  }

  return unitPrice * quantity;
};

/**
 * Calculates total for a specific cart item
 */
export const calculateItemTotal = (item: CartItem, product: Product): number => {
  return calculatePrice(product, item.selectedAddons, item.quantity);
};

/**
 * Calculates total for the entire cart
 */
export const calculateCartTotal = (items: CartItem[], products: Product[]): number => {
  return items.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return acc;
    return acc + calculateItemTotal(item, product);
  }, 0);
};
