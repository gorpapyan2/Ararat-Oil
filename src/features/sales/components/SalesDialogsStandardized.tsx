import { StandardDialog, DeleteConfirmDialog } from "@/core/components/ui/dialog";
import { SalesFormStandardized } from "./SalesFormStandardized";
import { Sale } from "@/types";

// Extend the Sale type to include the properties needed by SalesFormStandardized
interface ExtendedSale extends Sale {
  unit_price?: number;
  comments?: string;
}

interface SalesDialogsProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedSale: Sale | null;
  updateSale: (data: any) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  confirmDelete: () => void;
  isLoading?: boolean;
}

export function SalesDialogsStandardized({
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedSale,
  updateSale,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  confirmDelete,
  isLoading = false,
}: SalesDialogsProps) {
  // We only handle editing existing sales in this dialog now
  return (
    <>
      <StandardDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Sale"
        description="Update the details of this sale."
        width="lg"
      >
        <SalesFormStandardized
          sale={selectedSale as ExtendedSale}
          onSubmit={async (data) => {
            if (selectedSale?.id) {
              // Update existing sale
              updateSale({
                id: selectedSale.id,
                ...data,
              });
              return true;
            }
            return false;
          }}
        />
      </StandardDialog>
      
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Sale Record"
        description="This will delete the sale record and restore the fuel to the tank. This action cannot be undone."
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </>
  );
} 