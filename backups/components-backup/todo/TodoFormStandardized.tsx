/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { TodoFormStandardized } from '@/features/todo/components/TodoFormStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TodoFormStandardized',
    oldPath: '@/components/todo/TodoFormStandardized',
    newPath: '@/features/todo/components/TodoFormStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default TodoFormStandardized;
