/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ThemeSwitcher } from '@/core/components/ui/ThemeSwitcher';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ThemeSwitcher',
    oldPath: '@/components/ui/ThemeSwitcher',
    newPath: '@/core/components/ui/ThemeSwitcher',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ThemeSwitcher;
