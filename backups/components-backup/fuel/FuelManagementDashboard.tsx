/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { FuelManagementDashboard } from '@/features/fuel/components/FuelManagementDashboard';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'FuelManagementDashboard',
    oldPath: '@/components/fuel/FuelManagementDashboard',
    newPath: '@/features/fuel/components/FuelManagementDashboard',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default FuelManagementDashboard;
