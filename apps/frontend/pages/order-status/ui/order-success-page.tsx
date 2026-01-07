import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, Receipt } from 'lucide-react';
import { formatPrice } from '../../../shared/lib/currency';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id') || 'unknown';
  const total = searchParams.get('total');

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#38bdf8]/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-24 h-24 bg-[#38bdf8]/20 rounded-full flex items-center justify-center mb-6 text-[#38bdf8]"
      >
        <CheckCircle2 size={48} strokeWidth={3} />
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-white mb-2"
      >
        Заказ принят!
      </motion.h1>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 mb-8 max-w-[280px]"
      >
        Ваш заказ <span className="text-white font-mono font-bold">#{orderId.slice(-4).toUpperCase()}</span> готовится. Мы уведомим вас о готовности.
      </motion.p>

      {total && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1c1c1e] px-6 py-4 rounded-2xl border border-white/5 mb-8 min-w-[200px]"
          >
             <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Сумма заказа</div>
             <div className="text-2xl font-bold text-white">{formatPrice(parseInt(total))}</div>
          </motion.div>
      )}

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs space-y-3"
      >
        <button 
            onClick={() => navigate('/')}
            className="w-full bg-[#38bdf8] text-black font-bold h-14 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
            <Home size={20} />
            Вернуться в меню
        </button>
        
        {/* Placeholder for future feature */}
        <button 
            onClick={() => alert('Функция истории заказов в разработке')}
            className="w-full bg-[#1c1c1e] text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform border border-white/5"
        >
            <Receipt size={20} />
            Детали заказа
        </button>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
