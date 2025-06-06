import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { IconUsers, IconUserPlus } from "@/core/components/ui/icons";

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
import { type Employee as EmployeeFeature } from "@/features/employees/types/employees.types";

// Import employee-related components and services
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/features/employees/services";
import { Employee } from "@/features/employees/types/employees.types";
import { EmployeeDialogStandardized } from "@/features/employees/components/EmployeeDialogStandardized";
import { useToast } from "@/hooks";
import { usePageBreadcrumbs } from "@/shared/hooks/usePageBreadcrumbs";
import {
  apiNamespaces,
  getApiErrorMessage,
  getApiSuccessMessage,
} from "@/i18n/i18n";

// Create a function to convert between Employee types
function convertToFeatureEmployee(employee: Employee): EmployeeFeature {
  return {
    id: employee.id,
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    phone: employee.phone,
    position: employee.position,
    department: employee.department || "",
    hire_date: employee.hire_date,
    salary: employee.salary,
    status: employee.status,
    notes: employee.notes || "",
    created_at: employee.created_at,
    updated_at: employee.updated_at || employee.created_at,
  };
}

// Convert form data to EmployeeFormData (which the API expects)
function convertFormToEmployeeFormData(data: EmployeeFormValues) {
  return {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email || "",
    phone: data.phone || "",
    position: data.position,
    department: data.department || "",
    hire_date: data.hire_date || new Date().toISOString(),
    salary: data.salary || 0,
    status: data.status,
    notes: data.notes || "",
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
    queryFn: () => getEmployees(),
  });

  // Convert employees to the feature type - handle potential type mismatches with a type assertion
  const employees = useMemo(
    () =>
      (employeesData as Employee[]).map((emp) => convertToFeatureEmployee(emp)),
    [employeesData]
  );

  // Mutations for CRUD operations with optimistic updates and proper error handling
  const createMutation = useMutation({
    mutationFn: async (data: EmployeeFormValues) => {
      // Convert form data to the format expected by the API
      const employeeFormData = convertFormToEmployeeFormData(data);
      const result = await createEmployee(employeeFormData);
      if (!result) {
        throw new Error("Failed to create employee");
      }
      return result;
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
    mutationFn: async (params: { id: string; data: EmployeeFormValues }) => {
      // Convert form data to the format expected by the API
      const employeeFormData = convertFormToEmployeeFormData(params.data);
      const result = await updateEmployee(params.id, employeeFormData);
      if (!result) {
        throw new Error("Failed to update employee");
      }
      return result;
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
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      hire_date: employee.hire_date,
      salary: employee.salary,
      status: employee.status,
      notes: employee.notes,
      created_at: employee.created_at,
      updated_at: employee.updated_at,
    };
    setSelectedEmployee(globalEmployee);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback((open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedEmployee(null);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Section with Create Button */}
        <PageHeader
          title={t("employees.title", "Employees")}
          actions={
            <CreateButton onClick={handleOpenCreateDialog} className="bg-blue-600 hover:bg-blue-700 text-white">
              <IconUserPlus className="mr-2 h-4 w-4" />
              {t("employees.addEmployee", "Add Employee")}
            </CreateButton>
          }
          className="text-white"
        />

        {/* Summary Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800/50 backdrop-blur border border-gray-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Employees</CardTitle>
              <IconUsers className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{employees.length}</div>
              <p className="text-xs text-gray-400">
                {employees.filter((emp) => emp.status === "active").length} active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur border border-gray-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active</CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {employees.filter((emp) => emp.status === "active").length}
              </div>
              <p className="text-xs text-gray-400">
                {employees.filter((emp) => emp.status === "active").length > 0
                  ? Math.round(
                      (employees.filter((emp) => emp.status === "active").length / employees.length) * 100
                    )
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur border border-gray-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Average Salary
              </CardTitle>
              <IconUsers className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                AMD {employees.length > 0 ? Math.round(employees.reduce((total, emp) => total + emp.salary, 0) / employees.length).toLocaleString() : 0}
              </div>
              <p className="text-xs text-gray-400">
                Total: AMD {employees.reduce((total, emp) => total + emp.salary, 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Data Table */}
        <Card className="bg-gray-800/50 backdrop-blur border border-gray-700/50">
          <CardContent className="p-0">
            <EmployeesTableStandardized
              employees={employees}
              isLoading={isLoading}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          </CardContent>
        </Card>

        {/* Employee Dialog for Create/Edit */}
        <EmployeeDialogStandardized
          open={isDialogOpen}
          onOpenChange={handleCloseDialog}
          onSubmit={selectedEmployee ? handleUpdateEmployee : handleCreateEmployee}
          employee={selectedEmployeeForDialog}
        />
      </div>
    </div>
  );
} 