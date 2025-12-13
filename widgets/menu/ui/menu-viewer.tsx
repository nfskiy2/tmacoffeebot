
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '../../../shared/api/client';
import { ShopSchema, CategorySchema, ProductListResponseSchema } from '../../../packages/shared/schemas';
import { Shop, Category, Product } from '../../../shared/model/types';
import { StickyHeader } from '../../layout/ui/sticky-header';
import { ProductFeed } from './product-feed';
import { CartSummaryBar } from '../../../features/cart/ui/cart-summary-bar';
import { useShopStore } from '../../../entities/shop/model/shop.store';

const CategoryListSchema = z.array(CategorySchema);

interface MenuViewerProps {
  heroSlot?: React.ReactNode;
}

export const MenuViewer: React.FC<MenuViewerProps> = ({ heroSlot }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const currentShopId = useShopStore((s) => s.currentShopId);

  // 1. Fetch Data
  const { data: shop } = useQuery({ 
    queryKey: ['shop', currentShopId], 
    queryFn: () => api.get<Shop>('/api/v1/shop', ShopSchema) 
  });

  const { data: categories = [] } = useQuery({ 
    queryKey: ['categories', currentShopId], 
    queryFn: () => api.get<Category[]>('/api/v1/categories', CategoryListSchema) 
  });

  const { data: productsData } = useQuery({ 
    queryKey: ['products', currentShopId], 
    queryFn: () => api.get<{ items: Product[], total: number }>('/api/v1/products', ProductListResponseSchema) 
  });

  const products = productsData?.items || [];

  // 2. Set initial active category
  React.useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  // 3. Scroll Handler
  const scrollToCategory = (id: string) => {
    setActiveCategoryId(id);
    const element = document.getElementById(`category-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!shop) return <div className="h-40 flex items-center justify-center text-white">Loading Menu...</div>;

  return (
    <>
      <StickyHeader 
        shop={shop} 
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryClick={scrollToCategory}
      />
      
      {/* 
        StickyHeader contains an internal spacer of 360px (EXPANDED_HEIGHT).
        Content passed to heroSlot will appear immediately after that spacer,
        effectively sitting below the expanded header and scrolling up correctly.
      */}
      {heroSlot && (
        <div className="relative z-10 mb-6">
          {heroSlot}
        </div>
      )}
      
      <ProductFeed 
        categories={categories}
        products={products}
        onCategoryInView={setActiveCategoryId}
      />

      <CartSummaryBar products={products} />
    </>
  );
};
