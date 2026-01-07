import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../shared/api/client';
import { useCartStore } from '../../../entities/cart/model/cart.store';
import { useShopStore } from '../../../entities/shop/model/shop.store';
import { OrderSchema, PaymentMethodSchema } from '@tma/shared';
import { Order } from '../../../shared/model/types';

interface CreateOrderParams {
  timeSlot: string;
  paymentMethod: 'online' | 'offline' | 'cash';
  onSuccess?: () => void;
}

export const useCreateOrder = () => {
  const navigate = useNavigate();
  const { items, clearCart, diningOption } = useCartStore();
  const { currentShopId, deliveryAddress } = useShopStore();

  return useMutation<Order, Error, CreateOrderParams>({
    mutationFn: (params) => {
      // 1. Prepare Items
      const orderItems = items.map(({ cartId, ...rest }) => rest);

      // 2. Determine Order Type
      let orderType = 'DELIVERY';
      if (!deliveryAddress) {
        orderType = diningOption === 'dine-in' ? 'DINE_IN' : 'TAKEOUT';
      }

      // 3. Map Payment Method to API Enum
      let paymentTypeApi;
      switch (params.paymentMethod) {
        case 'online':
            paymentTypeApi = PaymentMethodSchema.enum.CARD_ONLINE;
            break;
        case 'offline':
            paymentTypeApi = PaymentMethodSchema.enum.CARD_OFFLINE;
            break;
        case 'cash':
            paymentTypeApi = PaymentMethodSchema.enum.CASH;
            break;
        default:
            paymentTypeApi = PaymentMethodSchema.enum.CARD_ONLINE;
      }

      // 4. Send Request
      return api.post(
        '/api/v1/orders', 
        {
            shopId: currentShopId || 'default',
            type: orderType,
            items: orderItems,
            comment: 'Drawer Order',
            deliveryAddress: deliveryAddress || undefined,
            paymentMethod: paymentTypeApi,
            requestedTime: params.timeSlot
        },
        OrderSchema, // Enforce Zod Validation
        currentShopId || undefined
      );
    },
    onSuccess: (data, variables) => {
      variables.onSuccess?.();
      clearCart();
      // Navigate to success page with order ID and total
      navigate(`/success?id=${data.id}&total=${data.totalAmount}`);
    }
  });
};
