
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SalesForm } from "./SalesForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
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
}

export function SalesDialogs({
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedSale,
  updateSale,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  confirmDelete,
}: SalesDialogsProps) {
  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <SalesForm
            sale={selectedSale}
            onSubmit={(data) => {
              if (selectedSale) {
                updateSale({
                  id: selectedSale.id,
                  ...data
                });
              }
            }}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
