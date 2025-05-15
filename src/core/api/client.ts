/**
 * Core API Client
 * 
 * This file provides the core API client functionality for making requests
 * to various backend services. It handles authentication, error handling,
 * retry logic, and request/response formatting.
 */

import { supabase } from './supabase';
import { 
  API_CONFIG, 
  API_ERROR_TYPE, 
  getErrorTypeFromStatus 
} from '@/core/config/api';
import { isDevelopment } from '@/core/config/environment';

// Helper to handle errors with proper typing and logging
export interface ApiError {
  type: API_ERROR_TYPE;
  status?: number;
  message: string;
  originalError?: any;
}

/**
 * Creates a formatted API error
 */
export function createApiError(
  type: API_ERROR_TYPE,
  message: string,
  status?: number,
  originalError?: any
): ApiError {
  const error: ApiError = {
    type,
    message,
    status,
    originalError,
  };

  if (isDevelopment()) {
    console.error(`API Error [${type}]:`, message, originalError);
  }

  return error;
}

/**
 * Checks if an error is a network-related error
 */
export function isNetworkError(error: any): boolean {
  return (
    error?.message?.includes('Failed to fetch') || 
    error?.message?.includes('Network Error') ||
    error?.message?.includes('NetworkError') ||
    error?.name === 'TypeError' && error?.message?.includes('fetch')
  );
}

/**
 * Generic response type for API calls
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  status?: number;
  metadata?: {
    requestId?: string;
    timestamp?: number;
    [key: string]: any;
  };
}

/**
 * API request options
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean | null | undefined>;
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
}

/**
 * Makes a request to a Supabase Edge Function
 */
export async function fetchFromFunction<T = any>(
  functionPath: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    // Get current session for auth token
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    // Set up headers
    const headers: HeadersInit = {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    };

    // Add auth token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add query parameters if provided
    let url = `${API_CONFIG.FUNCTIONS_URL}/${functionPath}`;
    if (options.queryParams) {
      const queryString = Object.entries(options.queryParams)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
      cache: options.cache,
      signal: options.timeout 
        ? AbortSignal.timeout(options.timeout) 
        : undefined,
      // Add body for non-GET requests if provided
      ...(options.method !== 'GET' && options.body
        ? { body: JSON.stringify(options.body) }
        : {}),
    };

    // Make the fetch request
    const response = await fetch(url, requestOptions);
    const result = await response.json();

    // Check for error response
    if (!response.ok) {
      const errorType = getErrorTypeFromStatus(response.status);
      throw createApiError(
        errorType,
        result.error || `HTTP error ${response.status}`,
        response.status,
        result
      );
    }

    // Get request ID safely
    const requestId = response.headers.get('x-request-id');

    return {
      data: result.data || result,
      status: response.status,
      metadata: {
        requestId: requestId || undefined,
        timestamp: Date.now(),
      }
    };
  } catch (error: any) {
    // Handle network errors
    if (isNetworkError(error)) {
      return {
        error: createApiError(
          API_ERROR_TYPE.NETWORK,
          'Network connection error',
          undefined,
          error
        )
      };
    }
    
    // Handle timeout errors
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return {
        error: createApiError(
          API_ERROR_TYPE.TIMEOUT,
          'Request timed out',
          undefined,
          error
        )
      };
    }

    // Already formatted API errors
    if ('type' in error && 'message' in error) {
      return { error: error as ApiError };
    }

    // Other errors
    return {
      error: createApiError(
        API_ERROR_TYPE.UNKNOWN,
        error.message || 'An unknown error occurred',
        undefined,
        error
      )
    };
  }
} 