/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { command } from '@/core/components/ui/command';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'command',
    oldPath: '@/components/ui/command',
    newPath: '@/core/components/ui/command',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default command;
