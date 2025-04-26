import { useAppStore } from '@/store/useAppStore';
import { ToastContainer } from './toast-container';
import { useEffect } from 'react';

export function Toaster() {
  const { toasts } = useAppStore();
  
  // For debugging purposes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Current toasts:', toasts);
    }
  }, [toasts]);
  
  return <ToastContainer />;
}
