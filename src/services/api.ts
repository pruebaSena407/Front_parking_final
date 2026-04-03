// Base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface RequestOptions extends RequestInit {
  timeout?: number;
}

/**
 * Make authenticated API requests
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options;

  const url = `${API_URL}/api${endpoint}`;
  
  // Get token from localStorage if available
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // DEBUG: Log las llamadas a API en desarrollo
  const isDev = import.meta.env.DEV;
  if (isDev) {
    console.log(`[API] ${fetchOptions.method || 'GET'} ${url}`, {
      headers,
      body: fetchOptions.body,
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // DEBUG: Log respuesta
    if (isDev) {
      console.log(`[API] Response: ${response.status}`, response);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({})) as {
        message?: string;
        error?: string;
      };
      const errorMsg =
        error.error || error.message || `API error: ${response.status}`;
      if (isDev) {
        console.error(`[API] Error:`, errorMsg);
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (isDev) {
      console.log(`[API] Data:`, data);
    }
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (isDev) {
      console.error(`[API] Caught error:`, error);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}

export default apiRequest;
