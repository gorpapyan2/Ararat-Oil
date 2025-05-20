/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { DateRangeFilter } from '@/features/fuel-supplies/components/DateRangeFilter';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'DateRangeFilter',
    oldPath: '@/components/fuel-supplies/DateRangeFilter',
    newPath: '@/features/fuel-supplies/components/DateRangeFilter',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default DateRangeFilter;
