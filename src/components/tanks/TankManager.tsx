
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFuelTanks } from "@/services/supabase";
import { TankHeader } from "./TankHeader";
import { TankList } from "./TankList";
import { TankForm } from "./TankForm";

export function TankManager() {
  const [isAddingTank, setIsAddingTank] = useState(false);
  const [isEditingLevels, setIsEditingLevels] = useState(false);
  
  const { data: tanks, isLoading: isLoadingTanks, refetch } = useQuery({
    queryKey: ['fuel-tanks'],
    queryFn: fetchFuelTanks,
    // Ensure tanks data is always fresh
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always" // Always refetch when the component mounts
  });

  // Refetch on mount to ensure fresh data
  useEffect(() => {
    // Immediately refetch when the component mounts
    refetch();
    
    // Set up an interval to refetch data every few seconds when this component is visible
    const intervalId = setInterval(() => {
      refetch();
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, [refetch]);

  return (
    <div className="space-y-6">
      <TankHeader 
        onAddNew={() => setIsAddingTank(true)}
        onEditLevels={() => setIsEditingLevels(true)}
      />

      <TankList 
        tanks={tanks || []} 
        isLoading={isLoadingTanks} 
        isEditMode={isEditingLevels}
        onEditComplete={() => {
          setIsEditingLevels(false);
          refetch();
        }}
      />

      <TankForm 
        isOpen={isAddingTank}
        onOpenChange={(open) => setIsAddingTank(open)}
        onTankAdded={() => refetch()}
      />
    </div>
  );
}
