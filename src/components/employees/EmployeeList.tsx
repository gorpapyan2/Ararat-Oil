
import { User, Calendar, Mail, Phone, Briefcase } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee } from "@/services/supabase";

interface EmployeeListProps {
  employees: Employee[];
  isLoading: boolean;
}

export function EmployeeList({ employees, isLoading }: EmployeeListProps) {
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
