import { useSalesDialog } from "@/hooks/useSalesDialog";
import { Button } from "@/components/ui/button";
import { SalesDialogsHooked } from "./SalesDialogsHooked";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Sale } from "@/types";

interface SalesControllerProps {
  /**
   * Optional list of sales to provide action buttons for
   */
  sales?: Sale[];
  /**
   * Whether to show a create button
   * @default true
   */
  showCreateButton?: boolean;
  /**
   * Optional callback when a sale is created
   */
  onCreateSuccess?: (sale: Sale) => void;
  /**
   * Optional callback when a sale is updated
   */
  onUpdateSuccess?: (sale: Sale) => void;
  /**
   * Optional callback when a sale is deleted
   */
  onDeleteSuccess?: (id: string) => void;
  /**
   * Optional className for the create button
   */
  className?: string;
}

export function SalesController({
  sales = [],
  showCreateButton = true,
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
  className,
}: SalesControllerProps) {
  const {
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
  } = useSalesDialog({
    onCreateSuccess,
    onUpdateSuccess,
    onDeleteSuccess,
  });
  
  return (
    <>
      {/* Create Button */}
      {showCreateButton && (
        <Button 
          onClick={openCreateDialog}
          className={className}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Sale
        </Button>
      )}
      
      {/* Optional Action Buttons for each sale */}
      {sales.map(sale => (
        <div key={sale.id} className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => openEditDialog(sale)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => openDeleteDialog(sale)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      ))}
      
      {/* The dialogs */}
      <SalesDialogsHooked
        onCreateSuccess={onCreateSuccess}
        onUpdateSuccess={onUpdateSuccess}
        onDeleteSuccess={onDeleteSuccess}
      />
    </>
  );
} 