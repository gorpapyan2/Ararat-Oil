/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { EmployeeHeader } from '@/features/employees/components/EmployeeHeader';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'EmployeeHeader',
    oldPath: '@/components/employees/EmployeeHeader',
    newPath: '@/features/employees/components/EmployeeHeader',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default EmployeeHeader;
