
import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  IconUsers,
  IconUserPlus,
} from "@tabler/icons-react";

// Import our custom UI components
import { PageHeader } from "@/components/ui/page-header";
import { CreateButton } from "@/components/ui/create-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MetricCard } from "@/components/ui/composed/cards";

// Import our specialized data table component
import { EmployeesTable } from "@/components/employees/EmployeesTable";

// Import employee-related components and services
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/services/employees";
import { Employee, EmployeeStatus } from "@/types";
import { EmployeeDialogStandardized } from "@/components/employees/EmployeeDialogStandardized";
import { useToast } from "@/hooks";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

export default function EmployeesNew() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for dialog and employee selection
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  // Fetch employees data with proper typing
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () => fetchEmployees(),
  });

  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
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
      queryClient.invalidateQueries({ queryKey: ["employees"] });
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
      queryClient.invalidateQueries({ queryKey: ["employees"] });
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
  const handleAdd = useCallback(() => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  }, []);

  const handleEdit = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  }, []);

  const handleView = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  // Calculate metrics with proper typing
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (emp: Employee) => emp.status === "active",
  ).length;
  const onLeaveEmployees = employees.filter(
    (emp: Employee) => emp.status === "on_leave",
  ).length;

  // Extract unique positions for filtering
  const uniquePositions = useMemo(() => {
    return Array.from(new Set(employees.map((emp: Employee) => emp.position)))
      .filter(Boolean)
      .sort();
  }, [employees]);

  // Create position categories for filter
  const positionCategories = useMemo(() => {
    return uniquePositions.map((position: string) => ({
      id: position,
      name: position,
    }));
  }, [uniquePositions]);

  // Handle save
  const handleSave = useCallback(
    (data: any) => {
      if (selectedEmployee?.id) {
        updateMutation.mutate({
          id: selectedEmployee.id,
          data,
        });
      } else {
        createMutation.mutate(data);
      }
    },
    [selectedEmployee, updateMutation, createMutation],
  );

  const breadcrumbSegments = useMemo(() => [
    { name: "Dashboard", href: "/" },
    { name: "Employees", href: "/employees", isCurrent: true }
  ], []);

  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: "Employees"
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title={t("employees.title")}
        description={t("employees.subtitle")}
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
