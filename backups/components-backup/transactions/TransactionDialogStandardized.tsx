/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { TransactionDialogStandardized } from '@/features/finance/components/TransactionDialogStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TransactionDialogStandardized',
    oldPath: '@/components/transactions/TransactionDialogStandardized',
    newPath: '@/features/finance/components/TransactionDialogStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default TransactionDialogStandardized;
