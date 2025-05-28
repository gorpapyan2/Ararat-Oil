/**
 * Feature Flags Configuration
 *
 * This file contains the feature flags system for enabling/disabling features
 * based on environment, user role, or other conditions.
 */

import { getEnvironment, isProduction } from "./environment";

/**
 * Feature flag definitions
 */
export interface FeatureFlags {
  [key: string]: boolean;
}

/**
 * Default feature flags
 * All features are enabled by default in development and disabled in production
 * unless explicitly overridden
 */
const defaultFlags: FeatureFlags = {
  // Core features
  NEW_NAVIGATION: true, // Use the new navigation system
  ENHANCED_TABLES: true, // Use enhanced tables with filtering/sorting
  DARK_MODE: true, // Enable dark mode option

  // Data synchronization features
  OFFLINE_MODE: !isProduction(), // Enable offline mode and sync
  BACKGROUND_SYNC: !isProduction(), // Enable background data synchronization

  // Preview features (generally disabled in production)
  NEW_DASHBOARD: !isProduction(), // New dashboard layout
  CHARTS_V2: !isProduction(), // Enhanced chart components
  ADVANCED_SEARCH: !isProduction(), // Advanced search capabilities

  // Experimental features (always disabled in production)
  EXPERIMENTAL_UI: false, // Experimental UI components
  DEBUG_TOOLS: !isProduction(), // Debug tools and panels
};

/**
 * Feature flags that can be overridden from the environment variables
 */
const loadEnvironmentFlags = (): FeatureFlags => {
  const envFlags: FeatureFlags = {};

  // Process environment variables with the format VITE_FEATURE_*
  Object.keys(import.meta.env).forEach((key) => {
    if (key.startsWith("VITE_FEATURE_")) {
      const featureName = key.replace("VITE_FEATURE_", "").toLowerCase();
      const featureValue = import.meta.env[key];
      envFlags[featureName] = featureValue === "true";
    }
  });

  return envFlags;
};

/**
 * Combine default flags with flags from environment variables
 */
export const getFeatureFlags = (): FeatureFlags => {
  const environmentFlags = loadEnvironmentFlags();

  // Merge default flags with environment flags (environment takes precedence)
  return {
    ...defaultFlags,
    ...environmentFlags,
  };
};

/**
 * Check if a feature is enabled
 * @param featureName The name of the feature to check
 * @returns Boolean indicating if the feature is enabled
 */
export const isFeatureEnabled = (featureName: string): boolean => {
  const flags = getFeatureFlags();

  // If the feature flag doesn't exist, return false
  if (!(featureName in flags)) {
    console.warn(`Feature flag "${featureName}" does not exist`);
    return false;
  }

  return flags[featureName];
};
