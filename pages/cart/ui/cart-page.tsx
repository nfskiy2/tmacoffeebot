
import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Trash2, ArrowRight, Bike, ShoppingBag, Armchair, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../../../entities/cart/model/cart.store';
import { useShopStore } from '../../../entities/shop/model/shop.store';
import { CartItem } from '../../../entities/cart/ui/cart-item';
import { api } from '../../../shared/api/client';
import { Product, Shop } from '../../../shared/model/types';
import { cn } from '../../../shared/utils/cn';
import { CheckoutDrawer } from '../../../widgets/checkout/ui/checkout-drawer';
import { calculateCartTotal } from '../../../entities/cart/lib/cart-helpers';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, diningOption, setDiningOption } = useCartStore();
  const { deliveryAddress } = useShopStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Fetch products for cart items
  const { data: productData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get<{ items: Product[] }>('/api/v1/products')
  });

  // Fetch shop for checkout context
  const { data: shop } = useQuery({
    queryKey: ['shop'],
    queryFn: () => api.get<Shop>('/api/v1/shop')
  });

  const products = productData?.items || [];

  const enrichedItems = useMemo(() => {
    return items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return { ...item, product };
    }).filter(item => item.product !== undefined) as (typeof items[0] & { product: Product })[];
  }, [items, products]);

  // Logic to determine Order Context (Icon, Title, Time, Address)
  const orderContext = useMemo(() => {
    if (deliveryAddress) {
      return {
        icon: Bike,
        title: 'Доставка курьером',
        time: '35-45 мин',
        address: deliveryAddress
      };
    }
    
    // Shop address fallback
    const shopAddress = shop?.address || 'Загрузка адреса...';

    if (diningOption === 'dine-in') {
      return {
        icon: Armchair,
        title: 'В зале',
        time: '5-10 мин',
        address: shopAddress
      };
    }

    return {
      icon: ShoppingBag,
      title: 'С собой',
      time: '10-15 мин',
      address: shopAddress
    };
  }, [deliveryAddress, diningOption, shop]);

  const totalAmount = calculateCartTotal(items, products);

  const ContextIcon = orderContext.icon;

  if (isProductsLoading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-gray-500">Загрузка корзины...</div>;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
            <Trash2 className="text-gray-600 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Корзина пуста</h2>
        <p className="text-gray-400 mb-8 max-w-[250px]">
          Кажется, вы еще ничего не выбрали.
        </p>
        <Link 
          to="/" 
          className="bg-[#38bdf8] text-black font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity"
        >
          В меню
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-[#09090b]/90 backdrop-blur-md p-4 flex flex-col gap-4 border-b border-white/5 z-20">
        <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 active:bg-zinc-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Корзина</h1>
            <button 
                onClick={clearCart} 
                className="ml-auto text-sm text-red-400 font-medium"
            >
                Очистить
            </button>
        </div>

        {/* Dining Option Toggle - Only show if NOT delivery */}
        {!deliveryAddress && (
             <div className="bg-[#1c1c1e] p-1 rounded-xl flex relative h-10 w-full mt-1">
                 <motion.div
                   className="absolute top-1 bottom-1 bg-[#38bdf8] rounded-lg z-0"
                   initial={false}
                   animate={{
                     x: diningOption === 'dine-in' ? 0 : '100%',
                     width: '50%'
                   }}
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 />
           
                 <button
                   onClick={() => setDiningOption('dine-in')}
                   className={cn(
                     "flex-1 z-10 text-[14px] font-medium transition-colors duration-200",
                     diningOption === 'dine-in' ? "text-black font-bold" : "text-gray-400"
                   )}
                 >
                   В зале
                 </button>
           
                 <button
                   onClick={() => setDiningOption('takeout')}
                   className={cn(
                     "flex-1 z-10 text-[14px] font-medium transition-colors duration-200",
                     diningOption === 'takeout' ? "text-black font-bold" : "text-gray-400"
                   )}
                 >
                   С собой
                 </button>
             </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        
        {/* Order Info Card (Dynamic Context) */}
        <div className="bg-[#1c1c1e] p-4 rounded-2xl flex items-center gap-4 border border-white/5 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#38bdf8]/10 flex items-center justify-center text-[#38bdf8] flex-shrink-0">
                <ContextIcon size={24} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                     <h3 className="font-bold text-white text-[16px] leading-tight">{orderContext.title}</h3>
                     <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-md whitespace-nowrap">
                        <Clock size={12} />
                        <span>{orderContext.time}</span>
                     </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                     <MapPin size={14} className="flex-shrink-0 text-gray-500" />
                     <span className="truncate">{orderContext.address}</span>
                </div>
            </div>
        </div>

        {/* Items List */}
        {enrichedItems.map((item) => (
          <CartItem 
            key={item.cartId}
            item={item}
            product={item.product}
            onIncrease={() => updateQuantity(item.cartId, 1)}
            onDecrease={() => updateQuantity(item.cartId, -1)}
            onRemove={() => removeItem(item.cartId)}
          />
        ))}
      </div>

      {/* Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#09090b] border-t border-white/5 z-30 pb-safe">
        <div className="flex justify-between items-center mb-4 text-sm">
            <span className="text-gray-400">Итого</span>
            <span className="text-xl font-bold text-white">{(totalAmount / 100).toFixed(0)}₽</span>
        </div>
        
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="w-full bg-[#38bdf8] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Оформить заказ
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Checkout Drawer */}
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
