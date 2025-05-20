/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { InvoiceFormStandardized } from '@/shared/components/shared/InvoiceFormStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'InvoiceFormStandardized',
    oldPath: '@/components/shared/InvoiceFormStandardized',
    newPath: '@/shared/components/shared/InvoiceFormStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default InvoiceFormStandardized;
