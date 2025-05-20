/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { DateRangePicker } from '@/features/fuel-supplies/components/DateRangePicker';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'DateRangePicker',
    oldPath: '@/components/fuel-supplies/DateRangePicker',
    newPath: '@/features/fuel-supplies/components/DateRangePicker',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default DateRangePicker;
