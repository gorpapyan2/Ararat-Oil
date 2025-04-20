
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Employee } from "@/services/supabase";

interface EmployeeListProps {
  employees: Employee[];
  isLoading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export function EmployeeList({ employees, isLoading, onEdit, onDelete }: EmployeeListProps) {
  if (isLoading) {
    return <div className="text-center">Loading employees...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Hire Date</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.contact}</TableCell>
              <TableCell>{new Date(employee.hire_date).toLocaleDateString()}</TableCell>
              <TableCell>${employee.salary.toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(employee)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(employee.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
