import * as React from "react";
import { cn } from "@/shared/utils";
import { StandardDialog, StandardDialogProps } from "./StandardDialog";
import { Button, ButtonProps } from "@/core/components/ui/primitives/button";
import { useTranslation } from "react-i18next";
import { HelpCircle } from "lucide-react";

/**
 * Props for ConfirmDialog component
 */
export interface ConfirmDialogProps extends Omit<StandardDialogProps, 'actions'> {
  /**
   * Callback fired when the confirmation is accepted
   */
  onConfirm: () => void | Promise<void>;
  
  /**
   * Callback fired when the confirmation is canceled
   */
  onCancel?: () => void;
  
  /**
   * Text for the confirm button
   * @default "Confirm"
   */
  confirmText?: string;
  
  /**
   * Text for the cancel button
   * @default "Cancel"
   */
  cancelText?: string;
  
  /**
   * Variant of the confirm button
   * @default "default"
   */
  confirmVariant?: ButtonProps['variant'];
  
  /**
   * Whether the confirmation is being processed
   * @default false
   */
  isConfirming?: boolean;
  
  /**
   * Icon to display in the confirmation dialog
   * @default HelpCircle
   */
  icon?: React.ReactNode;
  
  /**
   * Color of the icon background
   * @default "bg-primary/10"
   */
  iconBgColor?: string;
  
  /**
   * Color of the icon
   * @default "text-primary"
   */
  iconColor?: string;
}

/**
 * ConfirmDialog component
 * 
 * A standardized dialog for confirmation actions with customizable buttons and icon.
 * 
 * @example
 * ```tsx
 * <ConfirmDialog
 *   open={isConfirmOpen}
 *   onOpenChange={setIsConfirmOpen}
 *   title="Confirm Action"
 *   description="Are you sure you want to perform this action?"
 *   onConfirm={handleConfirm}
 * />
 * ```
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmVariant = "default",
  isConfirming = false,
  icon = <HelpCircle className="h-6 w-6" />,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
  className,
  ...props
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  
  // Handle confirm action
  const handleConfirm = async () => {
    try {
      await onConfirm();
      if (!isConfirming) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Confirmation error:", error);
    }
  };
  
  // Handle cancel action
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };
  
  // Actions for the dialog footer
  const actions = (
    <>
      <Button
        variant="outline"
        onClick={handleCancel}
        disabled={isConfirming}
      >
        {cancelText || t("common.cancel", "Cancel")}
      </Button>
      <Button
        variant={confirmVariant}
        onClick={handleConfirm}
        disabled={isConfirming}
      >
        {isConfirming 
          ? t("common.processing", "Processing...") 
          : confirmText || t("common.confirm", "Confirm")}
      </Button>
    </>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      actions={actions}
      className={cn("sm:max-w-md", className)}
      {...props}
    >
      <div className="flex flex-col items-center justify-center gap-4 py-4">
        <div className={cn("rounded-full p-3", iconBgColor)}>
          <div className={iconColor}>{icon}</div>
        </div>
        {children}
      </div>
    </StandardDialog>
  );
} 