import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFuelTanks } from "@/services/tanks";
import { TankList } from "./TankList";
import { TankForm } from "./TankForm";
import { Button } from "@/components/ui/button";
import { Plus, Gauge } from "lucide-react";

interface TankManagerProps {
  onRenderAction?: (actionNode: React.ReactNode) => void;
}

export function TankManager({ onRenderAction }: TankManagerProps) {
  const [isAddingTank, setIsAddingTank] = useState(false);
  const [isEditingLevels, setIsEditingLevels] = useState(false);

  // Fetch tanks
  const { data: tanks, isLoading, refetch } = useQuery({
    queryKey: ['fuel-tanks'],
    queryFn: fetchFuelTanks,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always"
  });

  // Refetch on mount and on interval
  useEffect(() => {
    refetch();
    const intervalId = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [refetch]);
  
  // Ensure we have an array even if the fetched data is undefined
  const tanksData = Array.isArray(tanks) ? tanks : [];

  // Create action buttons
  const actionButtons = (
    <div className="flex items-center gap-3">
      <Button variant="outline" onClick={() => setIsEditingLevels(true)}>
        <Gauge className="mr-2 h-4 w-4" />
        Edit Levels
      </Button>
      <Button onClick={() => setIsAddingTank(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add New Tank
      </Button>
    </div>
  );

  // Use useEffect to handle action rendering to avoid state updates during render
  useEffect(() => {
    if (onRenderAction) {
      onRenderAction(actionButtons);
    }
  }, [isAddingTank, isEditingLevels, onRenderAction]);

  return (
    <div className="space-y-6">
      <TankList 
        tanks={tanksData}
        isLoading={isLoading}
        isEditMode={isEditingLevels}
        onEditComplete={() => {
          setIsEditingLevels(false);
          refetch();
        }}
      />

      <TankForm 
        isOpen={isAddingTank}
        onOpenChange={(open) => setIsAddingTank(open)}
        onTankAdded={() => {
          refetch();
        }}
      />
    </div>
  );
}
