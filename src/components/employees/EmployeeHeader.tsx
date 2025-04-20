
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeHeaderProps {
  onAdd: () => void;
}

export function EmployeeHeader({ onAdd }: EmployeeHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Employees</h1>
        <p className="text-muted-foreground">Manage your employees and their details</p>
      </div>
      <Button onClick={onAdd}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add Employee
      </Button>
    </div>
  );
}
