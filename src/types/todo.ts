export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  priority: 'low' | 'medium' | 'high';
}

// Use const assertions for better type safety
export const FILTER_TYPES = ['all', 'active', 'completed'] as const;
export type FilterType = typeof FILTER_TYPES[number];

export const SORT_TYPES = ['newest', 'oldest', 'alphabetical', 'priority'] as const;
export type SortType = typeof SORT_TYPES[number];

// Priority types with const assertion
export const PRIORITY_TYPES = ['low', 'medium', 'high'] as const;
export type PriorityType = typeof PRIORITY_TYPES[number];

// Priority order mapping for sorting
export const PRIORITY_ORDER: Record<PriorityType, number> = {
  high: 0,
  medium: 1,
  low: 2,
} as const; 