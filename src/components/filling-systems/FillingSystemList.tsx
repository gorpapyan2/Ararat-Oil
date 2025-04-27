
import { useState } from "react";
import { FillingSystem, deleteFillingSystem } from "@/services/filling-systems";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import {
  EnhancedTable,
  EnhancedHeader,
  EnhancedRow,
  EnhancedCell,
  EnhancedHeaderCell,
  TableBody,
} from "@/components/ui/enhanced-table";

interface FillingSystemListProps {
  fillingSystems: FillingSystem[];
  isLoading: boolean;
  onDelete: () => void;
}

export function FillingSystemList({ fillingSystems, isLoading, onDelete }: FillingSystemListProps) {
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [systemToDelete, setSystemToDelete] = useState<FillingSystem | null>(null);

  const openDeleteConfirm = (system: FillingSystem) => {
    setSystemToDelete(system);
    setIsConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsConfirmOpen(false);
    // Reset system to delete after a brief delay to allow the dialog closing animation
    setTimeout(() => setSystemToDelete(null), 300);
  };

  const handleDelete = async () => {
    if (!systemToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteFillingSystem(systemToDelete.id);
      toast({
        title: "Success",
        message: "Filling system deleted successfully",
      });
      onDelete();
      closeDeleteConfirm();
    } catch (error) {
      toast({
        title: "Error",
        message: "Failed to delete filling system",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <EnhancedTable>
        <EnhancedHeader>
          <EnhancedRow>
            <EnhancedHeaderCell>System Name</EnhancedHeaderCell>
            <EnhancedHeaderCell>Associated Tank</EnhancedHeaderCell>
            <EnhancedHeaderCell className="text-center">Actions</EnhancedHeaderCell>
          </EnhancedRow>
        </EnhancedHeader>
        <TableBody>
          {fillingSystems.map((system) => (
            <EnhancedRow key={system.id}>
              <EnhancedCell>{system.name}</EnhancedCell>
              <EnhancedCell>
                {system.tank ? (
                  <span className="flex items-center">
                    {system.tank.name} 
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({system.tank.fuel_type})
                    </span>
                  </span>
                ) : 'N/A'}
              </EnhancedCell>
              <EnhancedCell className="text-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteConfirm(system)}
                  className="hover:bg-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </EnhancedCell>
            </EnhancedRow>
          ))}
          {fillingSystems.length === 0 && (
            <EnhancedRow>
              <td 
                className="text-center text-muted-foreground h-32 py-8 px-4"
                colSpan={3}
              >
                No filling systems found
              </td>
            </EnhancedRow>
          )}
        </TableBody>
      </EnhancedTable>
      
      {systemToDelete && (
        <ConfirmDeleteDialog
          isOpen={isConfirmOpen}
          onClose={closeDeleteConfirm}
          onConfirm={handleDelete}
          systemName={systemToDelete.name}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
