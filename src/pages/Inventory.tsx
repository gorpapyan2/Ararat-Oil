
import { DailyInventory } from "@/components/DailyInventory";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Inventory() {
  const { toast } = useToast();
  
  const handleTestToast = () => {
    toast({
      title: "Toast Test",
      description: "If you can see this, toasts are working correctly!",
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="mb-4">
        <Button onClick={handleTestToast}>Test Toast</Button>
      </div>
      <DailyInventory />
    </div>
  );
}
