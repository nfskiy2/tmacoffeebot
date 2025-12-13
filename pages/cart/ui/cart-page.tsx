import React from 'react';
import { CartViewer } from '../../../widgets/cart/ui/cart-viewer';

const CartPage = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-white pb-32">
      <CartViewer />
    </div>
  );
};

export default CartPage;