/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { PaymentDetailsDialogStandardized } from '@/features/finance/components/PaymentDetailsDialogStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'PaymentDetailsDialogStandardized',
    oldPath: '@/components/shifts/PaymentDetailsDialogStandardized',
    newPath: '@/features/finance/components/PaymentDetailsDialogStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default PaymentDetailsDialogStandardized;
