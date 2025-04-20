
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FillingSystemHeaderProps {
  onAddNew: () => void;
}

export function FillingSystemHeader({ onAddNew }: FillingSystemHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Filling Systems</h1>
      <Button onClick={onAddNew}>
        <Plus className="w-4 h-4 mr-2" />
        Add New System
      </Button>
    </div>
  );
}
