
import { ZodSchema, ZodError } from 'zod';
import { mockRouter } from './mocks/mock-router';

// --- Client Implementation ---

export interface ApiRequestConfig extends RequestInit {
  skipShopIdCheck?: boolean;
}

class ApiClient {
  private baseUrl = ''; // Empty for mock usage, usually process.env.API_URL

  private async request<T>(
    endpoint: string, 
    schema?: ZodSchema<T>, 
    config: ApiRequestConfig = {},
    shopId?: string
  ): Promise<T> {
    // SECURITY IMPROVEMENT:
    // We strictly require shopId for most requests to ensure tenant isolation.
    let currentShopId = shopId;

    if (!currentShopId) {
        // Allow bypassing the check explicitly via config (e.g. for listing available shops)
        if (config.skipShopIdCheck) {
            currentShopId = 'global'; 
        } else {
             const errorMsg = `[API Security] X-Shop-Id header is required for ${endpoint}. Request blocked.`;
             console.error(errorMsg);
             throw new Error(errorMsg);
        }
    }

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
          if (error instanceof ZodError) {
             const details = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
             console.error(`[API Validation Error] ${endpoint}:`, details);
             throw new Error(`Contract Validation Failed for ${endpoint}: ${details}`);
          }
          console.error(`[API Unknown Error] ${endpoint}:`, error);
          throw error;
        }
      }
      return responseData as T;
    }
    
    throw new Error(`API Error: ${status}`);
  }

  get<T>(endpoint: string, schema?: ZodSchema<T>, config?: ApiRequestConfig, shopId?: string) {
    return this.request<T>(endpoint, schema, { method: 'GET', ...config }, shopId);
  }

  post<T>(endpoint: string, body: any, schema?: ZodSchema<T>, shopId?: string) {
    return this.request<T>(endpoint, schema, {
      method: 'POST',
      body: JSON.stringify(body),
    }, shopId);
  }
}

export const api = new ApiClient();
