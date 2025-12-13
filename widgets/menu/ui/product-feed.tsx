import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Category, Product } from '../../../shared/model/types';
import { ProductCard } from '../../../entities/product/ui/product-card';
import { useCartStore } from '../../../entities/cart/model/cart.store';
import { useShopStore } from '../../../entities/shop/model/shop.store';

interface ProductFeedProps {
  categories: Category[];
  products: Product[];
  onCategoryInView: (categoryId: string) => void;
}

export const ProductFeed: React.FC<ProductFeedProps> = ({
  categories,
  products,
  onCategoryInView
}) => {
  const { addItem } = useCartStore();
  const { currentShopId } = useShopStore();
  
  const [_, setSearchParams] = useSearchParams();
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryId = entry.target.getAttribute('data-category-id');
            if (categoryId) {
              onCategoryInView(categoryId);
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is near top
        threshold: 0
      }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el instanceof Element) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [categories, onCategoryInView]);

  // Memoize handlers to make ProductCard.memo effective
  const handleProductClick = useCallback((productId: string) => {
    setSearchParams(prev => {
      prev.set('product', productId);
      return prev;
    });
  }, [setSearchParams]);

  const handleQuickAdd = useCallback((product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentShopId) {
        addItem(product, currentShopId);
    }
    
    // Haptic visual feedback
    const btn = e.currentTarget as HTMLButtonElement;
    btn.classList.add('scale-90');
    setTimeout(() => btn.classList.remove('scale-90'), 150);
  }, [addItem, currentShopId]);

  // Performance Optimization: Memoize the grouping structure
  const menuStructure = useMemo(() => {
    return categories.map(category => {
      const categoryProducts = products.filter(p => p.categoryId === category.id);
      
      if (categoryProducts.length === 0) return null;

      const groupedProducts: Record<string, Product[]> = {};
      const subcategories: string[] = [];

      categoryProducts.forEach(p => {
          const sub = p.subcategory || '@@other';
          if (!groupedProducts[sub]) {
              groupedProducts[sub] = [];
              subcategories.push(sub);
          }
          groupedProducts[sub].push(p);
      });

      return {
        category,
        subcategories,
        groupedProducts
      };
    }).filter(Boolean); // Remove nulls
  }, [categories, products]);

  return (
    <div className="flex flex-col gap-8 pb-32 px-4">
      {menuStructure.map((group) => {
        if (!group) return null; // Type guard, though filter handled it
        const { category, subcategories, groupedProducts } = group;

        return (
          <div 
            key={category.id} 
            id={`category-${category.id}`}
            data-category-id={category.id}
            ref={(el) => {
              sectionRefs.current[category.id] = el;
            }}
            className="scroll-mt-[120px]" 
          >
            {/* Sticky Header for Category */}
            <h2 className="text-xl font-bold text-white py-3 sticky top-[110px] z-30 bg-[#09090b]/95 backdrop-blur-md -mx-4 px-4 mb-2 shadow-sm border-b border-white/5">
              {category.name}
            </h2>
            
            <div className="flex flex-col gap-6">
                {subcategories.map(subName => {
                    const items = groupedProducts[subName];
                    const showSubTitle = subName !== '@@other';

                    return (
                        <div key={subName}>
                            {showSubTitle && (
                                <h3 className="text-[15px] font-bold text-gray-500 mb-3 mt-1">{subName}</h3>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                {items.map(product => (
                                    <ProductCard 
                                      key={product.id}
                                      product={product}
                                      onClick={() => handleProductClick(product.id)}
                                      onAddToCart={(e) => handleQuickAdd(product, e)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
};