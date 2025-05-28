import { ReactNode, useCallback } from "react";
import { useConfirmationDialog } from "@/hooks";
import { ConfirmationOptions } from "@/hooks/useConfirmationDialog";
import { ConfirmationDialogStandardized } from "./ConfirmationDialogStandardized";

interface ConfirmationControllerProps {
  children: (
    openConfirmation: (options: Partial<ConfirmationOptions>) => void
  ) => ReactNode;
  defaultOptions?: Partial<ConfirmationOptions>;
}

export function ConfirmationController({
  children,
  defaultOptions,
}: ConfirmationControllerProps) {
  const {
    isOpen,
    setIsOpen,
    openDialog,
    options,
    isLoading,
    handleConfirm,
    handleCancel,
  } = useConfirmationDialog({
    defaultOptions,
  });

  // This function is passed to children to allow them to open the confirmation dialog
  const openConfirmation = useCallback(
    (customOptions: Partial<ConfirmationOptions>) => {
      openDialog(customOptions);
    },
    [openDialog]
  );

  return (
    <>
      {/* Render children with the openConfirmation function */}
      {children(openConfirmation)}

      {/* Render the confirmation dialog */}
      <ConfirmationDialogStandardized
        open={isOpen}
        onOpenChange={setIsOpen}
        title={options.title || "Confirm Action"}
        description={options.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText={options.confirmLabel || "Confirm"}
        cancelText={options.cancelLabel || "Cancel"}
      />
    </>
  );
}

// Example usage:
// <ConfirmationController>
//   {(confirm) => (
//     <Button onClick={() => confirm({
//       title: "Delete Item",
//       message: "Are you sure you want to delete this item?",
//       variant: "destructive",
//       confirmLabel: "Delete",
//       onConfirm: handleDelete
//     })}>
//       Delete
//     </Button>
//   )}
// </ConfirmationController>
