
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEmployees } from "@/services/supabase";
import { EmployeeList } from "./EmployeeList";
import { EmployeeHeader } from "./EmployeeHeader";
import { EmployeeDialog } from "./EmployeeDialog";

export function EmployeeManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees
  });

  return (
    <div className="space-y-6">
      <EmployeeHeader onAdd={() => setIsDialogOpen(true)} />
      <EmployeeList employees={employees || []} isLoading={isLoading} />
      <EmployeeDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
