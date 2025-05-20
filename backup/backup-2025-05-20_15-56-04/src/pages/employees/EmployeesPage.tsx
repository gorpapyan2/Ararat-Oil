import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { employeeApi } from "@/core/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from '@/core/components/ui/page-header';
import { Button } from "@/core/components/ui/primitives/button";
import { 
  PlusIcon, 
  PenSquareIcon, 
  Trash2Icon, 
  AlertCircle 
} from "lucide-react";
import { BreadcrumbItem, Breadcrumbs } from '@/core/components/ui/breadcrumbs';
import { DataTable } from '@/core/components/ui/data-table';
import { EmployeeDialog } from "@/features/employees/components/EmployeeDialog";
import { ConfirmDialog } from '@/core/components/ui/confirm-dialog';
import { toast } from "sonner";
import { formatDate } from "@/shared/utils";
import { Employee } from "@/types";
import { Alert, AlertDescription, AlertTitle } from '@/core/components/ui/alert';
import { TableColumns } from '@/core/components/ui/data-table';
import { Badge } from '@/core/components/ui/badge';
import { apiNamespaces, getApiErrorMessage, getApiSuccessMessage, getApiActionLabel } from "@/i18n/i18n";

export function EmployeesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  // State for dialogs
  const [employeeDialog, setEmployeeDialog] = useState<{
    open: boolean;
    data?: Employee;
  }>({
    open: false,
  });
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    data?: Employee;
  }>({
    open: false,
  });

  // Define table columns
  const columns = useMemo<TableColumns<Employee>>(
    () => [
      {
        accessorKey: "name",
        header: t("employee.name"),
        cell: ({ row }) => row.original.name,
      },
      {
        accessorKey: "position",
        header: t("employee.position"),
        cell: ({ row }) => row.original.position,
      },
      {
        accessorKey: "contactNumber",
        header: t("employee.contactNumber"),
        cell: ({ row }) => row.original.contactNumber,
      },
      {
        accessorKey: "email",
        header: t("employee.email"),
        cell: ({ row }) => row.original.email,
      },
      {
        accessorKey: "status",
        header: t("employee.status"),
        cell: ({ row }) => (
          <Badge variant={row.original.status === "active" ? "success" : "destructive"}>
            {row.original.status === "active" 
              ? t("employee.statusActive") 
              : t("employee.statusInactive")}
          </Badge>
        ),
      },
      {
        accessorKey: "hireDate",
        header: t("employee.hireDate"),
        cell: ({ row }) => formatDate(new Date(row.original.hireDate)),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditEmployee(row.original)}
            >
              <PenSquareIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteClick(row.original)}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [t]
  );
  
  // Query for employees
  const { data, isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: () => employeeApi.getEmployees(),
  });
  
  // Create employee mutation
  const createMutation = useMutation({
    mutationFn: (employee: Omit<Employee, "id">) =>
      employeeApi.createEmployee(employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(getApiSuccessMessage(apiNamespaces.employee, 'create'));
      setEmployeeDialog({ open: false });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error 
          ? error.message 
          : getApiErrorMessage(apiNamespaces.employee, 'create')
      );
    },
  });
  
  // Update employee mutation
  const updateMutation = useMutation({
    mutationFn: (employee: Employee) =>
      employeeApi.updateEmployee(employee.id, employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(getApiSuccessMessage(apiNamespaces.employee, 'update'));
      setEmployeeDialog({ open: false });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error 
          ? error.message 
          : getApiErrorMessage(apiNamespaces.employee, 'update')
      );
    },
  });
  
  // Delete employee mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeeApi.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(getApiSuccessMessage(apiNamespaces.employee, 'delete'));
      setConfirmDialog({ open: false });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error 
          ? error.message 
          : getApiErrorMessage(apiNamespaces.employee, 'delete')
      );
    },
  });
  
  // Handler functions
  const handleAddEmployee = () => {
    setEmployeeDialog({
      open: true,
    });
  };
  
  const handleEditEmployee = (employee: Employee) => {
    setEmployeeDialog({
      open: true,
      data: employee,
    });
  };
  
  const handleDeleteClick = (employee: Employee) => {
    setConfirmDialog({
      open: true,
      data: employee,
    });
  };
  
  const handleConfirmDelete = () => {
    if (confirmDialog.data) {
      deleteMutation.mutate(confirmDialog.data.id);
    }
  };
  
  const handleSaveEmployee = (employee: Employee | Omit<Employee, "id">) => {
    if ("id" in employee) {
      updateMutation.mutate(employee as Employee);
    } else {
      createMutation.mutate(employee);
    }
  };
  
  // Memoize the breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(() => [
    { name: t("navigation.dashboard"), href: "/" },
    { name: t("navigation.employees"), href: "/employees" }
  ], [t]);

  // Get page title and description from translations
  const pageTitle = useMemo(() => t("employee.pageTitle", "Employees"), [t]);
  const pageDescription = useMemo(() => t("employee.pageDescription", "Manage station employees"), [t]);
  
  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <Breadcrumbs>
        {breadcrumbSegments.map((segment, index) => (
          <BreadcrumbItem key={index} href={segment.href}>
            {segment.name}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
      
      <div className="my-4">
        <PageHeader 
          title={pageTitle}
          description={pageDescription}
        >
          <Button onClick={handleAddEmployee}>
            <PlusIcon className="h-4 w-4 mr-2" />
            {getApiActionLabel(apiNamespaces.employee, 'create')}
          </Button>
        </PageHeader>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("common.error")}</AlertTitle>
          <AlertDescription>
            {error instanceof Error 
              ? error.message 
              : getApiErrorMessage(apiNamespaces.employee, 'fetch')}
          </AlertDescription>
        </Alert>
      )}
      
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        pagination
        noResultsMessage={t("employee.noEmployees")}
      />
      
      <EmployeeDialog
        open={employeeDialog.open}
        employee={employeeDialog.data}
        onOpenChange={(open) => setEmployeeDialog({ open })}
        onSave={handleSaveEmployee}
        title={
          employeeDialog.data
            ? t("employee.editEmployee")
            : t("employee.addEmployee")
        }
      />
      
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ open })}
        title={t("employee.confirmDelete")}
        description={t("employee.deleteConfirmation")}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
} 