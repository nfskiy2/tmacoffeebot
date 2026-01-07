
import React, { useState } from 'react';
import { CafeInfo } from '../../../entities/shop/ui/cafe-info';
import { ProductCard } from '../../../entities/product/ui/product-card';
import { CartItem } from '../../../entities/cart/ui/cart-item';
import { QuantitySelector } from '../../../shared/ui/quantity-selector';
import { MOCK_SHOP, MOCK_PRODUCTS } from '../../../shared/api/mocks/data';

const PlaygroundPage = () => {
  const [qty, setQty] = useState(1);
  const product = MOCK_PRODUCTS[0]; // Cappuccino
  const productLong = MOCK_PRODUCTS[1]; // Flat White

  return (
    <div className="min-h-screen bg-[#09090b] text-foreground p-6 pb-24 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">UI Playground</h1>

      {/* Section 1: Cafe Info */}
      <section className="mb-10">
        <h2 className="text-gray-500 text-sm uppercase tracking-wider mb-4">Cafe Info Card</h2>
        <CafeInfo shop={MOCK_SHOP} />
        <div className="h-4" />
        <CafeInfo shop={{...MOCK_SHOP, isClosed: true}} />
      </section>

      {/* Section 2: Product Cards (Grid Simulation) */}
      <section className="mb-10">
        <h2 className="text-gray-500 text-sm uppercase tracking-wider mb-4">Product Cards (Grid)</h2>
        <div className="grid grid-cols-2 gap-3">
          <ProductCard 
            product={product} 
            onAddToCart={() => alert('Add to cart')}
          />
          <ProductCard 
            product={{...productLong, name: 'Super Long Name For A Coffee Product That Might Break Layout'}} 
            onAddToCart={() => alert('Add to cart')}
          />
          <ProductCard 
            product={MOCK_PRODUCTS[2]} 
            onAddToCart={() => alert('Add to cart')}
          />
        </div>
      </section>

      {/* Section 3: Cart Items */}
      <section className="mb-10">
        <h2 className="text-gray-500 text-sm uppercase tracking-wider mb-4">Cart Items</h2>
        <div className="space-y-2">
            <CartItem 
                item={{ productId: product.id, quantity: 2 }}
                product={product}
                onIncrease={() => console.log('inc')}
                onDecrease={() => console.log('dec')}
            />
             <CartItem 
                item={{ productId: productLong.id, quantity: 99 }}
                product={productLong}
                onIncrease={() => console.log('inc')}
                onDecrease={() => console.log('dec')}
            />
        </div>
      </section>

      {/* Section 4: Controls */}
      <section className="mb-10">
        <h2 className="text-gray-500 text-sm uppercase tracking-wider mb-4">Controls</h2>
        <div className="p-4 bg-zinc-900 rounded-xl flex items-center justify-between">
            <span>Quantity Selector (Value: {qty})</span>
            <QuantitySelector 
                value={qty} 
                onIncrease={() => setQty(q => q + 1)}
                onDecrease={() => setQty(q => Math.max(0, q - 1))}
            />
        </div>
      </section>

    </div>
  );
};

export default PlaygroundPage;
