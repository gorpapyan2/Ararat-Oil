
import { DailyInventory } from "@/components/DailyInventory";
import { TankManager } from "@/components/tanks/TankManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Inventory() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="inventory">Daily Inventory</TabsTrigger>
          <TabsTrigger value="tanks">Fuel Tanks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="mt-6">
          <DailyInventory />
        </TabsContent>
        
        <TabsContent value="tanks" className="mt-6">
          <TankManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
