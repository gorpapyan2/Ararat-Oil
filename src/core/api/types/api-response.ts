
/**
 * Common API response types
 */

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  queryParams?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string>;
}
