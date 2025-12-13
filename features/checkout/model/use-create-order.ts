import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../shared/api/client';
import { useCartStore } from '../../../entities/cart/model/cart.store';
import { useShopStore } from '../../../entities/shop/model/shop.store';

interface CreateOrderParams {
  timeSlot: string;
  paymentMethod: 'online' | 'offline';
  onSuccess?: () => void;
}

export const useCreateOrder = () => {
  const navigate = useNavigate();
  const { items, clearCart, diningOption } = useCartStore();
  const { currentShopId, deliveryAddress } = useShopStore();

  return useMutation({
    mutationFn: (params: CreateOrderParams) => {
      // 1. Prepare Items
      const orderItems = items.map(({ cartId, ...rest }) => rest);

      // 2. Determine Order Type
      let orderType = 'DELIVERY';
      if (!deliveryAddress) {
        orderType = diningOption === 'dine-in' ? 'DINE_IN' : 'TAKEOUT';
      }

      // 3. Map Payment Method to API Enum
      const paymentTypeApi = params.paymentMethod === 'online' ? 'CARD_ONLINE' : 'CARD_OFFLINE';

      // 4. Send Request
      return api.post('/api/v1/orders', {
        shopId: currentShopId || 'default',
        type: orderType,
        items: orderItems,
        comment: 'Drawer Order',
        deliveryAddress: deliveryAddress || undefined,
        paymentMethod: paymentTypeApi,
        requestedTime: params.timeSlot
      });
    },
    onSuccess: (_, variables) => {
      variables.onSuccess?.();
      alert('Заказ успешно оплачен!');
      clearCart();
      navigate('/');
    }
  });
};