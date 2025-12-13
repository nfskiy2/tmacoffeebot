import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '../../../shared/api/client';
import { BannerSchema } from '../../../packages/shared/schemas';
import { Banner } from '../../../shared/model/types';
import { Image } from '../../../shared/ui/image';

// Schema for array of banners
const BannerListSchema = z.array(BannerSchema);

export const BannerCarousel: React.FC = () => {
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: () => api.get<Banner[]>('/api/v1/banners', BannerListSchema)
  });

  if (isLoading) {
    return (
      <div className="flex gap-4 px-4 overflow-hidden py-4">
        {[1, 2].map((i) => (
           <div key={i} className="shrink-0 w-[85%] aspect-[2.1/1] rounded-2xl bg-[#1c1c1e] animate-pulse" />
        ))}
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto no-scrollbar snap-x snap-mandatory flex gap-4 px-4 py-4">
      {banners.map((banner) => (
        <div 
          key={banner.id}
          className="relative shrink-0 w-[85%] aspect-[2.1/1] rounded-2xl overflow-hidden snap-center shadow-lg active:scale-[0.98] transition-transform bg-zinc-800"
        >
          {/* Background Image */}
          <Image 
            src={banner.imageUrl} 
            alt={banner.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

          {/* Text Content */}
          <div className="absolute inset-0 p-5 flex flex-col justify-center items-start pointer-events-none">
            <h3 className="text-white text-xl font-extrabold leading-tight mb-2 drop-shadow-md">
                {banner.title}
            </h3>
            {banner.description && (
                <p className="text-gray-200 text-sm font-medium whitespace-pre-line leading-relaxed drop-shadow-sm max-w-[70%]">
                    {banner.description}
                </p>
            )}
            
            {/* Optional CTA Button look */}
            {banner.actionUrl && (
                <div className="mt-3 px-3 py-1.5 bg-white text-black text-[11px] font-bold rounded-lg uppercase tracking-wider">
                    Подробнее
                </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Spacer for right padding */}
      <div className="w-0.5 shrink-0" />
    </div>
  );
};