/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { create-button } from '@/core/components/ui/create-button';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'create-button',
    oldPath: '@/components/ui/create-button',
    newPath: '@/core/components/ui/create-button',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default create-button;
