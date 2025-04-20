
import { DailyInventory } from "@/components/DailyInventory";
import { TankManager } from "@/components/tanks/TankManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Inventory() {
  // Store active tab to ensure correct data is refreshed when user switches tabs
  const [activeTab, setActiveTab] = useState("inventory");
  const queryClient = useQueryClient();
  
  // Refresh data when the component mounts or when returning to this page
  useEffect(() => {
    // Force refresh tank data when the page loads
    queryClient.invalidateQueries({ queryKey: ['fuel-tanks'] });
  }, [queryClient]);
  
  return (
    <div className="max-w-[1600px] mx-auto">
      <Tabs 
        defaultValue="inventory" 
        className="space-y-6"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="inventory">Daily Inventory</TabsTrigger>
          <TabsTrigger value="tanks">Fuel Tanks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="mt-6">
          <DailyInventory />
        </TabsContent>
        
        <TabsContent value="tanks" className="mt-6">
          <TankManager key={activeTab === "tanks" ? "active-tanks" : "inactive"} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
