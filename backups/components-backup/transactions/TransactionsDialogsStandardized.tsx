/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { TransactionsDialogsStandardized } from '@/features/finance/components/TransactionsDialogsStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TransactionsDialogsStandardized',
    oldPath: '@/components/transactions/TransactionsDialogsStandardized',
    newPath: '@/features/finance/components/TransactionsDialogsStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default TransactionsDialogsStandardized;
