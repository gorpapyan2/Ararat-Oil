/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { calendar } from '@/core/components/ui/calendar';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'calendar',
    oldPath: '@/components/ui/calendar',
    newPath: '@/core/components/ui/calendar',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default calendar;
