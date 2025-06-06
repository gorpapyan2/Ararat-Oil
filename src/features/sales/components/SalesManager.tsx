import React, { useCallback } from "react";
import { Button } from "@/core/components/ui/primitives/button";
import { Plus } from 'lucide-react';
import { useSalesDialog } from "../hooks/useSalesDialog";
import type { Sale, CreateSaleRequest } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/core/components/ui/primitives/alert-dialog";

interface SalesManagerProps {
  /**
   * Callback when a sale is created
   */
  onSaleCreated?: (sale: Sale) => void;

  /**
   * Callback when a sale is updated
   */
  onSaleUpdated?: (sale: Sale) => void;

  /**
   * Callback when a sale is deleted
   * @param id The ID of the deleted sale
   * @param sale The deleted sale entity (optional)
   */
  onSaleDeleted?: (id: string | number, sale?: Sale) => void;
}

/**
 * Sales management component that demonstrates using the refactored hooks
 *
 * This component shows how to use the new hooks architecture to manage sales operations
 * with significantly less boilerplate code.
 */
export function SalesManager({
  onSaleCreated,
  onSaleUpdated,
  onSaleDeleted,
}: SalesManagerProps) {
  // Use our refactored hook with much less boilerplate
  const salesDialog = useSalesDialog({
    onCreateSuccess: onSaleCreated,
    onUpdateSuccess: onSaleUpdated,
    onDeleteSuccess: onSaleDeleted,
  });

  // Handler for form submission - much simpler with our new hook
  const handleSubmit = useCallback(
    async (data: CreateSaleRequest) => {
      try {
        await salesDialog.handleSubmit(data);
        return true;
      } catch (error) {
        console.error("Error submitting sale form:", error);
        return false;
      }
    },
    [salesDialog]
  );

  return (
    <div className="space-y-4">
      {/* Add sale button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales</h2>
        <Button onClick={salesDialog.openCreateDialog} className="mb-4">
          <Plus className="mr-2 h-4 w-4" />
          Add Sale
        </Button>
      </div>

      {/* SalesForm dialog would go here - for demonstration purposes */}
      {/* 
      <SalesFormDialog
        open={salesDialog.isEditDialogOpen}
        onOpenChange={salesDialog.handleEditDialogOpenChange}
        sale={salesDialog.selectedSale}
        onSubmit={handleSubmit}
        isSubmitting={salesDialog.isSubmitting}
      />
      */}

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={salesDialog.isDeleteDialogOpen}
        onOpenChange={(open) => !open && salesDialog.setIsDeleteDialogOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sale? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={salesDialog.handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {salesDialog.isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SalesManager;
