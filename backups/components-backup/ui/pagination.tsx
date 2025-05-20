/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { pagination } from '@/core/components/ui/pagination';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'pagination',
    oldPath: '@/components/ui/pagination',
    newPath: '@/core/components/ui/pagination',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default pagination;
