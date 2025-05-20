/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { TransactionsHeader } from '@/features/finance/components/TransactionsHeader';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TransactionsHeader',
    oldPath: '@/components/transactions/TransactionsHeader',
    newPath: '@/features/finance/components/TransactionsHeader',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default TransactionsHeader;
