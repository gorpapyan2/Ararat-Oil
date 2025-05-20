/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { sheet } from '@/core/components/ui/sheet';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'sheet',
    oldPath: '@/components/ui/sheet',
    newPath: '@/core/components/ui/sheet',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default sheet;
