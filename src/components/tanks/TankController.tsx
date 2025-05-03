import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTankDialog } from "@/hooks/useTankDialog";
import { TankFormDialogStandardized } from "./TankFormDialogStandardized";

interface TankControllerProps {
  onSuccess?: () => void;
  className?: string;
  buttonText?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
}

export function TankController({
  onSuccess,
  className,
  buttonText = "Add New Tank",
  variant = "default",
  size = "default",
  showIcon = true,
}: TankControllerProps) {
  const { 
    openDialog,
    isFormOpen, 
    setIsFormOpen,
    isConfirmOpen,
    setIsConfirmOpen,
    isSubmitting,
    pendingTankData,
    handleConfirm,
    handleCancel,
  } = useTankDialog({
    onSuccess
  });

  return (
    <>
      <Button
        onClick={openDialog}
        className={className}
        variant={variant}
        size={size}
      >
        {showIcon && <Plus className="h-4 w-4 mr-2" />}
        {buttonText}
      </Button>

      <TankFormDialogStandardized onSuccess={onSuccess} />
    </>
  );
} 