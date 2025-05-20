/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { TodoItem } from '@/features/todo/components/TodoItem';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TodoItem',
    oldPath: '@/components/todo/TodoItem',
    newPath: '@/features/todo/components/TodoItem',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default TodoItem;
