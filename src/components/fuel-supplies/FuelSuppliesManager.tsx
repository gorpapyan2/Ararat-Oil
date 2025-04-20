
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFuelSupplies, createFuelSupply } from "@/services/fuel-supplies";
import { FuelSuppliesHeader } from "./FuelSuppliesHeader";
import { FuelSuppliesTable } from "./FuelSuppliesTable";
import { FuelSuppliesForm } from "./FuelSuppliesForm";
import { FuelSupply } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function FuelSuppliesManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: fuelSupplies, isLoading } = useQuery({
    queryKey: ['fuel-supplies'],
    queryFn: fetchFuelSupplies
  });

  const createMutation = useMutation({
    mutationFn: createFuelSupply,
    onSuccess: () => {
      // Invalidate both fuel-supplies and fuel-tanks queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['fuel-supplies'] });
      queryClient.invalidateQueries({ queryKey: ['fuel-tanks'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Fuel supply record created successfully and tank level updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create fuel supply record: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleAdd = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <FuelSuppliesHeader onAdd={handleAdd} />
      <FuelSuppliesTable 
        fuelSupplies={fuelSupplies || []} 
        isLoading={isLoading} 
      />
      <FuelSuppliesForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={(data) => {
          createMutation.mutate(data);
        }}
      />
    </div>
  );
}
