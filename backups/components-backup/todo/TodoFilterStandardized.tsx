/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { TodoFilterStandardized } from '@/features/todo/components/TodoFilterStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TodoFilterStandardized',
    oldPath: '@/components/todo/TodoFilterStandardized',
    newPath: '@/features/todo/components/TodoFilterStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default TodoFilterStandardized;
