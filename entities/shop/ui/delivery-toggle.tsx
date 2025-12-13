import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../shared/utils/cn';

interface DeliveryToggleProps {
  value: 'hall' | 'delivery';
  onChange: (value: 'hall' | 'delivery') => void;
}

export const DeliveryToggle: React.FC<DeliveryToggleProps> = ({ value, onChange }) => {
  return (
    <div className="bg-[#1c1c1e] p-1 rounded-xl flex relative h-12 w-full">
      {/* Background slider */}
      <motion.div
        className="absolute top-1 bottom-1 bg-[#38bdf8] rounded-lg z-0"
        initial={false}
        animate={{
          x: value === 'hall' ? 0 : '100%',
          width: '50%'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <button
        onClick={() => onChange('hall')}
        className={cn(
          "flex-1 z-10 text-[15px] font-medium transition-colors duration-200",
          value === 'hall' ? "text-black font-bold" : "text-gray-400"
        )}
      >
        В зале
      </button>

      <button
        onClick={() => onChange('delivery')}
        className={cn(
          "flex-1 z-10 text-[15px] font-medium transition-colors duration-200",
          value === 'delivery' ? "text-black font-bold" : "text-gray-400"
        )}
      >
        Доставка
      </button>
    </div>
  );
};