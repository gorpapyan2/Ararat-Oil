import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { IconUsers, IconUserPlus } from "@tabler/icons-react";

// Import our custom UI components
import { PageHeader } from "@/core/components/ui/page-header";
import { CreateButton } from "@/core/components/ui/create-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";

// Import our specialized data table component
import { EmployeesTableStandardized } from "@/features/employees/components/EmployeesTableStandardized";
import { type Employee as EmployeeFeature } from "@/features/employees/types/employees.types";
import { type EmployeeFormValues } from "@/features/employees/components/EmployeeDialogStandardized";

// Import employee-related components and services
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/services/employees";
import { Employee } from "@/types";
import { EmployeeDialogStandardized } from "@/features/employees/components/EmployeeDialogStandardized";
import { useToast } from "@/hooks";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import {
  apiNamespaces,
  getApiErrorMessage,
  getApiSuccessMessage,
  getApiActionLabel,
} from "@/i18n/i18n";
import { EmployeeManager } from "@/features/employees/components/EmployeeManager";

// Create a function to convert between Employee types
function convertToFeatureEmployee(employee: Employee): EmployeeFeature {
  return {
    id: employee.id,
    first_name: employee.name.split(" ")[0] || "",
    last_name: employee.name.split(" ")[1] || "",
    email: employee.contact,
    phone: "", // Not available in the global Employee type
    position: employee.position,
    department: "", // Not available in the global Employee type
    hire_date: employee.hire_date,
    salary: employee.salary,
    status: employee.status,
    notes: "", // Not available in the global Employee type
    created_at: employee.created_at,
    updated_at: employee.created_at, // Not available in the global Employee type
  };
}

// Create a type for create employee request that matches the API expectations
interface CreateEmployeeRequest {
  name: string;
  position: string;
  contact: string;
  salary: number;
  hire_date: string;
  status: "active" | "inactive" | "on_leave";
}

// Convert form data to the format expected by createEmployee API
function convertFormToCreateRequest(
  data: EmployeeFormValues
): CreateEmployeeRequest {
  return {
    name: `${data.first_name} ${data.last_name}`,
    position: data.position,
    contact: data.email || "",
    salary: data.salary || 0,
    hire_date: data.hire_date || new Date().toISOString(),
    status: data.status,
  };
}

export function EmployeesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for dialog and employee selection
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // Fetch employees data
  const { data: employeesData = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () => fetchEmployees(),
  });

  // Convert employees to the feature type - handle potential type mismatches with a type assertion
  const employees = useMemo(
    () =>
      (employeesData as Employee[]).map((emp) => convertToFeatureEmployee(emp)),
    [employeesData]
  );

  // Mutations for CRUD operations with optimistic updates and proper error handling
  const createMutation = useMutation({
    mutationFn: (data: EmployeeFormValues) => {
      // Convert form data to the format expected by the API
      const createRequest = convertFormToCreateRequest(data);
      return createEmployee(createRequest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsDialogOpen(false);
      toast({
        title: t("employees.success"),
        description: getApiSuccessMessage(
          apiNamespaces.employees,
          "create",
          "employee"
        ),
      });
    },
    onError: (error) => {
      console.error("Error creating employee:", error);
      toast({
        title: t("employees.error"),
        description: getApiErrorMessage(
          apiNamespaces.employees,
          "create",
          "employee"
        ),
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; data: EmployeeFormValues }) => {
      // Convert form data to the format expected by the API
      const updateRequest = {
        id: params.id,
        ...convertFormToCreateRequest(params.data),
      };
      return updateEmployee(params.id, updateRequest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsDialogOpen(false);
      toast({
        title: t("employees.success"),
        description: getApiSuccessMessage(
          apiNamespaces.employees,
          "update",
          "employee"
        ),
      });
    },
    onError: (error) => {
      console.error("Error updating employee:", error);
      toast({
        title: t("employees.error"),
        description: getApiErrorMessage(
          apiNamespaces.employees,
          "update",
          "employee"
        ),
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: t("employees.success"),
        description: getApiSuccessMessage(
          apiNamespaces.employees,
          "delete",
          "employee"
        ),
      });
    },
    onError: (error) => {
      console.error("Error deleting employee:", error);
      toast({
        title: t("employees.error"),
        description: getApiErrorMessage(
          apiNamespaces.employees,
          "delete",
          "employee"
        ),
        variant: "destructive",
      });
    },
  });

  // Set up breadcrumbs
  usePageBreadcrumbs({
    segments: [
      {
        name: t("navigation.employees"),
        href: "/employees",
        icon: <IconUsers className="h-4 w-4" />,
        isCurrent: true,
      },
    ],
    title: t("employees.title", "Employees"),
  });

  // Event handlers
  const handleCreateEmployee = useCallback(
    async (data: EmployeeFormValues) => {
      createMutation.mutate(data);
      return true;
    },
    [createMutation]
  );

  const handleUpdateEmployee = useCallback(
    async (data: EmployeeFormValues) => {
      if (selectedEmployee) {
        updateMutation.mutate({ id: selectedEmployee.id, data });
      }
      return true;
    },
    [selectedEmployee, updateMutation]
  );

  const handleDeleteEmployee = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const handleEditEmployee = useCallback((employee: EmployeeFeature) => {
    // Convert back to the global Employee type for the dialog
    const globalEmployee: Employee = {
      id: employee.id,
      name: `${employee.first_name} ${employee.last_name}`,
      position: employee.position,
      contact: employee.email,
      salary: employee.salary,
      hire_date: employee.hire_date,
      status: employee.status,
      created_at: employee.created_at,
    };
    setSelectedEmployee(globalEmployee);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedEmployee(null);
  }, []);

  const handleOpenCreateDialog = useCallback(() => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  }, []);

  // Convert selected employee to feature Employee type for editing
  const selectedEmployeeForDialog = useMemo((): EmployeeFeature | undefined => {
    if (!selectedEmployee) return undefined;
    
    return convertToFeatureEmployee(selectedEmployee);
  }, [selectedEmployee]);

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="my-4">
        <PageHeader
          title={t("employees.title", "Employees")}
          description={t(
            "employees.description",
            "Manage employee information and records"
          )}
        >
          <CreateButton
            onClick={handleOpenCreateDialog}
            icon={<IconUserPlus className="h-4 w-4" />}
            label={getApiActionLabel(apiNamespaces.employees, "create")}
          />
        </PageHeader>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            {t("employees.list.title", "Employee List")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeesTableStandardized
            employees={employees}
            isLoading={isLoading}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
          />
        </CardContent>
      </Card>

      <EmployeeDialogStandardized
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        onSubmit={selectedEmployee ? handleUpdateEmployee : handleCreateEmployee}
        employee={selectedEmployeeForDialog}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
} 