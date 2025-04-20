
import { TankManager } from "@/components/tanks/TankManager";

export default function Inventory() {
  // Only show Fuel Tanks with their change history
  return (
    <div className="max-w-[1600px] mx-auto">
      <TankManager />
    </div>
  );
}
