/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { loading-button } from '@/core/components/ui/loading-button';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'loading-button',
    oldPath: '@/components/ui/loading-button',
    newPath: '@/core/components/ui/loading-button',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default loading-button;
