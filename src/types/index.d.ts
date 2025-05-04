// Export all type definitions to make them available throughout the app
export * from './todo';

// Declare module paths to ensure proper TypeScript resolution
declare module '@/components/todo' {
  import { TodoListStandardized } from '@/components/todo/TodoListStandardized';
  import { TodoFormStandardized } from '@/components/todo/TodoFormStandardized';
  import { TodoItemStandardized } from '@/components/todo/TodoItemStandardized';
  import { TodoFilterStandardized } from '@/components/todo/TodoFilterStandardized';

  // Export components
  export const TodoList: typeof TodoListStandardized;
  export { TodoFormStandardized, TodoItemStandardized, TodoFilterStandardized, TodoListStandardized };
} 