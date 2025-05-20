/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { color-contrast-checker } from '@/core/components/ui/color-contrast-checker';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'color-contrast-checker',
    oldPath: '@/components/ui/color-contrast-checker',
    newPath: '@/core/components/ui/color-contrast-checker',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default color-contrast-checker;
