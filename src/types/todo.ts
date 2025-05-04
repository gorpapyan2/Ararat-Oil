export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  priority: "low" | "medium" | "high";
}

export type FilterType = "all" | "active" | "completed";
export type SortType = "date-asc" | "date-desc" | "priority"; 