
import { useAppStore } from '@/store/useAppStore';
import { ToastContainer } from './toast-container';
import { useIsMobile } from '@/hooks/use-mobile';

export function Toaster() {
  const { toasts } = useAppStore();
  const isMobile = useIsMobile();
  
  return (
    <ToastContainer 
      className={isMobile ? "bottom-0 left-0 right-0 flex flex-col-reverse items-center" : ""}
    />
  );
}
