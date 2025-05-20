/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { EmployeeDialogStandardized } from '@/features/employees/components/EmployeeDialogStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'EmployeeDialogStandardized',
    oldPath: '@/components/employees/EmployeeDialogStandardized',
    newPath: '@/features/employees/components/EmployeeDialogStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default EmployeeDialogStandardized;
