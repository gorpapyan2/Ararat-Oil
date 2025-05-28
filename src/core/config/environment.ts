/**
 * Environment Configuration
 *
 * Contains all environment-specific configuration settings and utilities.
 */

/**
 * Environment types supported by the application
 */
export type Environment = "development" | "test" | "production";

/**
 * Get the current environment
 * @returns The current environment based on import.meta.env.MODE
 */
export const getEnvironment = (): Environment => {
  const mode = import.meta.env.MODE;

  switch (mode) {
    case "development":
    case "test":
    case "production":
      return mode;
    default:
      console.warn(
        `Unknown environment mode: ${mode}, falling back to 'development'`
      );
      return "development";
  }
};

/**
 * Check if the application is running in development mode
 */
export const isDevelopment = (): boolean => getEnvironment() === "development";

/**
 * Check if the application is running in test mode
 */
export const isTest = (): boolean => getEnvironment() === "test";

/**
 * Check if the application is running in production mode
 */
export const isProduction = (): boolean => getEnvironment() === "production";

/**
 * Application base URL from environment variables
 */
export const APP_BASE_URL = import.meta.env.BASE_URL || "/";
