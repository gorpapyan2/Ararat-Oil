import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFuelTanks } from "@/services/tanks";
import { TankList } from "./TankList";
import { TankFormStandardized } from "./TankFormStandardized";
import { Button } from "@/components/ui/button";
import { Plus, Gauge } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";

interface TankManagerStandardizedProps {
  onRenderAction?: (actionNode: React.ReactNode) => void;
}

export function TankManagerStandardized({ onRenderAction }: TankManagerStandardizedProps) {
  // Use dialog hooks instead of direct state
  const tankFormDialog = useDialog();
  const [isEditingLevels, setIsEditingLevels] = useState(false);

  // Fetch tanks
  const {
    data: tanks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["fuel-tanks"],
    queryFn: fetchFuelTanks,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
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
  const tanksData = useMemo(() => Array.isArray(tanks) ? tanks : [], [tanks]);

  // Create action buttons - memoize to prevent recreation on every render
  const actionButtons = useMemo(
    () => (
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => setIsEditingLevels(true)}>
          <Gauge className="mr-2 h-4 w-4" />
          Edit Levels
        </Button>
        <Button onClick={tankFormDialog.open}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Tank
        </Button>
      </div>
    ),
    [tankFormDialog.open, setIsEditingLevels],
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

  // Memoize the tank added handler
  const handleTankAdded = useCallback(() => {
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

      <TankFormStandardized
        isOpen={tankFormDialog.isOpen}
        onOpenChange={tankFormDialog.onOpenChange}
        onTankAdded={handleTankAdded}
      />
    </div>
  );
} 