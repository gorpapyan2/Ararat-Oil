import React, { useEffect } from "react";
import { FuelSuppliesTable } from "./FuelSuppliesTable";
import { FuelSuppliesSummary } from "./summary/FuelSuppliesSummary";
import { Button } from "@/core/components/ui/button";
import { Plus } from "lucide-react";
import { useFuelSupplies } from "../hooks/useFuelSupplies";

interface FuelSuppliesManagerStandardizedProps {
  onRenderAction?: (action: React.ReactNode) => void;
}

export function FuelSuppliesManagerStandardized({
  onRenderAction,
}: FuelSuppliesManagerStandardizedProps) {
  // Fetch fuel supplies data
  const { supplies, isLoading, error } = useFuelSupplies();

  // Set up the action button
  useEffect(() => {
    if (onRenderAction) {
      onRenderAction(
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Fuel Supply
        </Button>
      );
    }

    // Cleanup function
    return () => {
      if (onRenderAction) {
        onRenderAction(null);
      }
    };
  }, [onRenderAction]);

  // Mock handlers for table actions
  const handleEdit = (supply: FuelSupply) => {
    console.log("Edit fuel supply:", supply.id);
  };

  const handleDelete = (supply: FuelSupply) => {
    console.log("Delete fuel supply:", supply.id);
  };

  return (
    <div className="space-y-6">
      <FuelSuppliesSummary 
        supplies={supplies || []}
        loading={isLoading}
      />
      <FuelSuppliesTable 
        data={supplies || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
} 