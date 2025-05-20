/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { slider } from '@/core/components/ui/slider';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'slider',
    oldPath: '@/components/ui/slider',
    newPath: '@/core/components/ui/slider',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default slider;
