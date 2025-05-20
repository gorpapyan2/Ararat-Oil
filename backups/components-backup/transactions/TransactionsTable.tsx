/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { TransactionsTable } from '@/features/finance/components/TransactionsTable';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TransactionsTable',
    oldPath: '@/components/transactions/TransactionsTable',
    newPath: '@/features/finance/components/TransactionsTable',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default TransactionsTable;
