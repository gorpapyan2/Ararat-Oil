/**
 * Priority levels for todo items
 */
export type PriorityType = "low" | "medium" | "high";

/**
 * Todo item interface
 */
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: PriorityType;
  createdAt: number;
  completedAt?: number;
}

/**
 * Filter options for todos
 */
export type FilterType = "all" | "active" | "completed";

/**
 * Sort options for todos
 */
export type SortType = "date" | "priority" | "alphabetical"; 