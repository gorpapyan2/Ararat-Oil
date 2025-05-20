/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { EmployeeList } from '@/features/employees/components/EmployeeList';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'EmployeeList',
    oldPath: '@/components/employees/EmployeeList',
    newPath: '@/features/employees/components/EmployeeList',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default EmployeeList;
