
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  message?: string;
  duration: number;
  type: 'success' | 'error' | 'warning' | 'info';
  createdAt: Date;
}
