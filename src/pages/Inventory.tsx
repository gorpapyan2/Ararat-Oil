
import { DailyInventory } from "@/components/DailyInventory";

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
      </div>
      
      <DailyInventory />
    </div>
  );
}
