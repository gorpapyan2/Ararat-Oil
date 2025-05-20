/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { cards } from '@/core/components/ui/cards';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'cards',
    oldPath: '@/components/ui/cards',
    newPath: '@/core/components/ui/cards',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default cards;
