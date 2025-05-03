import { StandardDialog, DeleteConfirmDialog } from "@/components/ui/dialog";
import { SalesFormStandardized } from "./SalesFormStandardized";
import { useSalesDialog } from "@/hooks/useSalesDialog";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types";

interface SalesDialogsHookedProps {
  onCreateSuccess?: (sale: Sale) => void;
  onUpdateSuccess?: (sale: Sale) => void;
  onDeleteSuccess?: (id: string) => void;
  triggerButton?: React.ReactNode;
}

export function SalesDialogsHooked({
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
  triggerButton,
}: SalesDialogsHookedProps) {
  const {
    isEditDialogOpen,
    isDeleteDialogOpen,
    selectedSale,
    isSubmitting,
    handleEditDialogOpenChange,
    setIsDeleteDialogOpen,
    handleSubmit,
    handleDelete,
  } = useSalesDialog({
    onCreateSuccess,
    onUpdateSuccess,
    onDeleteSuccess,
  });
  
  // Check if we're creating a new sale or editing an existing one
  const isCreatingNew = !selectedSale?.id;
  
  return (
    <>
      {/* The Edit/Create Dialog */}
      <StandardDialog
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogOpenChange}
        title={isCreatingNew ? "New Sale" : "Edit Sale"}
        description={
          isCreatingNew
            ? "Create a new sale record."
            : "Update the details of this sale."
        }
        maxWidth="sm:max-w-lg"
        actions={
          <>
            <Button 
              variant="outline" 
              onClick={() => handleEditDialogOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="sales-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : isCreatingNew ? "Create" : "Save changes"}
            </Button>
          </>
        }
      >
        <SalesFormStandardized
          id="sales-form"
          sale={selectedSale}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </StandardDialog>
      
      {/* The Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Sale Record"
        description="This will delete the sale record and restore the fuel to the tank. This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </>
  );
} 