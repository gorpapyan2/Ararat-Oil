import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { 
  IconUsers, 
  IconUserPlus,
  IconEdit,
  IconTrash
} from "@tabler/icons-react";

// Import our custom UI components
import { 
  PageHeader, 
  CreateButton 
} from "@/components/ui-custom/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui-custom/card";
import { MetricCard } from "@/components/ui-custom/data-card";

// Import unified components
import { UnifiedDataTable } from "@/components/unified/UnifiedDataTable";

// Import UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import employee-related components and services
import { 
  useQuery, 
  useMutation, 
  useQueryClient 
} from "@tanstack/react-query";
import { 
  fetchEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee 
} from "@/services/employees";
import { Employee, EmployeeStatus } from "@/types";
import { EmployeeDialog } from "@/components/employees/EmployeeDialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

export default function EmployeesNew() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for dialog and employee selection
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Unified filters state
  const [filters, setFilters] = useState({
    search: "",
    date: undefined,
    dateRange: [undefined, undefined] as [Date | undefined, Date | undefined],
    provider: "all",
    systemId: "all",
    employeeId: "all",
    quantityRange: [0, 10000] as [number, number],
    priceRange: [0, 10000] as [number, number],
    totalRange: [0, 10000000] as [number, number],
  });
  
  // Fetch employees data
  const { 
    data: employees = [], 
    isLoading 
  } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees
  });
  
  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Employee created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create employee",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) => 
      updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsDialogOpen(false);
      setSelectedEmployee(null);
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      });
    },
  });
  
  // Handle actions
  const handleAdd = () => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Handle filter changes
  const handleFiltersChange = (updates: any) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };
  
  // Calculate metrics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === "active").length;
  const onLeaveEmployees = employees.filter(emp => emp.status === "on_leave").length;
  
  // Extract unique positions for filtering
  const uniquePositions = useMemo(() => {
    return Array.from(new Set(employees.map(emp => emp.position)))
      .filter(Boolean)
      .sort();
  }, [employees]);
  
  // Create position categories for filter
  const positionCategories = useMemo(() => {
    return uniquePositions.map(position => ({
      id: position,
      name: position
    }));
  }, [uniquePositions]);
  
  // Format salary
  const formatSalary = (salary: number) => {
    return `${salary.toLocaleString()} ֏`;
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
  
  // Define table columns
  const columns: ColumnDef<Employee, any>[] = [
    {
      accessorKey: 'name',
      header: () => t('employees.name'),
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'position',
      header: () => t('employees.position'),
      cell: ({ row }) => row.getValue('position'),
    },
    {
      accessorKey: 'email',
      header: () => t('employees.email'),
      cell: ({ row }) => row.getValue('email'),
    },
    {
      accessorKey: 'phone',
      header: () => t('employees.phone'),
      cell: ({ row }) => row.getValue('phone'),
    },
    {
      accessorKey: 'salary',
      header: () => t('employees.salary'),
      cell: ({ row }) => formatSalary(row.getValue('salary')),
    },
    {
      accessorKey: 'status',
      header: () => t('employees.status'),
      cell: ({ row }) => {
        const status = row.getValue('status') as EmployeeStatus;
        return (
          <Badge variant={getStatusBadgeVariant(status)}>
            {formatStatus(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'hire_date',
      header: () => t('employees.hireDate'),
      cell: ({ row }) => format(new Date(row.getValue('hire_date')), 'MMM dd, yyyy'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={(e) => {
              e.stopPropagation();
              handleView(employee);
            }}>
              <IconUsers className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={(e) => {
              e.stopPropagation();
              handleEdit(employee);
            }}>
              <IconEdit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={(e) => {
              e.stopPropagation();
              handleDelete(employee.id);
            }}>
              <IconTrash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Summary component
  const EmployeeSummaryComponent = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <MetricCard
        title={t("employees.totalEmployees")}
        value={totalEmployees.toString()}
        icon={<IconUsers className="h-4 w-4" />}
      />
      <MetricCard
        title={t("employees.activeEmployees")}
        value={activeEmployees.toString()}
        trend={{
          value: `${Math.round((activeEmployees / totalEmployees) * 100)}%`,
          positive: true,
          label: t("employees.ofTotal")
        }}
      />
      <MetricCard
        title={t("employees.onLeave")}
        value={onLeaveEmployees.toString()}
        trend={{
          value: `${Math.round((onLeaveEmployees / totalEmployees) * 100)}%`,
          positive: false,
          label: t("employees.ofTotal")
        }}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("employees.title")}
        description={t("employees.description")}
        actions={
          <CreateButton 
            label={t("employees.addEmployee")}
            onClick={handleAdd}
            icon={<IconUserPlus className="h-4 w-4 mr-2" />}
          />
        }
      />
      
      {/* Employees Data Table with Unified Components */}
      <UnifiedDataTable
        title={t("employees.title")}
        columns={columns}
        data={employees}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(employee) => handleDelete(employee.id)}
        providers={[]}
        categories={positionCategories}
        onFiltersChange={handleFiltersChange}
        filters={filters}
        searchColumn="name"
        searchPlaceholder={t("employees.searchPlaceholder")}
        summaryComponent={EmployeeSummaryComponent}
      />
      
      {/* Employee Dialog */}
      <EmployeeDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        employee={selectedEmployee}
        onSubmit={(data) => {
          if (selectedEmployee) {
            updateMutation.mutate({ id: selectedEmployee.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
      />
    </div>
  );
}
