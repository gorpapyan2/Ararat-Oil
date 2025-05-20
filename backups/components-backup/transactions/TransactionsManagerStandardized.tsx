/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { TransactionsManagerStandardized } from '@/features/finance/components/TransactionsManagerStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TransactionsManagerStandardized',
    oldPath: '@/components/transactions/TransactionsManagerStandardized',
    newPath: '@/features/finance/components/TransactionsManagerStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default TransactionsManagerStandardized;
