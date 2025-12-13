import { ZodSchema } from 'zod';
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

  private async request<T>(endpoint: string, schema?: ZodSchema<T>, config: RequestInit = {}): Promise<T> {
    const currentShopId = this.shopId || MOCK_SHOP_ID;
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'X-Shop-Id': currentShopId,
      ...(config.headers || {}),
    };

    let responseData: any;
    let status: number;

    // 1. Check Mock Router
    console.log(`[API] ${config.method || 'GET'} ${endpoint} [Shop: ${currentShopId}]`);
    const mockResponse = await mockRouter(
        endpoint, 
        config.method || 'GET', 
        config.body ? JSON.parse(config.body as string) : undefined,
        headers as Record<string, string>
    );
    
    if (mockResponse) {
      status = mockResponse.status;
      responseData = mockResponse.data;
    } else {
      // 2. Real Fetch Fallback
      const response = await fetch(url, {
        ...config,
        headers: headers as HeadersInit,
      });
      status = response.status;
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      responseData = await response.json();
    }

    if (status >= 200 && status < 300) {
      // 3. RUNTIME VALIDATION
      if (schema) {
        try {
          return schema.parse(responseData);
        } catch (error) {
          console.error(`[API Validation Error] ${endpoint}:`, error);
          throw new Error(`API Validation Error for ${endpoint}`);
        }
      }
      return responseData as T;
    }
    
    throw new Error(`API Error: ${status}`);
  }

  get<T>(endpoint: string, schema?: ZodSchema<T>, params?: Record<string, string>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<T>(endpoint + queryString, schema, { method: 'GET' });
  }

  post<T>(endpoint: string, body: any, schema?: ZodSchema<T>) {
    return this.request<T>(endpoint, schema, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const api = new ApiClient();