
import { useState } from "react";
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
  });

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
