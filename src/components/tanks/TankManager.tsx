
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFuelTanks } from "@/services/supabase";
import { fetchInventory } from "@/services/inventory";
import { TankHeader } from "./TankHeader";
import { TankList } from "./TankList";
import { TankForm } from "./TankForm";

export function TankManager() {
  const [isAddingTank, setIsAddingTank] = useState(false);
  const [isEditingLevels, setIsEditingLevels] = useState(false);

  // Fetch tanks
  const { data: tanks, isLoading: isLoadingTanks, refetch } = useQuery({
    queryKey: ['fuel-tanks'],
    queryFn: fetchFuelTanks,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always"
  });

  // Fetch inventory
  const { data: inventory, isLoading: isLoadingInventory, error: inventoryError, refetch: refetchInventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always"
  });

  // Refetch both on mount and on interval
  useEffect(() => {
    refetch();
    refetchInventory();
    const intervalId = setInterval(() => {
      refetch();
      refetchInventory();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [refetch, refetchInventory]);

  // Handle loading and error states
  const isLoading = isLoadingTanks || isLoadingInventory;
  const tanksData = tanks || [];
  const inventoryData = inventory || [];

  return (
    <div className="space-y-6">
      <TankHeader 
        onAddNew={() => setIsAddingTank(true)}
        onEditLevels={() => setIsEditingLevels(true)}
      />

      <TankList 
        tanks={tanksData}
        inventory={inventoryData}
        isLoading={isLoading}
        isEditMode={isEditingLevels}
        onEditComplete={() => {
          setIsEditingLevels(false);
          refetch();
          refetchInventory();
        }}
      />

      <TankForm 
        isOpen={isAddingTank}
        onOpenChange={(open) => setIsAddingTank(open)}
        onTankAdded={() => {
          refetch();
          refetchInventory();
        }}
      />
      {inventoryError && (
        <div className="text-red-500 text-sm mt-2">Error loading inventory: {inventoryError.message}</div>
      )}
    </div>
  );
}
