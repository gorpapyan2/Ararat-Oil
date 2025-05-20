/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ExpensesManagerStandardized } from '@/features/finance/components/ExpensesManagerStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ExpensesManagerStandardized',
    oldPath: '@/components/expenses/ExpensesManagerStandardized',
    newPath: '@/features/finance/components/ExpensesManagerStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ExpensesManagerStandardized;
