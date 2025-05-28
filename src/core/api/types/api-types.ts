/**
 * Type definitions for API-related functionality
 * This file centralizes API type definitions to improve type safety across the application
 */

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  /** Response data */
  data: T;
  /** Status code */
  status: number;
  /** Response message */
  message?: string;
  /** Error information if request failed */
  error?: ApiError;
}

/**
 * API error structure
 */
export interface ApiError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Optional status code */
  status?: number;
  /** Additional error details */
  details?: Record<string, unknown>;
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Total count of items (response only) */
  total?: number;
}

/**
 * Sorting parameters for API requests
 */
export interface SortingParams {
  /** Field to sort by */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: "asc" | "desc";
}

/**
 * Filtering parameters for API requests
 */
export interface FilterParams {
  /** Filter field(s) */
  [key: string]: string | number | boolean | null | undefined | string[];
}

/**
 * Base query parameters for API requests
 */
export interface BaseQueryParams extends PaginationParams, SortingParams {
  /** Search term */
  search?: string;
  /** Include related entities */
  include?: string[];
  /** Fields to select */
  fields?: string[];
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  /** Array of items */
  items: T[];
  /** Pagination metadata */
  pagination: {
    /** Current page */
    page: number;
    /** Items per page */
    limit: number;
    /** Total number of items */
    total: number;
    /** Total number of pages */
    totalPages: number;
    /** Are there more pages */
    hasMore: boolean;
  };
}

/**
 * Create entity request
 */
export type CreateRequest<T> = Omit<T, "id" | "created_at" | "updated_at">;

/**
 * Update entity request
 */
export type UpdateRequest<T> = Partial<
  Omit<T, "id" | "created_at" | "updated_at">
>;

/**
 * Utility type for API functions returning a single entity
 */
export type ApiSingleResponse<T> = Promise<ApiResponse<T>>;

/**
 * Utility type for API functions returning a collection of entities
 */
export type ApiCollectionResponse<T> = Promise<ApiResponse<T[]>>;

/**
 * Utility type for API functions returning a paginated collection
 */
export type ApiPaginatedResponse<T> = Promise<
  ApiResponse<PaginatedResponse<T>>
>;

/**
 * Date range filter
 */
export interface DateRangeFilter {
  /** Start date */
  startDate?: string;
  /** End date */
  endDate?: string;
}

/**
 * Common status values
 */
export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

/**
 * API endpoint configuration
 */
export interface ApiEndpointConfig {
  /** Base URL */
  baseUrl: string;
  /** Endpoint path */
  path: string;
  /** Default headers */
  headers?: Record<string, string>;
  /** Default query parameters */
  defaultParams?: Record<string, unknown>;
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * Database entity with common fields
 */
export interface BaseEntity {
  /** Unique identifier */
  id: string;
  /** Creation timestamp */
  created_at: string;
  /** Last update timestamp */
  updated_at: string;
}

/**
 * Generic metadata type for responses
 */
export interface ResponseMetadata {
  /** Request ID for tracking */
  requestId?: string;
  /** Timestamp of the response */
  timestamp?: number;
  /** Additional metadata */
  [key: string]: unknown;
}
