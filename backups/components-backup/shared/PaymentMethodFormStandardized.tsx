/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { PaymentMethodFormStandardized } from '@/shared/components/shared/PaymentMethodFormStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'PaymentMethodFormStandardized',
    oldPath: '@/components/shared/PaymentMethodFormStandardized',
    newPath: '@/shared/components/shared/PaymentMethodFormStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default PaymentMethodFormStandardized;
