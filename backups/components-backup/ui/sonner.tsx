/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { sonner } from '@/core/components/ui/sonner';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'sonner',
    oldPath: '@/components/ui/sonner',
    newPath: '@/core/components/ui/sonner',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default sonner;
