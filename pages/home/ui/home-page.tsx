
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '../../../shared/api/client';
import { ShopSchema, CategorySchema, ProductListResponseSchema } from '../../../packages/shared/schemas';
import { Shop, Category, Product } from '../../../shared/model/types';
import { useShopStore } from '../../../entities/shop/model/shop.store';

// Widgets
import { StickyHeader } from '../../../widgets/layout/ui/sticky-header';
import { ProductFeed } from '../../../widgets/menu/ui/product-feed';
import { CartSummaryBar } from '../../../features/cart/ui/cart-summary-bar';
import { BannerCarousel } from '../../../widgets/banners/ui/banner-carousel';
import { ProductDrawer } from '../../../widgets/product-details/ui/product-drawer';

// Schemas
const CategoryListSchema = z.array(CategorySchema);

const HomePage = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const currentShopId = useShopStore((s) => s.currentShopId);

  // --- Data Fetching (Lifted from MenuViewer) ---
  
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

  // --- Logic ---

  // Set initial active category
  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  // Scroll Handler
  const scrollToCategory = (id: string) => {
    setActiveCategoryId(id);
    const element = document.getElementById(`category-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Render ---

  if (!shop) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-gray-500">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] pb-20">
      
      {/* 1. Header Widget (Layout) */}
      <StickyHeader 
        shop={shop} 
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryClick={scrollToCategory}
      />
      
      {/* 2. Banner Widget (Feature Slot) */}
      {/* Positioned relatively to sit under the expanded header */}
      <div className="relative z-10 mb-6">
        <BannerCarousel />
      </div>

      {/* 3. Product Feed Widget (Menu) */}
      <ProductFeed 
        categories={categories}
        products={products}
        onCategoryInView={setActiveCategoryId}
      />

      {/* 4. Cart Feature (Floating) */}
      <CartSummaryBar products={products} />

      {/* 5. Details Drawer Widget (Global) */}
      <ProductDrawer />
    </div>
  );
};

export default HomePage;
