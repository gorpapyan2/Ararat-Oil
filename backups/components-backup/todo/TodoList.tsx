/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { TodoList } from '@/features/todo/components/TodoList';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TodoList',
    oldPath: '@/components/todo/TodoList',
    newPath: '@/features/todo/components/TodoList',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default TodoList;
