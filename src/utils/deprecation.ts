/**
 * Utilities for tracking and displaying deprecation warnings
 * Used for monitoring component migration process
 */

export interface DeprecationInfo {
  component: string;
  oldPath: string;
  newPath: string;
  removalDate: string;
}

// In-memory store for local development tracking
const usageTracker: Record<string, number> = {};

/**
 * Logs deprecation warning and tracks component usage
 * @param info Deprecation information for the component
 */
export function logDeprecatedUsage(info: DeprecationInfo): void {
  const { component, oldPath, newPath, removalDate } = info;

  // Track usage count
  if (!usageTracker[component]) {
    usageTracker[component] = 0;
  }
  usageTracker[component]++;

  // Log warning in development only
  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[DEPRECATED] The component "${component}" imported from "${oldPath}" ` +
        `is deprecated and will be removed after ${removalDate}. ` +
        `Please update your import to "${newPath}".`
    );
  }

  // In development, send anonymous usage data for monitoring
  if (process.env.NODE_ENV === "development") {
    sendAnonymousUsageData({
      type: "deprecated-component",
      component,
      oldPath,
      count: usageTracker[component],
    });
  }
}

/**
 * Returns current deprecation usage statistics
 * Used by development tools to display usage data
 */
export function getDeprecationStats(): Record<string, number> {
  return { ...usageTracker };
}

/**
 * Sends anonymous usage data to tracking endpoint
 * Only active in development environments
 * @param data Usage data to send
 */
function sendAnonymousUsageData(data: Record<string, unknown>): void {
  // Only attempt to send data if we're in a browser environment
  if (typeof window !== "undefined") {
    try {
      // Use a simple fetch request to send data to local endpoint
      // This would be replaced with actual analytics in production
      if (process.env.NODE_ENV === "development") {
        // For development, just log to console
        console.debug("[Deprecation Tracker]", data);

        // In a real implementation, you might use:
        // fetch('/api/deprecation-tracking', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });
      }
    } catch (error) {
      // Silently fail - tracking should never break the application
      console.debug("Failed to send deprecation tracking", error);
    }
  }
}

/**
 * Creates a bridge component for backward compatibility
 * This helper function documents the pattern used for bridge components
 *
 * @example
 * // In src/components/old/MyComponent.tsx
 * import { MyComponent } from '@/features/new/components/MyComponent';
 * import { createBridgeComponent } from '@/utils/deprecation';
 *
 * export default createBridgeComponent({
 *   component: MyComponent,
 *   info: {
 *     component: 'MyComponent',
 *     oldPath: '@/components/old/MyComponent',
 *     newPath: '@/features/new/components/MyComponent',
 *     removalDate: '2023-12-31'
 *   }
 * });
 */
export function createBridgeComponent<T extends React.ComponentType<Record<string, unknown>>>({
  component,
  info,
}: {
  component: T;
  info: DeprecationInfo;
}): T {
  // Log deprecation on import
  logDeprecatedUsage(info);

  // Return the original component
  return component;
}
