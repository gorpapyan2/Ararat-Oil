/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { currency-input } from '@/core/components/ui/currency-input';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'currency-input',
    oldPath: '@/components/ui/currency-input',
    newPath: '@/core/components/ui/currency-input',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default currency-input;
