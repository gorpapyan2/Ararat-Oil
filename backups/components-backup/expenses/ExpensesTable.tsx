/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ExpensesTable } from '@/features/finance/components/ExpensesTable';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ExpensesTable',
    oldPath: '@/components/expenses/ExpensesTable',
    newPath: '@/features/finance/components/ExpensesTable',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ExpensesTable;
