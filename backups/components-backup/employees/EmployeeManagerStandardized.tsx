/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { EmployeeManagerStandardized } from '@/features/employees/components/EmployeeManagerStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'EmployeeManagerStandardized',
    oldPath: '@/components/employees/EmployeeManagerStandardized',
    newPath: '@/features/employees/components/EmployeeManagerStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default EmployeeManagerStandardized;
