import { useState } from "react";
import { Button } from '@/core/components/ui/button';
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { tanksApi } from "@/core/api";
import { FillingSystem } from "../types";
import { FuelTank } from "@/features/tanks/types";
import { ConfirmDeleteDialogStandardized } from "./ConfirmDeleteDialogStandardized";

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
    queryFn: tanksApi.getTanks,
  });

  // Get tank details for a given tank ID
  const getTankDetails = (tankId: string): FuelTank | undefined => {
    return tanks?.data?.find((tank) => tank.id === tankId) as FuelTank | undefined;
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

  if (isLoading) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="text-muted-foreground">{t("common.loading")}</div>
      </div>
    );
  }

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
                  {system.tank_id ? (
                    (() => {
                      const tank = getTankDetails(system.tank_id);
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