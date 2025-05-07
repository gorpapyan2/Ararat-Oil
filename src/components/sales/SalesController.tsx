
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTankDialog } from "@/hooks/useTankDialog";
import { TankFormDialogStandardized } from "../tanks/TankFormDialogStandardized";

interface SalesControllerProps {
  onSuccess?: () => void;
  className?: string;
  buttonText?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
}

export function SalesController({
  onSuccess,
  className,
  buttonText = "Add New Sale",
  variant = "default",
  size = "default",
  showIcon = true,
}: SalesControllerProps) {
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
