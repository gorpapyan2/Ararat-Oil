
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FillingSystemHeader } from "./FillingSystemHeader";
import { FillingSystemList } from "./FillingSystemList";
import { FillingSystemForm } from "./FillingSystemForm";
import { fetchFillingSystems } from "@/services/filling-systems";

export function FillingSystemManager() {
  const [isAddingSystem, setIsAddingSystem] = useState(false);
  
  const { data: fillingSystems, isLoading, refetch } = useQuery({
    queryKey: ['filling-systems'],
    queryFn: fetchFillingSystems,
  });

  return (
    <div className="space-y-6">
      <FillingSystemHeader 
        onAddNew={() => setIsAddingSystem(true)}
      />

      <FillingSystemList 
        fillingSystems={fillingSystems || []} 
        isLoading={isLoading}
        onDelete={() => refetch()}
      />

      <FillingSystemForm 
        isOpen={isAddingSystem}
        onOpenChange={(open) => setIsAddingSystem(open)}
        onSuccess={() => {
          setIsAddingSystem(false);
          refetch();
        }}
      />
    </div>
  );
}
