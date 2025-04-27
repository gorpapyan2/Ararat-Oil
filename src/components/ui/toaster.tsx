import { useAppStore } from '@/store/useAppStore';
import { ToastContainer } from './toast-container';

export function Toaster() {
  const { toasts } = useAppStore();
  
  return <ToastContainer />;
}
