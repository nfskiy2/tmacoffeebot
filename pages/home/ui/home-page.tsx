import React from 'react';
import { MenuViewer } from '../../../widgets/menu/ui/menu-viewer';
import { BannerCarousel } from '../../../widgets/banners/ui/banner-carousel';
import { ProductDrawer } from '../../../widgets/product-details/ui/product-drawer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#09090b] pb-20">
      
      {/* Smart Widget: Handles Shop, Categories, Header and Product Feed */}
      {/* We pass BannerCarousel as a slot so it renders in the correct flow position relative to the Sticky Header */}
      <MenuViewer 
        heroSlot={<BannerCarousel />}
      />

      {/* Global Widget: Drawer listening to URL params */}
      <ProductDrawer />
    </div>
  );
};

export default HomePage;