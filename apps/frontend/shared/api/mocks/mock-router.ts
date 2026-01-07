
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

  // --- GET /api/v1/shops ---
  // Global endpoint, does not require a specific valid shop context in DB
  if (url === '/api/v1/shops' && method === 'GET') {
    return { status: 200, data: MOCK_SHOPS };
  }

  // STRICT CHECK:
  // If we are accessing specific shop resources, the Shop ID MUST exist in our database.
  // We do NOT fallback to 'shop_1' anymore to prevent data leaks between tenants.
  const currentShopData = SHOP_DATABASES[reqShopId];

  if (!currentShopData) {
    // If the request implies a specific shop context but it's invalid
    if (url.startsWith('/api/v1/')) {
       console.warn(`[MockRouter] 404 - Shop Context '${reqShopId}' not found for ${url}`);
       return { status: 404, data: { message: `Shop context '${reqShopId}' not found.` } };
    }
    return null;
  }

  // --- GET /api/v1/shop ---
  if (url === '/api/v1/shop' && method === 'GET') {
    const foundShop = MOCK_SHOPS.find(s => s.id === reqShopId);
    // Use MOCK_SHOP only if the ID exists in DB structure but not in MOCK_SHOPS list (edge case), 
    // otherwise 404 logic above handles invalid IDs.
    return { status: 200, data: foundShop || MOCK_SHOP };
  }

  // --- GET /api/v1/banners ---
  if (url === '/api/v1/banners' && method === 'GET') {
    return { status: 200, data: MOCK_BANNERS };
  }

  // --- GET /api/v1/categories ---
  if (url === '/api/v1/categories' && method === 'GET') {
    return { status: 200, data: currentShopData.categories };
  }

  // --- GET /api/v1/products/:id (Single Product) ---
  const productMatch = url.match(/^\/api\/v1\/products\/([\w-]+)$/);
  if (productMatch && method === 'GET') {
    const productId = productMatch[1];
    const product = currentShopData.products.find(p => p.id === productId);
    if (product) {
      return { status: 200, data: product };
    }
    return { status: 404, data: { message: 'Product not found' } };
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
    const availableProducts = currentShopData.products;

    let totalAmount = 0;
    
    try {
        payload.items.forEach(item => {
          const product = availableProducts.find(p => p.id === item.productId);
          
          if (!product) {
              // SECURITY: Validation to prevent ordering items not in current context
              throw new Error(`Product ${item.productId} not found in current shop context`);
          }

          let price = product.price;
          // Add addon prices
          if (item.selectedAddons) {
            item.selectedAddons.forEach(addonId => {
              const addon = product.addons?.find(a => a.id === addonId);
              if (addon) price += addon.price;
            });
          }
          totalAmount += price * item.quantity;
        });
    } catch (e) {
        return { status: 400, data: { message: (e as Error).message } };
    }

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
