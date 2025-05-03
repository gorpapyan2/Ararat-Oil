import { useMemo, useState } from "react";
import { Employee, EmployeeStatus } from "@/types";
import { StandardizedDataTable, FiltersShape } from "@/components/unified/StandardizedDataTable";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Wallet,
  CircleUser
} from "lucide-react";

interface EmployeesTableProps {
  employees: Employee[];
  isLoading: boolean;
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: string) => void;
  onView?: (employee: Employee) => void;
  positions?: { id: string; name: string }[];
  onFiltersChange?: (filters: any) => void;
  totalCount?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (column: string | null, direction: 'asc' | 'desc') => void;
}

export function EmployeesTable({
  employees,
  isLoading,
  onEdit,
  onDelete,
  onView,
  positions = [],
  onFiltersChange = () => {},
  totalCount = 0,
  onPageChange,
  onSortChange,
}: EmployeesTableProps) {
  const [filters, setFilters] = useState<FiltersShape>({
    searchTerm: "",
    position: "all",
    status: "all",
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: FiltersShape) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: EmployeeStatus) => {
    switch (status) {
      case "active":
        return "default";
      case "on_leave":
        return "secondary";
      case "terminated":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Format status text
  const formatStatus = (status: EmployeeStatus) => {
    switch (status) {
      case "active":
        return "Active";
      case "on_leave":
        return "On Leave";
      case "terminated":
        return "Terminated";
      default:
        return status;
    }
  };

  // Format salary
  const formatSalary = (salary: number) => {
    return `${salary.toLocaleString()} ֏`;
  };

  // Define columns for the StandardizedDataTable
  const columns = useMemo(() => [
    {
      accessorKey: "name" as keyof Employee,
      header: "Name",
      cell: (value: any, row: Employee) => (
        <div className="flex items-center gap-2 py-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "position" as keyof Employee,
      header: "Position",
      cell: (value: any, row: Employee) => (
        <div className="flex items-center gap-2 py-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span>{value || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "email" as keyof Employee,
      header: "Email",
      cell: (value: any, row: Employee) => (
        <div className="flex items-center gap-2 py-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{value || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone" as keyof Employee,
      header: "Phone",
      cell: (value: any, row: Employee) => (
        <div className="flex items-center gap-2 py-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{value || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "salary" as keyof Employee,
      header: "Salary",
      cell: (value: any, row: Employee) => (
        <div className="flex items-center gap-2 py-2 justify-end">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium tabular-nums">{formatSalary(value)}</span>
        </div>
      ),
    },
    {
      accessorKey: "status" as keyof Employee,
      header: "Status",
      cell: (value: any, row: Employee) => {
        const status = value as EmployeeStatus;
        return (
          <div className="flex items-center gap-2 py-2">
            <CircleUser className="h-4 w-4 text-muted-foreground" />
            <Badge variant={getStatusBadgeVariant(status)}>
              {formatStatus(status)}
            </Badge>
          </div>
        );
      },
    },
  ], []);

  // Status filter options
  const statusOptions = [
    { id: "all", name: "All Statuses" },
    { id: "active", name: "Active" },
    { id: "on_leave", name: "On Leave" },
    { id: "terminated", name: "Terminated" }
  ];

  const isServerSide = Boolean(onPageChange && onSortChange);

  return (
    <StandardizedDataTable
      title="Employees"
      columns={columns}
      data={employees}
      loading={isLoading}
      onEdit={onEdit ? (id) => {
        const employee = employees.find(e => e.id === id);
        if (employee) onEdit(employee);
      } : undefined}
      onDelete={onDelete}
      onRowClick={onView}
      filters={filters}
      onFilterChange={handleFilterChange}
      totalRows={totalCount}
      serverSide={isServerSide}
      onPageChange={onPageChange}
      onSortChange={onSortChange}
      filterOptions={{
        position: {
          label: "Position",
          options: [
            { id: "all", name: "All Positions" },
            ...positions
          ]
        },
        status: {
          label: "Status",
          options: statusOptions
        }
      }}
      exportOptions={{
        enabled: true,
        filename: 'employees-export',
        exportAll: true
      }}
    />
  );
} 