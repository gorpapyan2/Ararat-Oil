/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { CategoryManagerStandardized } from '@/features/finance/components/CategoryManagerStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'CategoryManagerStandardized',
    oldPath: '@/components/expenses/CategoryManagerStandardized',
    newPath: '@/features/finance/components/CategoryManagerStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default CategoryManagerStandardized;
