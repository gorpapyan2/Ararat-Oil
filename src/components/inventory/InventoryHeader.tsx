
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface InventoryHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
  onAddRecord: () => void;
}

export function InventoryHeader({ selectedDate, onDateChange, onAddRecord }: InventoryHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-card p-6 rounded-lg shadow-sm mb-6">
      <div className="flex items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Daily Inventory</h2>
          <p className="text-sm text-muted-foreground">
            Manage your fuel inventory records
          </p>
        </div>
        <div className="border rounded-md shadow-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            className="rounded-md border"
          />
        </div>
      </div>
      <Button onClick={onAddRecord} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Record
      </Button>
    </div>
  );
}
