
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CartViewer } from '../../../widgets/cart/ui/cart-viewer';
import { CheckoutDrawer } from '../../../widgets/checkout/ui/checkout-drawer';
import { api } from '../../../shared/api/client';
import { ShopSchema, ProductListResponseSchema } from '../../../packages/shared/schemas';
import { Shop, Product } from '../../../shared/model/types';
import { useShopStore } from '../../../entities/shop/model/shop.store';

const CartPage = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const currentShopId = useShopStore((s) => s.currentShopId);

  // Fetch products for cart items and checkout total calculation
  // Key includes currentShopId to ensure data consistency
  const { data: productData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products', currentShopId],
    queryFn: () => api.get<{ items: Product[] }>('/api/v1/products', ProductListResponseSchema)
  });

  // Fetch shop for checkout context (addresses, etc)
  const { data: shop, isLoading: isShopLoading } = useQuery({
    queryKey: ['shop', currentShopId],
    queryFn: () => api.get<Shop>('/api/v1/shop', ShopSchema)
  });

  const products = productData?.items || [];
  const isLoading = isProductsLoading || isShopLoading;

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
