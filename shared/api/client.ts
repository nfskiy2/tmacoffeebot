import { mockRouter } from './mocks/mock-router';
import { MOCK_SHOP_ID } from './mocks/data';

// --- Client Implementation ---

class ApiClient {
  private baseUrl = ''; // Empty for mock usage, usually process.env.API_URL
  private shopId: string | null = null;

  /**
   * Sets the context for the current shop tenant.
   * Should be called when the app initializes or switches shops.
   */
  public setShopId(id: string) {
    this.shopId = id;
  }

  private async request<T>(endpoint: string, config: RequestInit = {}): Promise<T> {
    const currentShopId = this.shopId || MOCK_SHOP_ID;
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'X-Shop-Id': currentShopId,
      ...(config.headers || {}),
    };

    // 1. Check Mock Router
    console.log(`[API] ${config.method || 'GET'} ${endpoint} [Shop: ${currentShopId}]`);
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