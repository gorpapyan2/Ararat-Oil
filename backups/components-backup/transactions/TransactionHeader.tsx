/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { TransactionHeader } from '@/features/finance/components/TransactionHeader';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TransactionHeader',
    oldPath: '@/components/transactions/TransactionHeader',
    newPath: '@/features/finance/components/TransactionHeader',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default TransactionHeader;
