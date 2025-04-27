
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  message: string; // Changed from optional to required
  duration: number;
  type: 'success' | 'error' | 'warning' | 'info';
  createdAt: Date;
}
