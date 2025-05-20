/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { TodoFilter } from '@/features/todo/components/TodoFilter';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TodoFilter',
    oldPath: '@/components/todo/TodoFilter',
    newPath: '@/features/todo/components/TodoFilter',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default TodoFilter;
