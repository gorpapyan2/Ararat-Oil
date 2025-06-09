import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { tanksApi } from "@/core/api";
import { FillingSystem } from "@/features/filling-systems/types";
import { FuelTank } from "@/features/fuel-management/types";
import { DeleteConfirmDialog } from "@/shared/components/common/dialog/DeleteConfirmDialog";

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
    null
  );
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  // Fetch tanks to associate with filling systems
  const { data: tanks } = useQuery({
    queryKey: ["tanks"],
    queryFn: tanksApi.getTanks,
  });

  // Get tank details for a given tank ID
  const getTankDetails = (tankId: string): FuelTank | undefined => {
    return tanks?.data?.find((tank) => tank.id === tankId) as
      | FuelTank
      | undefined;
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
      // Note: This would be handled through useFillingSystem in FillingSystemManagerStandardized
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

  const handleDeleteConfirm = () => {
    // Implementation of handleDeleteConfirm
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="text-gray-400">{t("common.loading")}</div>
      </div>
    );
  }

  if (fillingSystems.length === 0) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="text-gray-400">{t("fillingSystems.noSystems", "No filling systems found")}</div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-md border border-gray-700 bg-gray-800/40">
        <table className="w-full table-fixed">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="p-3 text-left font-medium text-gray-300">
                {t("fillingSystems.systemName")}
              </th>
              <th className="p-3 text-left font-medium text-gray-300">
                {t("fillingSystems.connectedTank")}
              </th>
              <th className="p-3 text-center w-24 text-gray-300">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {fillingSystems.map((system) => (
              <tr key={system.id} className="border-t border-gray-700 hover:bg-gray-700/20">
                <td className="p-3 text-gray-100">{system.name}</td>
                <td className="p-3 text-gray-100">
                  {system.tank_id
                    ? (() => {
                        const tank = getTankDetails(system.tank_id);
                        if (!tank) return t("common.unknown");
                        return (
                          <span className="flex items-center">
                            {tank.name}
                            <span className="ml-2 text-xs text-gray-400">
                              ({tank.fuel_type})
                            </span>
                          </span>
                        );
                      })()
                    : t("common.unknown")}
                </td>
                <td className="p-3 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteConfirm(system)}
                    className="hover:bg-red-900/20 hover:text-red-500 text-gray-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleDelete}
        description={t("fillingSystems.deleteConfirmation", "Are you sure you want to delete this filling system? This action cannot be undone.")}
        isLoading={isDeleting}
      />
    </>
  );
}
