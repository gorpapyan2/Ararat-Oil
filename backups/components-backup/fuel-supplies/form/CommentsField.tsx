/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { CommentsField } from '@/features/fuel-supplies/components/CommentsField';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'CommentsField',
    oldPath: '@/components/fuel-supplies/CommentsField',
    newPath: '@/features/fuel-supplies/components/CommentsField',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default CommentsField;
