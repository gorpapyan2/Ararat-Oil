/**
 * Application Constants
 *
 * This file contains application-wide constants that are used throughout the codebase.
 * These values should not change at runtime.
 */

/**
 * Default pagination configuration
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  DEFAULT_PAGE: 1,
};

/**
 * Application-wide timeouts (in milliseconds)
 */
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  DEBOUNCE: 300, // 300ms
  TOAST_DEFAULT: 5000, // 5 seconds
  SESSION_EXPIRY: 3600000, // 1 hour
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_PREFERENCES: "user_preferences",
  THEME: "app_theme",
  LANGUAGE: "app_language",
};

/**
 * Date formats
 */
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  API: "yyyy-MM-dd",
  DATETIME_DISPLAY: "MMM dd, yyyy HH:mm",
  DATETIME_API: 'yyyy-MM-dd"T"HH:mm:ss.SSS"Z"',
};

/**
 * Application routes
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  PROFILE: "/profile",
};

/**
 * Regular expressions
 */
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // Min 8 chars, at least 1 letter and 1 number
  PHONE: /^\+?[0-9]{10,15}$/,
};

/**
 * API response status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
