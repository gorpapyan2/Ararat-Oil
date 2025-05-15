import { useState } from "react";
import { FillingSystem, fillingSystemsApi, Tank, tanksApi } from "@/core/api";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
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
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [systemToDelete, setSystemToDelete] = useState<FillingSystem | null>(
    null,
  );

  // Fetch tanks to associate with filling systems
  const { data: tanks } = useQuery({
    queryKey: ["tanks"],
    queryFn: tanksApi.getAll,
  });

  // Get tank details for a given tank ID
  const getTankDetails = (tankId: string): Tank | undefined => {
    return tanks?.data?.find((tank) => tank.id === tankId);
  };

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
      await fillingSystemsApi.delete(systemToDelete.id);
      toast({
        title: t("common.success"),
        message: t("fillingSystems.systemAdded"),
      });
      onDelete();
      closeDeleteConfirm();
    } catch (error) {
      toast({
        title: t("common.error"),
        message: t("fillingSystems.errorAddingSystem"),
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="text-muted-foreground">{t("common.loading")}</div>
      </div>
    );
  }

  const columns = [
    {
      header: t("fillingSystems.systemName"),
      accessorKey: "name" as keyof FillingSystem,
      cell: (value: string, row: FillingSystem) => row.name
    },
    {
      header: t("fillingSystems.connectedTank"),
      accessorKey: "tank_ids" as keyof FillingSystem,
      cell: (value: any, row: FillingSystem) => {
        const tankId = row.tank_ids?.[0];
        if (!tankId) return t("common.unknown");
        
        const tank = getTankDetails(tankId);
        return tank ? (
          <span className="flex items-center">
            {tank.name}
            <span className="ml-2 text-xs text-muted-foreground">
              ({tank.fuel_type_id})
            </span>
          </span>
        ) : (
          t("common.unknown")
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
              <th className="p-3 text-left font-medium">{t("fillingSystems.systemName")}</th>
              <th className="p-3 text-left font-medium">{t("fillingSystems.connectedTank")}</th>
              <th className="p-3 text-center w-24">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {fillingSystems.map((system) => (
              <tr key={system.id} className="border-t">
                <td className="p-3">{system.name}</td>
                <td className="p-3">
                  {system.tank_ids?.[0] ? (
                    (() => {
                      const tank = getTankDetails(system.tank_ids[0]);
                      if (!tank) return t("common.unknown");
                      return (
                        <span className="flex items-center">
                          {tank.name}
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({tank.fuel_type_id})
                          </span>
                        </span>
                      );
                    })()
                  ) : (
                    t("common.unknown")
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
