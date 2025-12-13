
import React from 'react';
import { ChevronDown, Clock } from 'lucide-react';
import { Shop } from '../../../shared/model/types';
import { cn } from '../../../shared/utils/cn';

interface CafeInfoProps {
  shop: Shop;
  className?: string;
}

export const CafeInfo: React.FC<CafeInfoProps> = ({ shop, className }) => {
  return (
    <div className={cn("bg-[#18181b] p-5 rounded-[20px] text-white shadow-sm", className)}>
      <div className="flex justify-between items-start mb-1">
        <h2 className="text-2xl font-bold leading-tight flex items-center gap-2">
          {shop.name}
          <ChevronDown className="text-gray-400 w-6 h-6" />
        </h2>
      </div>

      <p className="text-gray-400 text-sm mb-4 font-medium">
        {shop.description || 'Кофе и десерты'}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
          <Clock className="w-4 h-4" />
          <span>{shop.openingHours || "Пн - Вс: 08:00 - 22:00"}</span>
        </div>

        <div className={cn(
          "px-4 py-2 rounded-xl text-sm font-bold",
          !shop.isClosed ? "bg-[#38bdf8] text-black" : "bg-red-500/10 text-red-500"
        )}>
          {!shop.isClosed ? 'Открыто' : 'Закрыто'}
        </div>
      </div>
    </div>
  );
};
