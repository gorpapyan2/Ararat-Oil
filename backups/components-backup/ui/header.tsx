/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { header } from '@/core/components/ui/header';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'header',
    oldPath: '@/components/ui/header',
    newPath: '@/core/components/ui/header',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default header;
