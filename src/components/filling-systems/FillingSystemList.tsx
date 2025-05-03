import { useState } from "react";
import { FillingSystem, deleteFillingSystem } from "@/services/filling-systems";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { StandardizedDataTable } from "@/components/unified/StandardizedDataTable";

interface FillingSystemListProps {
  fillingSystems: FillingSystem[];
  isLoading: boolean;
  onDelete: () => void;
}

export function FillingSystemList({
  fillingSystems,
  isLoading,
  onDelete,
}: FillingSystemListProps) {
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [systemToDelete, setSystemToDelete] = useState<FillingSystem | null>(
    null,
  );

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

  const columns = [
    {
      header: "System Name",
      accessorKey: "name" as keyof FillingSystem,
    },
    {
      header: "Associated Tank",
      accessorKey: "tank" as keyof FillingSystem,
      cell: (value: any, row: FillingSystem) => {
        return row.tank ? (
          <span className="flex items-center">
            {row.tank.name}
            <span className="ml-2 text-xs text-muted-foreground">
              ({row.tank.fuel_type})
            </span>
          </span>
        ) : (
          "N/A"
        );
      },
    },
  ];

  return (
    <>
      <StandardizedDataTable
        columns={columns}
        data={fillingSystems}
        loading={isLoading}
        onDelete={(id) => {
          const system = fillingSystems.find(sys => sys.id === id);
          if (system) {
            openDeleteConfirm(system);
          }
        }}
      />

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
