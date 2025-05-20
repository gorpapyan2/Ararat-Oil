/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { aspect-ratio } from '@/core/components/ui/aspect-ratio';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'aspect-ratio',
    oldPath: '@/components/ui/aspect-ratio',
    newPath: '@/core/components/ui/aspect-ratio',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default aspect-ratio;
