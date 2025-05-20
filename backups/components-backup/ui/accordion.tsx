/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { accordion } from '@/core/components/ui/accordion';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'accordion',
    oldPath: '@/components/ui/accordion',
    newPath: '@/core/components/ui/accordion',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default accordion;
