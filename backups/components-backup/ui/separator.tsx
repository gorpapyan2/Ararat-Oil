/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { separator } from '@/core/components/ui/separator';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'separator',
    oldPath: '@/components/ui/separator',
    newPath: '@/core/components/ui/separator',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default separator;
