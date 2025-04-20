
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDailyInventoryRecords } from "@/services/supabase";
import { InventoryHeader } from "./inventory/InventoryHeader";
import { InventoryTable } from "./inventory/InventoryTable";
import { useNavigate } from "react-router-dom";

export function DailyInventory() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();
  
  const { data: records, isLoading: isLoadingRecords } = useQuery({
    queryKey: ['daily-inventory', selectedDate.toISOString().split('T')[0]],
    queryFn: () => fetchDailyInventoryRecords(selectedDate.toISOString().split('T')[0]),
  });

  return (
    <div className="space-y-6">
      <InventoryHeader
        selectedDate={selectedDate}
        onDateChange={(date) => date && setSelectedDate(date)}
        onAddRecord={() => navigate('/inventory/new')}
      />

      <InventoryTable 
        records={records || []} 
        isLoading={isLoadingRecords} 
      />
    </div>
  );
}
