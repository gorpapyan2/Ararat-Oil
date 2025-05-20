/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { TodoListStandardized } from '@/features/todo/components/TodoListStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TodoListStandardized',
    oldPath: '@/components/todo/TodoListStandardized',
    newPath: '@/features/todo/components/TodoListStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default TodoListStandardized;
