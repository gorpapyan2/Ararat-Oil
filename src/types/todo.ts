export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  priority: "low" | "medium" | "high";
}

export type FilterType = "all" | "active" | "completed";
export type SortType = "newest" | "oldest" | "alphabetical"; 