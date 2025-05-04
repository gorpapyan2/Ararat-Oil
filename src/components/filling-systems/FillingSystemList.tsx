import { useState } from "react";
import { FillingSystem, deleteFillingSystem } from "@/services/filling-systems";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks";
import { ConfirmDeleteDialogStandardized } from "./ConfirmDeleteDialogStandardized";
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
      cell: (value: string, row: FillingSystem) => row.name
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
      <div className="overflow-hidden rounded-md border">
        <table className="w-full table-fixed">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left font-medium">System Name</th>
              <th className="p-3 text-left font-medium">Associated Tank</th>
              <th className="p-3 text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fillingSystems.map((system) => (
              <tr key={system.id} className="border-t">
                <td className="p-3">{system.name}</td>
                <td className="p-3">
                  {system.tank ? (
                    <span className="flex items-center">
                      {system.tank.name}
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({system.tank.fuel_type})
                      </span>
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-3 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteConfirm(system)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {systemToDelete && (
        <ConfirmDeleteDialogStandardized
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={handleDelete}
          systemName={systemToDelete.name}
          isLoading={isDeleting}
        />
      )}
    </>
  );
}
