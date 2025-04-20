
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchFuelTanks, fetchEmployees } from "@/services/supabase";
import { InventoryForm } from "@/components/inventory/InventoryForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function InventoryFormPage() {
  const navigate = useNavigate();

  const { data: tanks } = useQuery({
    queryKey: ['fuel-tanks'],
    queryFn: fetchFuelTanks,
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  return (
    <div className="max-w-[800px] mx-auto p-6">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1" 
          onClick={() => navigate('/inventory')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Button>
      </div>
      
      <div className="bg-card border rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Add Inventory Record</h1>
        
        <InventoryForm
          isOpen={true}
          onOpenChange={() => navigate('/inventory')}
          selectedDate={new Date()}
          tanks={tanks}
          employees={employees}
        />
      </div>
    </div>
  );
}
