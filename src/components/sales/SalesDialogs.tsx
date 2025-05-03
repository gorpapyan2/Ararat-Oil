import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SalesFormStandardized } from "./SalesFormStandardized";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sale } from "@/types";

interface SalesDialogsProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedSale: Sale | null;
  updateSale: (data: any) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  confirmDelete: () => void;
  createSale?: (data: any) => void;
}

export function SalesDialogs({
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedSale,
  updateSale,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  confirmDelete,
  createSale,
}: SalesDialogsProps) {
  // Check if we're creating a new sale or editing an existing one
  const isCreatingNew = !selectedSale?.id;
  
  // Using direct prop functions to avoid hook inconsistencies
  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogTitle>{isCreatingNew ? "New Sale" : "Edit Sale"}</DialogTitle>
          <DialogDescription>
            {isCreatingNew
              ? "Create a new sale record."
              : "Update the details of this sale."}
          </DialogDescription>
          <SalesFormStandardized
            sale={selectedSale}
            onSubmit={(data) => {
              if (selectedSale?.id) {
                // Update existing sale
                updateSale({
                  id: selectedSale.id,
                  ...data,
                });
              } else if (createSale) {
                // Create new sale
                createSale(data);
              }
            }}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the sale record and restore the fuel to the tank.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
