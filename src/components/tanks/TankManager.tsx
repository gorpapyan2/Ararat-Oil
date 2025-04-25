import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFuelTanks } from "@/services/tanks";
import { TankHeader } from "./TankHeader";
import { TankList } from "./TankList";
import { TankForm } from "./TankForm";

export function TankManager() {
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

  return (
    <div className="space-y-6">
      <TankHeader 
        onAddNew={() => setIsAddingTank(true)}
        onEditLevels={() => setIsEditingLevels(true)}
      />

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
