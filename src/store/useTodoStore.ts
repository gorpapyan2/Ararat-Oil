import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { TodoItem, FilterType, SortType } from "@/types/todo";

interface TodoState {
  todos: TodoItem[];
  filter: FilterType;
  sort: SortType;
  search: string;

  // Actions
  addTodo: (text: string, priority?: TodoItem["priority"]) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: FilterType) => void;
  setSort: (sort: SortType) => void;
  setSearch: (search: string) => void;
  updatePriority: (id: string, priority: TodoItem["priority"]) => void;
}

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
              : todo,
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      editTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text } : todo,
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
            todo.id === id ? { ...todo, priority } : todo,
          ),
        })),
    }),
    {
      name: "todo-storage",
      partialize: (state) => ({
        todos: state.todos,
      }),
    },
  ),
);
