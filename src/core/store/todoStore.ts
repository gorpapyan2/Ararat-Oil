import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  TodoItem,
  FilterType,
  SortType,
  PriorityType,
  PRIORITY_ORDER,
} from "@/types/todo";

/**
 * Storage key for persisting todo state
 */
const STORAGE_KEY = "todo-storage";

/**
 * Todo state management interface
 */
export interface TodoState {
  // State
  todos: TodoItem[];
  filter: FilterType;
  sort: SortType;
  search: string;

  // Actions
  addTodo: (text: string, priority?: PriorityType) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: FilterType) => void;
  setSort: (sort: SortType) => void;
  setSearch: (search: string) => void;
  updatePriority: (id: string, priority: PriorityType) => void;
}

/**
 * Todo state store
 *
 * Manages todo items including:
 * - Todo CRUD operations
 * - Filtering, sorting, and search functionality
 * - Priority management
 */
export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      filter: "all",
      sort: "newest",
      search: "",

      addTodo: (text, priority = "medium") =>
        set((state) => ({
          todos: [
            {
              id: uuidv4(),
              text,
              completed: false,
              createdAt: Date.now(),
              priority,
            },
            ...state.todos,
          ],
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  completed: !todo.completed,
                  completedAt: !todo.completed ? Date.now() : undefined,
                }
              : todo
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      editTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text } : todo
          ),
        })),

      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        })),

      setFilter: (filter) => set({ filter }),

      setSort: (sort) => set({ sort }),

      setSearch: (search) => set({ search }),

      updatePriority: (id, priority) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, priority } : todo
          ),
        })),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        todos: state.todos,
      }),
    }
  )
);

/**
 * Type-safe selectors for todo state
 */

/**
 * Get total number of todos
 */
export const selectTotalTodos = (state: TodoState): number =>
  state.todos.length;

/**
 * Get number of active todos
 */
export const selectActiveTodos = (state: TodoState): number =>
  state.todos.filter((todo) => !todo.completed).length;

/**
 * Get number of completed todos
 */
export const selectCompletedTodos = (state: TodoState): number =>
  state.todos.filter((todo) => todo.completed).length;

/**
 * Check if there are any completed todos
 */
export const selectHasCompletedTodos = (state: TodoState): boolean =>
  selectCompletedTodos(state) > 0;

/**
 * Helper function to get filtered and sorted todos
 *
 * @param state Todo state
 * @returns Filtered and sorted todo items
 */
export const getFilteredTodos = (state: TodoState): TodoItem[] => {
  const { todos, filter, sort, search } = state;

  // Filter todos
  let filteredTodos = todos;

  if (filter === "active") {
    filteredTodos = filteredTodos.filter((todo) => !todo.completed);
  } else if (filter === "completed") {
    filteredTodos = filteredTodos.filter((todo) => todo.completed);
  }

  // Apply search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredTodos = filteredTodos.filter((todo) =>
      todo.text.toLowerCase().includes(searchLower)
    );
  }

  // Sort todos
  return [...filteredTodos].sort((a, b) => {
    if (sort === "oldest") {
      return a.createdAt - b.createdAt;
    } else if (sort === "alphabetical") {
      return a.text.localeCompare(b.text);
    } else if (sort === "priority") {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    } else {
      // Default: newest
      return b.createdAt - a.createdAt;
    }
  });
};
