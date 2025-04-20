
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FuelSuppliesHeaderProps {
  onAdd: () => void;
}

export function FuelSuppliesHeader({ onAdd }: FuelSuppliesHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-card p-6 rounded-lg shadow-sm mb-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Fuel Supplies</h2>
        <p className="text-sm text-muted-foreground">
          Manage fuel supplies and deliveries
        </p>
      </div>
      <Button onClick={onAdd} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Supply
      </Button>
    </div>
  );
}
