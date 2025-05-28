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

export default function EmployeesNew() {
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

  // Handle actions
  const handleAdd = useCallback(() => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  }, []);

  // Handler for feature employee type
  const handleEditFeature = useCallback(
    (employee: EmployeeFeature) => {
      // Find the original employee from our data
      const originalEmployee = employeesData.find((e) => e.id === employee.id);
      if (originalEmployee) {
        // Use type assertion to address type incompatibility between different Employee types
        setSelectedEmployee(originalEmployee as unknown as Employee);
        setIsDialogOpen(true);
      }
    },
    [employeesData]
  );

  // Handler for standard employee type
  const handleEdit = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  }, []);

  const handleView = useCallback((employee: Employee) => {
    // Implement view functionality
    console.log("Viewing employee:", employee);
  }, []);

  // Handler for feature employee type
  const handleViewFeature = useCallback(
    (employee: EmployeeFeature) => {
      // Find the original employee from our data
      const originalEmployee = employeesData.find((e) => e.id === employee.id);
      if (originalEmployee) {
        console.log("Viewing employee:", originalEmployee);
      }
    },
    [employeesData]
  );

  const handleDelete = useCallback(
    (employee: Employee) => {
      if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
        deleteMutation.mutate(employee.id);
      }
    },
    [deleteMutation]
  );

  // Handler for feature employee type
  const handleDeleteFeature = useCallback(
    (id: string) => {
      // Find the original employee from our data
      const employee = employeesData.find((e) => e.id === id);
      if (
        employee &&
        window.confirm(`Are you sure you want to delete ${employee.name}?`)
      ) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation, employeesData]
  );

  // Calculate metrics
  const totalEmployees = employeesData.length;
  const activeEmployees = employeesData.filter(
    (emp) => emp.status === "active"
  ).length;
  const onLeaveEmployees = employeesData.filter(
    (emp) => emp.status === "on_leave"
  ).length;

  // Extract unique positions for filtering
  const uniquePositions = useMemo(() => {
    return Array.from(new Set(employeesData.map((emp) => emp.position)))
      .filter(Boolean)
      .sort();
  }, [employeesData]);

  // Create position categories for filter
  const positionCategories = useMemo(() => {
    return uniquePositions.map((position) => ({
      id: position,
      name: position,
    }));
  }, [uniquePositions]);

  // Handle save
  const handleSave = useCallback(
    async (formData: EmployeeFormValues): Promise<boolean> => {
      try {
        if (selectedEmployee?.id) {
          await updateMutation.mutateAsync({
            id: selectedEmployee.id,
            data: formData,
          });
        } else {
          await createMutation.mutateAsync(formData);
        }
        return true;
      } catch (error) {
        console.error("Error saving employee:", error);
        return false;
      }
    },
    [updateMutation, createMutation, selectedEmployee]
  );

  const breadcrumbSegments = useMemo(
    () => [
      { name: "Dashboard", href: "/" },
      { name: "Employees", href: "/employees", isCurrent: true },
    ],
    []
  );

  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: "Employees",
  });

  // Get translated page title and description using the API translation helpers
  const pageTitle =
    t("employees.title") || getApiActionLabel(apiNamespaces.employees, "list");
  const pageDescription =
    t("employees.subtitle") || "Manage employee information";

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader className="mb-6">
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>
        <div className="flex justify-end">
          <CreateButton onClick={handleAdd}>
            <IconUserPlus className="mr-2 h-4 w-4" />
            {t("employees.add")}
          </CreateButton>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-primary/10 p-4 rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("employees.total_employees")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <IconUsers className="h-6 w-6 mr-2" />
              <span className="text-2xl font-bold">{totalEmployees}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-success/10 p-4 rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("employees.active_employees")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <IconUsers className="h-6 w-6 mr-2" />
              <span className="text-2xl font-bold">{activeEmployees}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-warning/10 p-4 rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("employees.on_leave")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <IconUsers className="h-6 w-6 mr-2" />
              <span className="text-2xl font-bold">{onLeaveEmployees}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("employees.management")}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeesTableStandardized
            employees={employees}
            isLoading={isLoading}
            onEdit={handleEditFeature}
            onDelete={handleDeleteFeature}
            onView={handleViewFeature}
            positions={positionCategories}
          />
        </CardContent>
      </Card>

      <EmployeeDialogStandardized
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        employee={
          selectedEmployee
            ? convertToFeatureEmployee(selectedEmployee)
            : undefined
        }
        onSubmit={handleSave}
      />
    </div>
  );
}
