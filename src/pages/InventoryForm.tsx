
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchFuelTanks, fetchEmployees } from "@/services/supabase";
import { InventoryForm } from "@/components/inventory/InventoryForm";

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
      <InventoryForm
        isOpen={true}
        onOpenChange={() => navigate('/inventory')}
        selectedDate={new Date()}
        tanks={tanks}
        employees={employees}
      />
    </div>
  );
}
