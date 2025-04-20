
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDailyInventoryRecords, fetchFuelTanks, fetchEmployees } from "@/services/supabase";
import { InventoryHeader } from "./inventory/InventoryHeader";
import { InventoryTable } from "./inventory/InventoryTable";
import { InventoryForm } from "./inventory/InventoryForm";

export function DailyInventory() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  
  const { data: records, isLoading: isLoadingRecords } = useQuery({
    queryKey: ['daily-inventory', selectedDate.toISOString().split('T')[0]],
    queryFn: () => fetchDailyInventoryRecords(selectedDate.toISOString().split('T')[0]),
  });

  const { data: tanks } = useQuery({
    queryKey: ['fuel-tanks'],
    queryFn: fetchFuelTanks,
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  return (
    <div className="space-y-6">
      <InventoryHeader
        selectedDate={selectedDate}
        onDateChange={(date) => date && setSelectedDate(date)}
        onAddRecord={() => setIsAddingRecord(true)}
      />

      <InventoryTable 
        records={records || []} 
        isLoading={isLoadingRecords} 
      />

      <InventoryForm
        isOpen={isAddingRecord}
        onOpenChange={setIsAddingRecord}
        selectedDate={selectedDate}
        tanks={tanks}
        employees={employees}
      />
    </div>
  );
}
