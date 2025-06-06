import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  TodoItem,
  PriorityType,
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
  filter: "all" | "active" | "completed";
  sort: "date" | "priority" | "alphabetical";
  search: string;

  // Actions
  addTodo: (text: string, priority?: PriorityType) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  setFilter: (filter: "all" | "active" | "completed") => void;
  setSort: (sort: "date" | "priority" | "alphabetical") => void;
  setSearch: (search: string) => void;
  clearCompleted: () => void;
  setPriority: (id: string, priority: PriorityType) => void;
  getTodos: () => TodoItem[];
}

/**
 * Todo state store
 *
 * Manages todo items including:
 * - Todo CRUD operations
 * - Filtering and searching
 * - Priority management
 */
export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: "all",
      sort: "date",
      search: "",

      addTodo: (text, priority = "medium") =>
        set((state) => ({
          todos: [
            {
              id: crypto.randomUUID(),
              text,
              completed: false,
              priority,
              createdAt: Date.now(),
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

      setFilter: (filter) => set({ filter }),
      setSort: (sort) => set({ sort }),
      setSearch: (search) => set({ search }),

      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        })),

      setPriority: (id, priority) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, priority } : todo
          ),
        })),

      getTodos: () => {
        const state = get();
        return getFilteredTodos(state);
      },
    }),
    {
      name: STORAGE_KEY,
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
    filteredTodos = todos.filter((todo) => !todo.completed);
  } else if (filter === "completed") {
    filteredTodos = todos.filter((todo) => todo.completed);
  }

  // Search todos
  if (search) {
    filteredTodos = filteredTodos.filter((todo) =>
      todo.text.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sort todos
  filteredTodos.sort((a, b) => {
    switch (sort) {
      case "date":
        return b.createdAt - a.createdAt;
      case "priority": {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      case "alphabetical":
        return a.text.localeCompare(b.text);
      default:
        return 0;
    }
  });

  return filteredTodos;
}; 