
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CartViewer } from '../../../widgets/cart/ui/cart-viewer';
import { CheckoutDrawer } from '../../../widgets/checkout/ui/checkout-drawer';
import { api } from '../../../shared/api/client';
import { ShopSchema, ProductListResponseSchema } from '@tma/shared';
import { Shop, Product } from '../../../shared/model/types';
import { useShopStore } from '../../../entities/shop/model/shop.store';
import { useCartSync } from '../../../features/cart/model/use-cart-sync';

const CartPage = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const currentShopId = useShopStore((s) => s.currentShopId);

  // Fetch products for cart items and checkout total calculation
  const { data: productData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products', currentShopId],
    queryFn: () => api.get<{ items: Product[] }>('/api/v1/products', ProductListResponseSchema, undefined, currentShopId || undefined)
  });

  // Fetch shop for checkout context
  const { data: shop, isLoading: isShopLoading } = useQuery({
    queryKey: ['shop', currentShopId],
    queryFn: () => api.get<Shop>('/api/v1/shop', ShopSchema, undefined, currentShopId || undefined)
  });

  const products = productData?.items || [];
  const isLoading = isProductsLoading || isShopLoading;

  // Sync Logic: Clean up ghost items if product list changes
  useCartSync(products, isLoading);

  return (
    <div className="min-h-screen bg-[#09090b] text-white pb-32">
      <CartViewer 
        products={products} 
        shop={shop}
        isLoading={isLoading}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutDrawer 
        open={isCheckoutOpen} 
        onOpenChange={setIsCheckoutOpen}
        products={products}
        shop={shop}
      />
    </div>
  );
};

export default CartPage;
