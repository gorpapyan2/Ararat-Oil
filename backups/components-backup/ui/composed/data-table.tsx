/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { data-table } from '@/core/components/ui/data-table';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'data-table',
    oldPath: '@/components/ui/data-table',
    newPath: '@/core/components/ui/data-table',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default data-table;
