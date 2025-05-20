/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { RangeSliderFilter } from '@/features/fuel-supplies/components/RangeSliderFilter';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'RangeSliderFilter',
    oldPath: '@/components/fuel-supplies/RangeSliderFilter',
    newPath: '@/features/fuel-supplies/components/RangeSliderFilter',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default RangeSliderFilter;
