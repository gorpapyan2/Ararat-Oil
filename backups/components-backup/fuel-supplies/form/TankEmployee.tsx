/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { TankEmployee } from '@/features/fuel-supplies/components/TankEmployee';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TankEmployee',
    oldPath: '@/components/fuel-supplies/TankEmployee',
    newPath: '@/features/fuel-supplies/components/TankEmployee',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default TankEmployee;
