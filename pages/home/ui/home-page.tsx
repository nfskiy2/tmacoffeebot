import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StickyHeader } from '../../../widgets/layout/ui/sticky-header';
import { ProductFeed } from '../../../widgets/menu/ui/product-feed';
import { CartSummaryBar } from '../../../features/cart/ui/cart-summary-bar';
import { ProductDrawer } from '../../../widgets/product-details/ui/product-drawer';
import { BannerCarousel } from '../../../widgets/banners/ui/banner-carousel';
import { api } from '../../../shared/api/client';
import { Shop, Category, Product, Banner } from '../../../shared/model/types';

const HomePage = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');

  // 1. Fetch Data
  const { data: shop } = useQuery({ 
    queryKey: ['shop'], 
    queryFn: () => api.get<Shop>('/api/v1/shop') 
  });

  const { data: categories = [] } = useQuery({ 
    queryKey: ['categories'], 
    queryFn: () => api.get<Category[]>('/api/v1/categories') 
  });

  const { data: banners = [], isLoading: isBannersLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: () => api.get<Banner[]>('/api/v1/banners')
  });

  const { data: productsData } = useQuery({ 
    queryKey: ['products'], 
    queryFn: () => api.get<{ items: Product[] }>('/api/v1/products') 
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

  if (!shop) return <div className="h-screen bg-[#09090b] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#09090b] pb-20">
      <StickyHeader 
        shop={shop} 
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryClick={scrollToCategory}
      />
      
      {/* Banner Carousel */}
      <div className="relative z-10">
        <BannerCarousel banners={banners} isLoading={isBannersLoading} />
      </div>

      <ProductFeed 
        categories={categories}
        products={products}
        onCategoryInView={setActiveCategoryId}
      />

      <CartSummaryBar products={products} />
      
      {/* Product Details Drawer */}
      <ProductDrawer />
    </div>
  );
};

export default HomePage;