/// <reference types="vite/client" />

/**
 * Type definitions for Vite environment variables
 * These enhance type safety when accessing import.meta.env values
 */
interface ImportMetaEnv {
  // Server Configuration
  readonly VITE_PORT?: string;
  
  // API URLs
  readonly VITE_API_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_PROJECT_ID: string;
  readonly VITE_SUPABASE_FALLBACK_IP?: string;
  
  // Application Configuration
  readonly VITE_APP_TITLE: string;
  
  // Feature Flags
  readonly VITE_ENABLE_DEV_TOOLS: string;
  readonly VITE_ENABLE_MOCK_DATA: string;
  
  // Build Information
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

/**
 * Extend the import.meta interface
 * This ensures TypeScript understands the env property
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Type-safe accessor functions for environment variables
 * These provide default values and handle type conversion
 */
export const getEnv = {
  /**
   * Get string environment variable
   * @param key - The environment variable key
   * @param defaultValue - Default value if not set
   */
  string: (key: keyof ImportMetaEnv, defaultValue = ''): string => {
    return import.meta.env[key] || defaultValue;
  },
  
  /**
   * Get boolean environment variable
   * @param key - The environment variable key
   * @param defaultValue - Default value if not set
   */
  boolean: (key: keyof ImportMetaEnv, defaultValue = false): boolean => {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
  },
  
  /**
   * Get number environment variable
   * @param key - The environment variable key
   * @param defaultValue - Default value if not set
   */
  number: (key: keyof ImportMetaEnv, defaultValue = 0): number => {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
};

/**
 * Usage example:
 * 
 * // Import the helper
 * import { getEnv } from '@/types/env';
 * 
 * // Access environment variables with proper typing
 * const apiUrl = getEnv.string('VITE_API_URL');
 * const isDevToolsEnabled = getEnv.boolean('VITE_ENABLE_DEV_TOOLS');
 * const port = getEnv.number('VITE_PORT', 3000);
 */ 