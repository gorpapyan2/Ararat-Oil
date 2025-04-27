import { useAppStore } from "@/store/useAppStore";
import { ToastContainer } from "./toast-container";
import { useIsMobile } from "@/hooks/use-mobile";

export function Toaster() {
  const { toasts } = useAppStore();
  const isMobile = useIsMobile();

  return <ToastContainer />;
}
