import { StandardDialog, Button } from "@/components/ui";
import { useConfirmationDialog, ConfirmationOptions } from "@/hooks/useConfirmationDialog";
import { AlertTriangle, Info, HelpCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationDialogStandardizedProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOptions?: Partial<ConfirmationOptions>;
}

export function ConfirmationDialogStandardized({
  open,
  onOpenChange,
  defaultOptions,
}: ConfirmationDialogStandardizedProps) {
  const {
    isOpen: hookIsOpen,
    setIsOpen: setHookIsOpen,
    isLoading,
    options,
    handleConfirm,
    handleCancel,
  } = useConfirmationDialog({ defaultOptions });

  // Use controlled state if provided, otherwise use the hook's state
  const isOpen = open !== undefined ? open : hookIsOpen;
  const setIsOpen = onOpenChange || setHookIsOpen;

  // Render the icon based on the variant
  const renderIcon = () => {
    const iconClassName = "h-6 w-6";
    
    switch (options.variant) {
      case "destructive":
        return <AlertCircle className={cn(iconClassName, "text-destructive")} />;
      case "warning":
        return <AlertTriangle className={cn(iconClassName, "text-amber-500")} />;
      case "info":
        return <Info className={cn(iconClassName, "text-blue-500")} />;
      default:
        return <HelpCircle className={cn(iconClassName, "text-muted-foreground")} />;
    }
  };

  return (
    <StandardDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title={options.title || "Confirm Action"}
      preventOutsideClose={isLoading}
      maxWidth="sm:max-w-[450px]"
    >
      <div className="flex gap-4 py-2">
        <div className="flex-shrink-0 mt-1">
          {renderIcon()}
        </div>
        <div>
          <p className="text-sm text-foreground">{options.message}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
        >
          {options.cancelLabel || "Cancel"}
        </Button>
        <Button
          type="button"
          variant={options.variant === "destructive" ? "destructive" : "default"}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : options.confirmLabel || "Confirm"}
        </Button>
      </div>
    </StandardDialog>
  );
} 