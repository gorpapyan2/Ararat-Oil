/**
 * Core API Client
 *
 * This file provides the core API client functionality for making requests
 * to various backend services. It handles authentication, error handling,
 * retry logic, and request/response formatting.
 */

import { supabase } from "./supabase";
import {
  API_CONFIG,
  API_ERROR_TYPE,
  getErrorTypeFromStatus,
} from "@/core/config/api";
import { isDevelopment } from "@/core/config/environment";
import { createHash } from 'crypto';

// Helper to handle errors with proper typing and logging
export interface ApiError {
  type: API_ERROR_TYPE;
  status?: number;
  message: string;
  originalError?: unknown;
}

/**
 * Creates a formatted API error
 */
export function createApiError(
  type: API_ERROR_TYPE,
  message: string,
  status?: number,
  originalError?: unknown
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
export function isNetworkError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  
  const errorObj = error as Record<string, unknown>;
  const message = String(errorObj.message || '');
  const name = String(errorObj.name || '');
  
  return (
    message.includes("Failed to fetch") ||
    message.includes("Network Error") ||
    message.includes("NetworkError") ||
    (name === "TypeError" && message.includes("fetch"))
  );
}

/**
 * Generic response type for API calls
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  status?: number;
  statusText?: string;
  headers?: Headers;
  metadata?: {
    requestId?: string;
    timestamp?: number;
    [key: string]: unknown;
  };
}

/**
 * API request options
 */
export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean | null | undefined>;
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
  responseType?: "json" | "text" | "blob" | "arraybuffer";
}

// Type guard to check if a value is an ApiResponse
export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    (Object.prototype.hasOwnProperty.call(value, "data") || 
     Object.prototype.hasOwnProperty.call(value, "error"))
  );
}

// Type definitions for different response types
export type ApiResult<
  T,
  R extends ApiRequestOptions["responseType"],
> = R extends "text"
  ? string
  : R extends "blob"
    ? Blob
    : R extends "arraybuffer"
      ? ArrayBuffer
      : ApiResponse<T>;

// Change from RequestCache to ApiRequestCache
interface ApiRequestCache {
  [key: string]: {
    promise: Promise<any>;
    timestamp: number;
    expiresAt: number;
  };
}

// Update the constant to use the new type
const ACTIVE_REQUESTS: ApiRequestCache = {};
const REQUEST_CACHE_DURATION = 5000; // 5 seconds

/**
 * Makes a request to a Supabase Edge Function with proper typing based on responseType
 */
export async function fetchFromFunction<
  T = unknown,
  R extends ApiRequestOptions["responseType"] = "json",
