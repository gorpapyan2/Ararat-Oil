
import { ToastContainer } from "./toast-container";

// Mock toast system for compatibility
const mockToasts: any[] = [];
const mockDismiss = (id: string) => {};

export function Toaster() {
  return (
    <ToastContainer 
      toasts={mockToasts} 
      dismiss={mockDismiss}
      position="bottom-right" 
    />
  );
}
