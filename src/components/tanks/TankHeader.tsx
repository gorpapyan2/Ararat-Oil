import { Plus, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TankHeaderProps {
  onAddNew: () => void;
  onEditLevels: () => void;
}

export function TankHeader({ onAddNew, onEditLevels }: TankHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fuel Tanks</h1>
        <p className="text-muted-foreground mt-1">
          Manage your fuel tanks and their current levels
        </p>
      </div>
      <div className="flex items-center gap-3 mt-4 sm:mt-0">
        <Button variant="outline" onClick={onEditLevels}>
          <Gauge className="mr-2 h-4 w-4" />
          Edit Levels
        </Button>
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Tank
        </Button>
      </div>
    </div>
  );
}
