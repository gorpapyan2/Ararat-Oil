/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { language-switcher } from '@/core/components/ui/language-switcher';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'language-switcher',
    oldPath: '@/components/ui/language-switcher',
    newPath: '@/core/components/ui/language-switcher',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default language-switcher;