>(
  functionPath: string,
  options: ApiRequestOptions & { responseType?: R } = {}
): Promise<ApiResult<T, R>> {
  // Generate a cache key based on the request details
  const cacheKey = generateCacheKey(functionPath, options);
  
  // Check if there's an ongoing request with this exact signature
  const now = Date.now();
  const cachedRequest = ACTIVE_REQUESTS[cacheKey];
  
  // If we have an ongoing request that isn't expired, reuse it
  if (cachedRequest && now < cachedRequest.expiresAt) {
    if (isDevelopment()) {
      console.log(`Reusing in-flight request for: ${functionPath}`);
    }
    return cachedRequest.promise;
  }
  
  // Create the actual request function
  const requestPromise = (async () => {
    try {
      // Attempt to get a fresh session token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      let currentSession = sessionData?.session;
      
      if (sessionError) {
        console.warn('Session retrieval error:', sessionError);
        // Try to refresh the token if there's a session error
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('Failed to refresh auth token:', refreshError);
          return {
            error: createApiError(
              API_ERROR_TYPE.AUTH,
              'Authentication failed: ' + refreshError.message
            ),
          } as ApiResult<T, R>;
        }
        
        // Use the refreshed session
        currentSession = refreshData.session;
      }
      
      // Use the user access token if available, otherwise fall back to the public anon key
      const token = currentSession?.access_token || API_CONFIG.SUPABASE_ANON_KEY;

      // Set up headers
      const headers: HeadersInit = {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...options.headers,
      };

      // Add auth token if available
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Add query parameters if provided
      let url = `${API_CONFIG.FUNCTIONS_URL}/${functionPath}`;
      if (options.queryParams) {
        const queryString = Object.entries(options.queryParams)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
          )
          .join("&");

        if (queryString) {
          url += `?${queryString}`;
        }
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method: options.method || "GET",
        headers,
        cache: options.cache,
        // Use 'same-origin' for better CORS handling
        credentials: 'same-origin',
        signal: options.timeout
          ? AbortSignal.timeout(options.timeout)
          : undefined,
        // Add body for non-GET requests if provided
        ...(options.method !== "GET" && options.body
          ? { body: JSON.stringify(options.body) }
          : {}),
      };

      // Only log in development mode and if not fetching too frequently
      if (isDevelopment()) {
        console.log(`API Request: ${requestOptions.method} ${url}`);
      }
      
      // Make the fetch request
      const response = await fetch(url, requestOptions).catch(error => {
        // Handle CORS errors specifically
        if (error.message && (
          error.message.includes('CORS') || 
          error.message.includes('Cross-Origin') ||
          error.message.includes('Failed to fetch')
        )) {
          console.error('CORS error detected:', error);
          // For development, we could use a CORS proxy here
          if (isDevelopment()) {
            console.warn('CORS error in development. Consider using a CORS proxy or adding fallback data.');
          }
        }
        throw error;
      });

      // Log response status only in critical cases
      if (isDevelopment() && response.status !== 200) {
        console.log(`API Response: ${functionPath} [${response.status}]`);
      }
      
      // Handle different response types
      let result;
      try {
        if (options.responseType === "text") {
          result = await response.text();
        } else if (options.responseType === "blob") {
          result = await response.blob();
        } else if (options.responseType === "arraybuffer") {
          result = await response.arrayBuffer();
        } else {
          // Default to JSON
          result = await response.json();
          
          // Only log detailed results in development and only when explicitly debugging
          if (isDevelopment() && import.meta.env.VITE_DEBUG_API === 'true') {
            console.log(`Result from ${functionPath}:`, result);
          }
        }
      } catch (error) {
        // Only log parsing errors, not normal responses
        console.error(`Error parsing response from ${functionPath}:`, error);
        return {
          error: createApiError(
            API_ERROR_TYPE.SERVER,
            `Failed to parse response: ${error.message}`,
            response.status
          ),
          status: response.status,
        } as ApiResult<T, R>;
      }

      // For non-JSON responses, return the raw result if response is OK
      if (
        options.responseType &&
        options.responseType !== "json" &&
        response.ok
      ) {
        return result as ApiResult<T, R>;
      }

      // Check for error response
      if (!response.ok) {
        const errorType = getErrorTypeFromStatus(response.status);
        
        // For Supabase Edge Functions, also check the response body for error information
        let errorMessage = '';
        if (result && typeof result === 'object' && 'error' in result) {
          errorMessage = result.error;
        } else {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        
        // Create a proper API error
        const apiError = createApiError(
          errorType, 
          errorMessage,
          response.status
        );
        
        return {
          error: apiError,
          status: response.status,
        } as ApiResult<T, R>;
      }

      // Get request ID safely
      const requestId = response.headers.get("x-request-id");

      // Return formatted API response
      const apiResponse: ApiResponse<T> = {
        data: result.data || result,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        metadata: {
          requestId: requestId || undefined,
          timestamp: Date.now(),
        },
      };

      return apiResponse as ApiResult<T, R>;
    } catch (error: unknown) {
      // For non-JSON responses, we need to return an error wrapped in the appropriate type
      if (options.responseType && options.responseType !== "json") {
        throw error; // Re-throw the error for non-JSON responses to be caught by the caller
      }

      // Standard error handling for JSON responses
      // Handle network errors
      if (isNetworkError(error)) {
        return {
          error: createApiError(
            API_ERROR_TYPE.NETWORK,
            "Network connection error",
            undefined,
            error
          ),
        } as ApiResult<T, R>;
      }

      // Handle timeout errors
      if (error && typeof error === 'object' && 'name' in error && 
          (error.name === "TimeoutError" || error.name === "AbortError")) {
        return {
          error: createApiError(
            API_ERROR_TYPE.TIMEOUT,
            "Request timed out",
            undefined,
            error
          ),
        } as ApiResult<T, R>;
      }

      // Already formatted API errors
      if (error && typeof error === 'object' && "type" in error && "message" in error) {
        return { error: error as ApiError } as ApiResult<T, R>;
      }

      // Other errors
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? String(error.message) 
        : "An unknown error occurred";
      
      // Always clean up the cache entry on error
      delete ACTIVE_REQUESTS[cacheKey];
      
      return {
        error: createApiError(
          API_ERROR_TYPE.UNKNOWN,
          errorMessage,
          undefined,
          error
        ),
      } as ApiResult<T, R>;
    }
  })();
  
  // Store the request in the cache
  ACTIVE_REQUESTS[cacheKey] = {
    promise: requestPromise,
    timestamp: now,
    expiresAt: now + REQUEST_CACHE_DURATION
  };
  
  // Set up automatic cache cleanup after the request completes
  requestPromise.then(() => {
    // Clean up after a short delay to allow for quick sequential accesses
    setTimeout(() => {
      delete ACTIVE_REQUESTS[cacheKey];
    }, 100);
  }).catch(() => {
    // Clean up immediately on error
    delete ACTIVE_REQUESTS[cacheKey];
  });
  
  return requestPromise;
}

/**
 * Generates a cache key for deduplicating requests
 */
function generateCacheKey(path: string, options: ApiRequestOptions): string {
  const method = options.method || 'GET';
  const queryParams = options.queryParams ? JSON.stringify(options.queryParams) : '';
  const body = options.body ? JSON.stringify(options.body) : '';
  
  // Simplified key for most use cases
  return `${method}:${path}:${queryParams}:${body}`;
}

/**
 * Helper function to make JSON API requests (most common case)
 */
export async function fetchJson<T = unknown>(
  functionPath: string,
  options: Omit<ApiRequestOptions, "responseType"> = {}
): Promise<ApiResponse<T>> {
  return fetchFromFunction<T, "json">(functionPath, {
    ...options,
    responseType: "json",
  });
}

/**
 * Helper function to make text API requests
 */
export async function fetchText(
  functionPath: string,
  options: Omit<ApiRequestOptions, "responseType"> = {}
): Promise<string> {
  try {
    return await fetchFromFunction<string, "text">(functionPath, {
      ...options,
      responseType: "text",
    });
  } catch (error) {
    console.error("Error fetching text:", error);
    throw error;
  }
}

/**
 * Helper function to make blob API requests
 */
export async function fetchBlob(
  functionPath: string,
  options: Omit<ApiRequestOptions, "responseType"> = {}
): Promise<Blob> {
  try {
    return await fetchFromFunction<Blob, "blob">(functionPath, {
      ...options,
      responseType: "blob",
    });
  } catch (error) {
    console.error("Error fetching blob:", error);
    throw error;
  }
}
