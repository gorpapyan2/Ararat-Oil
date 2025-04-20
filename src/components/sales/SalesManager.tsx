
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SalesHeader } from "./SalesHeader";
import { SalesTable } from "./SalesTable";
import { fetchSales } from "@/services/sales";

export function SalesManager() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: sales, isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: fetchSales,
  });

  return (
    <div className="space-y-6">
      <SalesHeader 
        selectedDate={selectedDate}
        onDateChange={(date) => date && setSelectedDate(date)}
      />
      <SalesTable sales={sales || []} isLoading={isLoading} />
    </div>
  );
}
