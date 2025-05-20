/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ButtonShowcase } from '@/core/components/ui/ButtonShowcase';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ButtonShowcase',
    oldPath: '@/components/ui/ButtonShowcase',
    newPath: '@/core/components/ui/ButtonShowcase',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ButtonShowcase;
