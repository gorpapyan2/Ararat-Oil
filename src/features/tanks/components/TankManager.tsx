import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTanks, getFuelTypes } from "../services";
import { TankList } from "./TankList";
import { TankFormDialog } from "./TankFormDialog";
import { Button } from "@/core/components/ui/button";
import { Plus, Gauge } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { useTranslation } from "react-i18next";

interface TankManagerProps {
  onRenderAction?: (actionNode: React.ReactNode) => void;
}

export function TankManager({ onRenderAction }: TankManagerProps) {
  const { t } = useTranslation();
  const tankFormDialog = useDialog();
  const [isEditingLevels, setIsEditingLevels] = useState(false);

  // Fetch tanks
  const {
    data: tanks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tanks"],
    queryFn: getTanks,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  // Fetch fuel types
  const { data: fuelTypes = [] } = useQuery({
    queryKey: ["fuel-types"],
    queryFn: getFuelTypes,
  });

  // Memoize the refetch callback
  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  // Refetch on mount and on interval
  useEffect(() => {
    handleRefetch();
    const intervalId = setInterval(handleRefetch, 5000);
    return () => clearInterval(intervalId);
  }, [handleRefetch]);

  // Ensure we have an array even if the fetched data is undefined
  const tanksData = useMemo(() => (Array.isArray(tanks) ? tanks : []), [tanks]);

  // Create action buttons - memoize to prevent recreation on every render
  const actionButtons = useMemo(
    () => (
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => setIsEditingLevels(true)}>
          <Gauge className="mr-2 h-4 w-4" />
          {t("tanks.editLevels")}
        </Button>
        <Button onClick={tankFormDialog.open}>
          <Plus className="mr-2 h-4 w-4" />
          {t("tanks.addNew")}
        </Button>
      </div>
    ),
    [tankFormDialog.open, setIsEditingLevels, t]
  );

  // Use useEffect to handle action rendering to avoid state updates during render
  useEffect(() => {
    if (onRenderAction) {
      onRenderAction(actionButtons);
    }
  }, [onRenderAction, actionButtons]);

  // Memoize the edit complete handler
  const handleEditComplete = useCallback(() => {
    setIsEditingLevels(false);
    refetch();
  }, [refetch]);

  return (
    <div className="space-y-6">
      <TankList
        tanks={tanksData}
        isLoading={isLoading}
        isEditMode={isEditingLevels}
        onEditComplete={handleEditComplete}
      />

      <TankFormDialog
        open={tankFormDialog.isOpen}
        onOpenChange={tankFormDialog.onOpenChange}
        fuelTypes={fuelTypes}
      />
    </div>
  );
}
