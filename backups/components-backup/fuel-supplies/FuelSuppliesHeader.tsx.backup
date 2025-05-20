import { Button } from "@/components/ui/button";
import { Plus, Fuel } from "lucide-react";

interface FuelSuppliesHeaderProps {
  onAdd: () => void;
}

export function FuelSuppliesHeader({ onAdd }: FuelSuppliesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card sm:bg-transparent p-4 sm:p-0 rounded-lg shadow-sm sm:shadow-none mb-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-0">
        <div className="hidden sm:flex justify-center items-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
          <Fuel className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Fuel Supplies
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage fuel supplies and deliveries
          </p>
        </div>
      </div>
      <Button
        onClick={onAdd}
        className="w-full sm:w-auto gap-2 shadow-sm"
        size="sm"
        aria-label="Add new fuel supply"
      >
        <Plus className="h-4 w-4" />
        <span className="sm:inline">Add Supply</span>
      </Button>
    </div>
  );
}
