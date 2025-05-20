/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { carousel } from '@/core/components/ui/carousel';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'carousel',
    oldPath: '@/components/ui/carousel',
    newPath: '@/core/components/ui/carousel',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default carousel;
