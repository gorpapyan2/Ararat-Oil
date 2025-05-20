/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { FilterBar } from '@/features/fuel-supplies/components/FilterBar';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'FilterBar',
    oldPath: '@/components/fuel-supplies/FilterBar',
    newPath: '@/features/fuel-supplies/components/FilterBar',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default FilterBar;
