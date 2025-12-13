
import { MOCK_SHOP, MOCK_SHOPS, SHOP_DATABASES, MOCK_SHOP_ID } from './mocks/data';
import { OrderPayload, Order } from '../model/types';

// Storage key for the shop ID
const STORAGE_KEY_SHOP_ID = 'tma_shop_id';

// Helper to get or set shop ID
const getShopId = (): string => {
  let shopId = localStorage.getItem(STORAGE_KEY_SHOP_ID);
  if (!shopId) {
    shopId = MOCK_SHOP_ID;
    localStorage.setItem(STORAGE_KEY_SHOP_ID, shopId);
  }
  return shopId;
};

// --- Mocking Logic ---

const SIMULATE_DELAY_MS = 600;

interface MockResponse<T> {
  data: T;
  status: number;
}

const mockRouter = async (url: string, method: string, body?: any, headers: Record<string, string> = {}): Promise<MockResponse<any> | null> => {
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

// --- Client Implementation ---

class ApiClient {
  private baseUrl = ''; // Empty for mock usage, usually process.env.API_URL

  private async request<T>(endpoint: string, config: RequestInit = {}): Promise<T> {
    const shopId = getShopId();
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'X-Shop-Id': shopId,
      ...(config.headers || {}),
    };

    // 1. Check Mock Router
    console.log(`[API] ${config.method || 'GET'} ${endpoint} [Shop: ${shopId}]`);
    const mockResponse = await mockRouter(
        endpoint, 
        config.method || 'GET', 
        config.body ? JSON.parse(config.body as string) : undefined,
        headers as Record<string, string>
    );
    
    if (mockResponse) {
      if (mockResponse.status >= 200 && mockResponse.status < 300) {
        return mockResponse.data as T;
      }
      throw new Error(`Mock API Error: ${mockResponse.status}`);
    }

    // 2. Real Fetch Fallback
    const response = await fetch(url, {
      ...config,
      headers: headers as HeadersInit,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  get<T>(endpoint: string, params?: Record<string, string>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<T>(endpoint + queryString, { method: 'GET' });
  }

  post<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const api = new ApiClient();
