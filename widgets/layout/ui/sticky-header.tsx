
import React, { useEffect } from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import { Clock, ShoppingCart, ChevronDown, Utensils, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Shop, Category } from '../../../shared/model/types';
import { cn } from '../../../shared/utils/cn';
import { useShopStore } from '../../../entities/shop/model/shop.store';

interface StickyHeaderProps {
  shop: Shop;
  categories: Category[];
  activeCategoryId: string;
  onCategoryClick: (id: string) => void;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  shop,
  categories,
  activeCategoryId,
  onCategoryClick
}) => {
  const navigate = useNavigate();
  const { deliveryAddress } = useShopStore();
  
  // Use manual motion value to guarantee scroll detection
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };
    
    // Initial set
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  // --- Configuration ---
  const EXPANDED_HEIGHT = 360; 
  const COLLAPSED_HEIGHT = 110; 
  const SCROLL_THRESHOLD = 250; 

  // --- Header Container Animations ---
  const containerHeight = useTransform(
    scrollY, 
    [0, SCROLL_THRESHOLD], 
    [EXPANDED_HEIGHT, COLLAPSED_HEIGHT]
  );

  const bannerOpacity = useTransform(scrollY, [0, SCROLL_THRESHOLD / 2], [1, 0]);
  const bannerScale = useTransform(scrollY, [0, SCROLL_THRESHOLD], [1.1, 1]); 
  const expandedContentOpacity = useTransform(scrollY, [0, SCROLL_THRESHOLD / 3], [1, 0]);
  const collapsedContentOpacity = useTransform(scrollY, [SCROLL_THRESHOLD / 1.5, SCROLL_THRESHOLD], [0, 1]);

  // --- Tab Animations ---
  const tabGap = useTransform(scrollY, [0, SCROLL_THRESHOLD], [8, 6]);
  
  // Icon Anim
  const iconOpacity = useTransform(scrollY, [0, SCROLL_THRESHOLD / 2], [1, 0]);
  const iconHeight = useTransform(scrollY, [0, SCROLL_THRESHOLD / 2], [28, 0]);
  const iconMb = useTransform(scrollY, [0, SCROLL_THRESHOLD / 2], [8, 0]);

  // --- Logic for Title/Subtitle ---
  // If deliveryAddress exists -> Title = Address, Subtitle = (Доставка ShopName)
  // Else -> Title = ShopName, Subtitle = Description
  const displayTitle = deliveryAddress || shop.name;
  const displaySubtitle = deliveryAddress ? `(Доставка ${shop.name})` : shop.description;

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 z-40 bg-[#09090b] overflow-hidden shadow-2xl shadow-black/80"
        style={{ 
            height: containerHeight,
            willChange: 'height' // Performance optimization for older Android devices
        }}
      >
        {/* ================= BACKGROUND LAYER ================= */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ opacity: bannerOpacity }}
        >
          <motion.img 
            src={shop.bannerUrl} 
            alt="Banner" 
            className="w-full h-full object-cover opacity-70"
            style={{ scale: bannerScale }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-black/30" />
        </motion.div>

        {/* ================= HERO CONTENT (Expanded) ================= */}
        <motion.div 
          className="absolute top-[140px] left-0 right-0 px-5 z-10"
          style={{ opacity: expandedContentOpacity }}
        >
           {/* Clickable Header Area for Shop Switch */}
           <div onClick={() => navigate('/locations')} className="active:opacity-70 transition-opacity cursor-pointer inline-block">
               <motion.h1 
                 className="text-[32px] font-bold text-white mb-1 tracking-tight leading-none drop-shadow-md flex items-center gap-2"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
               >
                 <span className="truncate max-w-[300px] block">{displayTitle}</span>
                 <ChevronDown size={28} className="text-gray-400 flex-shrink-0" />
               </motion.h1>
               <p className="text-gray-200 text-sm mb-4 font-medium opacity-90 leading-relaxed max-w-[90%] drop-shadow-sm">
                 {displaySubtitle}
               </p>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/90 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/5">
               <Clock size={12} />
               <span>{shop.openingHours || "09:00 - 21:00"}</span>
             </div>
             <div className={cn(
               "px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-lg",
               shop.isClosed ? "bg-red-500/90 text-white" : "bg-[#38bdf8] text-black"
             )}>
               {shop.isClosed ? 'Закрыто' : 'Открыто'}
             </div>
           </div>
        </motion.div>


        {/* ================= NAVBAR (Collapsed) ================= */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[56px] z-20 flex items-center justify-between px-4 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5"
          style={{ opacity: collapsedContentOpacity, pointerEvents: collapsedContentOpacity.get() === 0 ? 'none' : 'auto' }}
        >
           {/* Left: Shop Name + Chevron */}
           <div 
             className="flex items-center gap-1 active:opacity-70 transition-opacity cursor-pointer overflow-hidden"
             onClick={() => navigate('/locations')}
           >
              {deliveryAddress && <MapPin size={16} className="text-[#38bdf8] flex-shrink-0" />}
              <span className="text-lg font-bold text-white leading-none truncate max-w-[200px]">
                {displayTitle}
              </span>
              <ChevronDown size={16} className="text-gray-400 mt-[2px] flex-shrink-0" />
           </div>

           {/* Right: Cart Icon */}
           <button 
             onClick={() => navigate('/cart')}
             className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1c1c1e] text-white border border-white/5 active:scale-90 transition-all flex-shrink-0"
           >
             <ShoppingCart size={18} />
           </button>
        </motion.div>


        {/* ================= TABS CONTAINER ================= */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pt-3 pb-3 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent">
           <motion.div 
             className="flex overflow-x-auto no-scrollbar px-4 pb-1 snap-x items-end"
             style={{ gap: tabGap }}
           >
             {categories.map(cat => {
               const isActive = activeCategoryId === cat.id;
               return (
                 <motion.button
                   key={cat.id}
                   onClick={() => onCategoryClick(cat.id)}
                   className={cn(
                     "relative rounded-[18px] transition-all duration-300 snap-start flex flex-col items-center justify-center flex-shrink-0 overflow-hidden",
                     isActive
                       ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                       : "bg-[#1c1c1e]/60 backdrop-blur-md text-gray-400 hover:bg-[#27272a] border border-white/5"
                   )}
                   layout 
                 >
                   <motion.div
                      className="px-5 pt-4 w-full flex justify-center"
                      style={{ 
                        opacity: iconOpacity,
                        height: iconHeight,
                        marginBottom: iconMb,
                      }}
                   >
                     {cat.iconUrl ? (
                         <img 
                            src={cat.iconUrl} 
                            alt={cat.name} 
                            className={cn(
                                "w-full h-full object-contain filter", 
                                isActive ? "brightness-0" : "invert brightness-200"
                            )} 
                         />
                     ) : (
                         <Utensils className="w-full h-full" strokeWidth={1.5} />
                     )}
                   </motion.div>

                   <div className="px-5 pb-3 pt-0.5">
                    <span className="text-[13px] font-bold whitespace-nowrap leading-none tracking-wide">
                        {cat.name}
                    </span>
                   </div>
                 </motion.button>
               );
             })}
             
             {/* Spacer */}
             <div className="w-2 flex-shrink-0" />
           </motion.div>
        </div>

      </motion.header>
      
      {/* Spacer to push content down */}
      <div style={{ height: EXPANDED_HEIGHT }} /> 
    </>
  );
};
