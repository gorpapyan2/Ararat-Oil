import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Wallet,
  CircleUser,
  Calendar,
} from "lucide-react";
import {
  FiltersShape,
  createBadgeCell,
  createDateCell,
} from "@/shared/components/unified/StandardizedDataTable";
import { ResponsiveDataTable } from "@/shared/components/unified/ResponsiveDataTable";
import { Badge } from "@/core/components/ui/primitives/badge";
import type { Employee } from "../types/employees.types";
import { VisuallyHidden } from "@/core/components/ui/accessibility/visually-hidden";

interface EmployeesTableStandardizedProps {
  employees: Employee[];
  isLoading: boolean;
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: string) => void;
  onView?: (employee: Employee) => void;
  positions?: { id: string; name: string }[];
  departments?: { id: string; name: string }[];
  onFiltersChange?: (filters: FiltersShape) => void;
  totalCount?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (column: string | null, direction: "asc" | "desc") => void;
}

export function EmployeesTableStandardized({
  employees,
  isLoading,
  onEdit,
  onDelete,
  onView,
  positions = [],
  departments = [],
  onFiltersChange = () => {},
  totalCount = 0,
  onPageChange,
  onSortChange,
}: EmployeesTableStandardizedProps) {
  const { t } = useTranslation(["employees", "common"]);

  // Initial filter state
  const [filters, setFilters] = useState<FiltersShape>({
    searchTerm: "",
    status: "all",
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: FiltersShape) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Get status badge variant
  const getStatusBadgeVariant = useCallback((status?: string) => {
    if (!status) return "outline";

    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "on_leave":
        return "warning";
      case "inactive":
        return "secondary";
      default:
        return "outline";
    }
  }, []);

  // Format status text
  const formatStatus = useCallback(
    (status?: string) => {
      if (!status) return "Unknown";

      switch (status.toLowerCase()) {
        case "active":
          return t("employees:status.active", "Active");
        case "on_leave":
          return t("employees:status.onLeave", "On Leave");
        case "inactive":
          return t("employees:status.inactive", "Inactive");
        default:
          return status;
      }
    },
    [t]
  );

  // Handle edit with full employee object
  const handleEdit = useCallback(
    (id: string) => {
      if (onEdit) {
        const employee = employees.find((emp) => emp.id === id);
        if (employee) {
          onEdit(employee);
        }
      }
    },
    [employees, onEdit]
  );

  // Handle view with full employee object
  const handleRowClick = useCallback(
    (employee: Employee) => {
      if (onView) {
        onView(employee);
      }
    },
    [onView]
  );

  // Format employee name
  const formatEmployeeName = useCallback((employee: Employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  }, []);

  // Define columns for the StandardizedDataTable
  const columns = useMemo(
    () => [
      {
        header: t("employees:fields.name"),
        accessorKey: "id" as keyof Employee,
        cell: (_value: string, row: Employee) => (
          <div className="flex items-center gap-2" role="cell">
            <User
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="font-medium">{formatEmployeeName(row)}</span>
          </div>
        ),
        enableSorting: true,
        meta: {
          ariaLabel: t("employees:aria.sortByName", "Sort by name"),
        },
      },
      {
        header: t("employees:fields.position"),
        accessorKey: "position" as keyof Employee,
        cell: (value: string) => (
          <div className="flex items-center gap-2" role="cell">
            <Briefcase
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span>{value || t("common:notAvailable")}</span>
          </div>
        ),
        enableSorting: true,
        meta: {
          ariaLabel: t("employees:aria.sortByPosition", "Sort by position"),
        },
      },
      {
        header: t("employees:fields.department"),
        accessorKey: "department" as keyof Employee,
        cell: (value: string) => (
          <div className="flex items-center gap-2" role="cell">
            <Mail
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span>{value || t("common:notAvailable")}</span>
          </div>
        ),
        enableSorting: true,
        meta: {
          ariaLabel: t("employees:aria.sortByDepartment", "Sort by department"),
        },
      },
      {
        header: t("employees:fields.hireDate"),
        accessorKey: "hire_date" as keyof Employee,
        cell: (value: string) => (
          <div className="flex items-center gap-2" role="cell">
            <Calendar
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span>
              {value ? format(new Date(value), "PP") : t("common:notAvailable")}
            </span>
            {value && (
              <VisuallyHidden>{format(new Date(value), "PPPP")}</VisuallyHidden>
            )}
          </div>
        ),
        enableSorting: true,
        meta: {
          ariaLabel: t("employees:aria.sortByHireDate", "Sort by hire date"),
        },
      },
      {
        header: t("employees:fields.email"),
        accessorKey: "email" as keyof Employee,
        cell: (value: string) => (
          <div className="flex items-center gap-2" role="cell">
            <Mail
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span>{value || t("common:notAvailable")}</span>
          </div>
        ),
        enableSorting: true,
        meta: {
          ariaLabel: t("employees:aria.sortByEmail", "Sort by email"),
        },
      },
      {
        header: t("employees:fields.phone"),
        accessorKey: "phone" as keyof Employee,
        cell: (value: string) => (
          <div className="flex items-center gap-2" role="cell">
            <Phone
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span>{value || t("common:notAvailable")}</span>
          </div>
        ),
        enableSorting: true,
        meta: {
          ariaLabel: t("employees:aria.sortByPhone", "Sort by phone"),
        },
      },
      {
        header: t("employees:fields.salary"),
        accessorKey: "salary" as keyof Employee,
        cell: (value: number) => (
          <div className="flex items-center gap-2 justify-end" role="cell">
            <Wallet
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="font-medium tabular-nums">
              {value ? value.toLocaleString() + " ֏" : t("common:notAvailable")}
            </span>
            {value && (
              <VisuallyHidden>
                {t("employees:aria.salary", "{{amount}} Armenian Dram", {
                  amount: value.toLocaleString(),
                })}
              </VisuallyHidden>
            )}
          </div>
        ),
        enableSorting: true,
        meta: {
          ariaLabel: t("employees:aria.sortBySalary", "Sort by salary"),
        },
      },
      {
        header: t("employees:fields.status"),
        accessorKey: "status" as keyof Employee,
        cell: (value: string) => (
          <div className="flex items-center gap-2" role="cell">
            <CircleUser
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Badge variant={getStatusBadgeVariant(value)}>
              {formatStatus(value)}
            </Badge>
          </div>
        ),
        enableSorting: true,
        meta: {
          ariaLabel: t("employees:aria.sortByStatus", "Sort by status"),
        },
      },
    ],
    [t, formatStatus, getStatusBadgeVariant, formatEmployeeName]
  );

  const isServerSide = Boolean(onPageChange && onSortChange);

  // Function to extract plain text data for screen readers
  const getAccessibleRowData = useCallback(
    (employee: Employee) => {
      return {
        name: formatEmployeeName(employee),
        position: employee.position || t("common:notAvailable"),
        department: employee.department || t("common:notAvailable"),
        hireDate: employee.hire_date
          ? format(new Date(employee.hire_date), "PP")
          : t("common:notAvailable"),
        email: employee.email || t("common:notAvailable"),
        phone: employee.phone || t("common:notAvailable"),
        salary: employee.salary
          ? `${employee.salary.toLocaleString()} ֏`
          : t("common:notAvailable"),
        status: formatStatus(employee.status),
      };
    },
    [formatEmployeeName, formatStatus, t]
  );

  return (
    <ResponsiveDataTable
      title={t("employees:title")}
      columns={columns}
      data={employees}
      loading={isLoading}
      onEdit={onEdit ? handleEdit : undefined}
      onDelete={onDelete}
      onRowClick={onView ? handleRowClick : undefined}
      filters={filters}
      onFilterChange={handleFilterChange}
      totalRows={totalCount}
      serverSide={isServerSide}
      onPageChange={onPageChange}
      onSortChange={onSortChange}
      exportOptions={{
        enabled: true,
        filename: "employees-export",
        exportAll: true,
      }}
      aria-label={t(
        "employees:aria.employeesTable",
        "Employees table with sortable columns"
      )}
      getRowAriaLabel={(employee) => {
        const data = getAccessibleRowData(employee);
        return t(
          "employees:aria.employeeRow",
          "{{name}}, Position: {{position}}, Department: {{department}}, Status: {{status}}",
          data
        );
      }}
      keyboardNavigation={{
        enabled: true,
        rowFocusKey: "id",
        onKeyDown: (e, row) => {
          // Handle Enter key for opening employee details
          if (e.key === "Enter" && onView) {
            handleRowClick(row);
          }
          // Handle Edit with E key
          if (e.key === "e" && onEdit) {
            handleEdit(row.id);
          }
          // Handle Delete with Delete key
          if (
            e.key === "Delete" &&
            onDelete &&
            window.confirm(
              t(
                "employees:confirmDelete",
                "Are you sure you want to delete this employee?"
              )
            )
          ) {
            onDelete(row.id);
          }
        },
      }}
    />
  );
}
