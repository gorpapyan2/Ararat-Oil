import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  IconUsers,
  IconUserPlus,
} from "@tabler/icons-react";

// Import our custom UI components
import { PageHeader } from '@/core/components/ui/page-header';
import { CreateButton } from '@/core/components/ui/create-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { MetricCard } from '@/core/components/ui/composed/cards';

// Import our specialized data table component
import { EmployeesTable } from "@/features/employees/components/EmployeesTable";

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
import { apiNamespaces, getApiErrorMessage, getApiSuccessMessage, getApiActionLabel } from "@/i18n/i18n";

export default function EmployeesNew() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for dialog and employee selection
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  // Fetch employees data
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () => fetchEmployees(),
  });

  // Mutations for CRUD operations with optimistic updates and proper error handling
  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsDialogOpen(false);
      toast({
        title: t("employees.success"),
        description: getApiSuccessMessage(apiNamespaces.employees, 'create', 'employee'),
      });
    },
    onError: (error) => {
      console.error("Error creating employee:", error);
      toast({
        title: t("employees.error"),
        description: getApiErrorMessage(apiNamespaces.employees, 'create', 'employee'),
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsDialogOpen(false);
      toast({
        title: t("employees.success"),
        description: getApiSuccessMessage(apiNamespaces.employees, 'update', 'employee'),
      });
    },
    onError: (error) => {
      console.error("Error updating employee:", error);
      toast({
        title: t("employees.error"),
        description: getApiErrorMessage(apiNamespaces.employees, 'update', 'employee'),
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
        description: getApiSuccessMessage(apiNamespaces.employees, 'delete', 'employee'),
      });
    },
    onError: (error) => {
      console.error("Error deleting employee:", error);
      toast({
        title: t("employees.error"),
        description: getApiErrorMessage(apiNamespaces.employees, 'delete', 'employee'),
        variant: "destructive",
      });
    },
  });

  // Handle actions
  const handleAdd = useCallback(() => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  }, []);

  const handleEdit = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  }, []);

  const handleView = useCallback((employee: Employee) => {
    // Implement view functionality
    console.log("Viewing employee:", employee);
  }, []);

  const handleDelete = useCallback((employee: Employee) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${employee.name}?`
      )
    ) {
      deleteMutation.mutate(employee.id);
    }
  }, [deleteMutation]);

  // Calculate metrics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (emp) => emp.status === "active",
  ).length;
  const onLeaveEmployees = employees.filter(
    (emp) => emp.status === "on_leave",
  ).length;

  // Extract unique positions for filtering
  const uniquePositions = useMemo(() => {
    return Array.from(new Set(employees.map((emp) => emp.position)))
      .filter(Boolean)
      .sort();
  }, [employees]);

  // Create position categories for filter
  const positionCategories = useMemo(() => {
    return uniquePositions.map((position) => ({
      id: position,
      name: position,
    }));
  }, [uniquePositions]);

  // Handle save
  const handleSave = useCallback(
    (employee: Employee) => {
      if (employee.id) {
        updateMutation.mutate(employee);
      } else {
        createMutation.mutate(employee);
      }
    },
    [updateMutation, createMutation]
  );

  const breadcrumbSegments = useMemo(() => [
    { name: "Dashboard", href: "/" },
    { name: "Employees", href: "/employees", isCurrent: true }
  ], []);

  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: "Employees"
  });

  // Get translated page title and description using the API translation helpers
  const pageTitle = t("employees.title") || getApiActionLabel(apiNamespaces.employees, 'list');
  const pageDescription = t("employees.subtitle") || "Manage employee information";

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        actions={
          <CreateButton onClick={handleAdd}>
            <IconUserPlus className="mr-2 h-4 w-4" />
            {t("employees.add")}
          </CreateButton>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title={t("employees.total_employees")}
          value={totalEmployees}
          icon={<IconUsers className="h-6 w-6" />}
          className="bg-primary/10"
        />
        <MetricCard
          title={t("employees.active_employees")}
          value={activeEmployees}
          icon={<IconUsers className="h-6 w-6" />}
          className="bg-success/10"
        />
        <MetricCard
          title={t("employees.on_leave")}
          value={onLeaveEmployees}
          icon={<IconUsers className="h-6 w-6" />}
          className="bg-warning/10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("employees.management")}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeesTable
            employees={employees}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            positions={positionCategories}
          />
        </CardContent>
      </Card>

      <EmployeeDialogStandardized
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        employee={selectedEmployee}
        onSubmit={handleSave}
      />
    </div>
  );
}
