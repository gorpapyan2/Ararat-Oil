
// Only renders TankManager now
import { TankManager } from "@/components/tanks/TankManager";

export default function Inventory() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <TankManager />
    </div>
  );
}
