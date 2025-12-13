import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '../../../shared/api/client';
import { ShopSchema } from '../../../packages/shared/schemas';
import { Shop } from '../../../shared/model/types';
import { DELIVERY_SHOP_ID } from '../../../shared/api/mocks/data';
import { useShopStore } from '../../../entities/shop/model/shop.store';
import { ShopCard } from '../../../entities/shop/ui/shop-card';

interface ShopListProps {
  onRequestChangeContext: (action: () => void) => void;
}

const ShopListResponseSchema = z.array(ShopSchema);

export const ShopList: React.FC<ShopListProps> = ({ onRequestChangeContext }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentShopId, setShopId, setDeliveryAddress } = useShopStore();

  const { data: shops = [], isLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: () => api.get<Shop[]>('/api/v1/shops', ShopListResponseSchema),
  });

  // Filter out the technical delivery shop from the "Hall" list
  const physicalShops = shops.filter(s => s.id !== DELIVERY_SHOP_ID);

  const handleSelectShop = async (id: string) => {
    // If shop is same, just go back
    if (id === currentShopId) {
       navigate('/');
       return;
    }

    onRequestChangeContext(async () => {
        // Mode: Hall -> Clear delivery address
        setDeliveryAddress(null);
        setShopId(id);
        
        await queryClient.invalidateQueries();
        navigate('/');
    });
  };

  if (isLoading) {
    return <div className="text-gray-500 text-center py-10">Загрузка локаций...</div>;
  }

  return (
    <div className="space-y-3">
      {physicalShops.map((shop) => (
        <ShopCard
          key={shop.id}
          shop={shop}
          isSelected={shop.id === currentShopId}
          onClick={() => handleSelectShop(shop.id)}
        />
      ))}
    </div>
  );
};