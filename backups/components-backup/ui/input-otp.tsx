/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { input-otp } from '@/core/components/ui/input-otp';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'input-otp',
    oldPath: '@/components/ui/input-otp',
    newPath: '@/core/components/ui/input-otp',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default input-otp;
