/**
 * API Configuration
 *
 * This file contains the configuration for API endpoints, base URLs,
 * timeouts, and other API-related settings.
 */

/**
 * Base API configuration
 */
export const API_CONFIG = {
  // Base URLs
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "https://vfywgrsymuvojbbfodri.supabase.co",
  FUNCTIONS_URL:
    import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ||
    "https://vfywgrsymuvojbbfodri.supabase.co/functions/v1",

  // Authentication
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  PROJECT_ID:
    import.meta.env.VITE_SUPABASE_PROJECT_ID || "vfywgrsymuvojbbfodri",

  // Timeouts (in milliseconds)
  TIMEOUT: 30000, // 30 seconds
  CONNECT_TIMEOUT: 10000, // 10 seconds

  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second

  // Cache configuration
  CACHE_TTL: 300000, // 5 minutes

  // Headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },

  // Batch limits
  MAX_BATCH_SIZE: 100,
};

/**
 * API endpoints for various entities
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGN_IN: "/auth/v1/token",
    SIGN_UP: "/auth/v1/signup",
    USER: "/auth/v1/user",
    REFRESH: "/auth/v1/token?grant_type=refresh_token",
  },

  // Edge Function endpoints
  FUNCTIONS: {
    FUEL_SUPPLIES: "fuel-supplies",
    SHIFTS: "shifts",
    PETROL_PROVIDERS: "petrol-providers",
    FUEL_TYPES: "fuel-types",
    TANKS: "tanks",
    FILLING_SYSTEMS: "filling-systems",
    TRANSACTIONS: "transactions",
    SALES: "sales",
    EXPENSES: "expenses",
    REPORTS: "reports",
    PROFIT_LOSS: "profit-loss",
    DASHBOARD: "dashboard",
    FUEL_PRICES: "fuel-prices",
    FINANCIALS: "financials",
    EMPLOYEES: "employees",
  },

  // Direct Supabase table endpoints (for reference)
  TABLES: {
    FUEL_SUPPLIES: "fuel_supplies",
    SHIFTS: "shifts",
    PETROL_PROVIDERS: "petrol_providers",
    FUEL_TYPES: "fuel_types",
    TANKS: "tanks",
    FILLING_SYSTEMS: "filling_systems",
    TRANSACTIONS: "transactions",
    SALES: "sales",
    EXPENSES: "expenses",
    EMPLOYEES: "employees",
  },
};

/**
 * Status polling configuration
 */
export const POLLING_CONFIG = {
  // How often to poll for updates (in milliseconds)
  INTERVAL: 30000, // 30 seconds

  // Maximum polling duration (in milliseconds)
  MAX_DURATION: 300000, // 5 minutes

  // Endpoints that support polling
  SUPPORTS_POLLING: [
    API_ENDPOINTS.FUNCTIONS.TANKS,
    API_ENDPOINTS.FUNCTIONS.SHIFTS,
    API_ENDPOINTS.FUNCTIONS.SALES,
  ],
};

/**
 * Request error types
 */
export enum API_ERROR_TYPE {
  NETWORK = "network",
  TIMEOUT = "timeout",
  SERVER = "server",
  AUTH = "auth",
  VALIDATION = "validation",
  NOT_FOUND = "not_found",
  CONFLICT = "conflict",
  UNKNOWN = "unknown",
}

/**
 * Maps HTTP status codes to error types
 */
export const ERROR_STATUS_MAP: Record<number, API_ERROR_TYPE> = {
  400: API_ERROR_TYPE.VALIDATION,
  401: API_ERROR_TYPE.AUTH,
  403: API_ERROR_TYPE.AUTH,
  404: API_ERROR_TYPE.NOT_FOUND,
  409: API_ERROR_TYPE.CONFLICT,
  500: API_ERROR_TYPE.SERVER,
  502: API_ERROR_TYPE.SERVER,
  503: API_ERROR_TYPE.SERVER,
  504: API_ERROR_TYPE.TIMEOUT,
};

/**
 * Function to get the appropriate error type from an HTTP status code
 */
export const getErrorTypeFromStatus = (status: number): API_ERROR_TYPE => {
  return ERROR_STATUS_MAP[status] || API_ERROR_TYPE.UNKNOWN;
};
