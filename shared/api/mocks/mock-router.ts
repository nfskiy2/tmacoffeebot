import { OrderPayload, Order } from '../../model/types';
import { MOCK_SHOP, MOCK_SHOPS, SHOP_DATABASES, MOCK_BANNERS } from './data';

const SIMULATE_DELAY_MS = 600;

export interface MockResponse<T> {
  data: T;
  status: number;
}

export const mockRouter = async (url: string, method: string, body?: any, headers: Record<string, string> = {}): Promise<MockResponse<any> | null> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, SIMULATE_DELAY_MS));

  // Determine current shop database
  const reqShopId = headers['X-Shop-Id'];
  // Fallback to shop_1 if ID is invalid or not found in DB, ensuring app doesn't crash
  const currentShopData = SHOP_DATABASES[reqShopId] || SHOP_DATABASES['shop_1'];

  // --- GET /api/v1/shops ---
  if (url === '/api/v1/shops' && method === 'GET') {
    return { status: 200, data: MOCK_SHOPS };
  }

  // --- GET /api/v1/shop ---
  if (url === '/api/v1/shop' && method === 'GET') {
    const foundShop = MOCK_SHOPS.find(s => s.id === reqShopId) || MOCK_SHOP;
    return { status: 200, data: foundShop };
  }

  // --- GET /api/v1/banners ---
  if (url === '/api/v1/banners' && method === 'GET') {
    return { status: 200, data: MOCK_BANNERS };
  }

  // --- GET /api/v1/categories ---
  if (url === '/api/v1/categories' && method === 'GET') {
    return { status: 200, data: currentShopData.categories };
  }

  // --- GET /api/v1/products ---
  if (url.startsWith('/api/v1/products') && method === 'GET') {
    // Parse query params simply
    const urlObj = new URL('http://dummy.com' + url); 
    const categoryId = urlObj.searchParams.get('categoryId');
    
    let items = currentShopData.products;
    
    if (categoryId) {
      items = items.filter(p => p.categoryId === categoryId);
    }

    return { 
      status: 200, 
      data: {
        items,
        total: items.length
      } 
    };
  }

  // --- POST /api/v1/orders ---
  if (url === '/api/v1/orders' && method === 'POST') {
    const payload = body as OrderPayload;
    
    // For order calculation, we strictly use the products available in the shop context
    // In a real app, this validation happens on backend
    const availableProducts = currentShopData.products;

    let totalAmount = 0;
    payload.items.forEach(item => {
      const product = availableProducts.find(p => p.id === item.productId);
      if (product) {
        let price = product.price;
        // Add addon prices
        if (item.selectedAddons) {
          item.selectedAddons.forEach(addonId => {
            const addon = product.addons?.find(a => a.id === addonId);
            if (addon) price += addon.price;
          });
        }
        totalAmount += price * item.quantity;
      }
    });

    const newOrder: Order = {
      id: `ord_${Math.floor(Math.random() * 10000)}`,
      shopId: payload.shopId,
      status: 'PENDING',
      items: payload.items,
      totalAmount,
      comment: payload.comment,
      createdAt: new Date().toISOString(),
    };

    return { status: 201, data: newOrder };
  }

  return null; // Not mocked
};