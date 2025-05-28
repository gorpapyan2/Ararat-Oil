import { useToast } from "@/hooks";
import { ToastContainer } from "./toast-container";
import { useIsMobile } from "@/hooks/useResponsive";

export function Toaster() {
  const { toasts } = useToast();
  const isMobile = useIsMobile();

  return (
    <ToastContainer position={isMobile ? "bottom-right" : "bottom-right"} />
  );
}
