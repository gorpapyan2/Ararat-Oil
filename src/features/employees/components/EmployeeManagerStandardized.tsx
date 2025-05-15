import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useEmployees } from '../hooks/useEmployees';
import { EmployeeDialogStandardized } from './EmployeeDialogStandardized';
import { DeleteConfirmDialogStandardized } from './DeleteConfirmDialogStandardized';
import { EmployeesTable } from './EmployeesTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import type { Employee, EmployeeFormData } from '../types/employees.types';

interface EmployeeManagerStandardizedProps {
  onRenderAction?: (action: React.ReactNode) => void;
}

export function EmployeeManagerStandardized({ onRenderAction }: EmployeeManagerStandardizedProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState<string>('');
  const [status, setStatus] = useState<Employee['status'] | ''>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const {
    employees,
    isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees({
    searchQuery,
    department: department || undefined,
    status: status || undefined,
  });

  const handleAddEmployee = useCallback(async (data: EmployeeFormData) => {
    try {
      await createEmployee.mutateAsync(data);
      setIsAddDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('employees.employee_added'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('employees.error_adding_employee'),
        variant: 'destructive',
      });
    }
  }, [createEmployee, toast, t]);

  const handleEditEmployee = useCallback(async (data: EmployeeFormData) => {
    if (!selectedEmployee) return;

    try {
      await updateEmployee.mutateAsync({ id: selectedEmployee.id, data });
      setIsAddDialogOpen(false);
      setSelectedEmployee(null);
      toast({
        title: t('common.success'),
        description: t('employees.employee_updated'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('employees.error_updating_employee'),
        variant: 'destructive',
      });
    }
  }, [updateEmployee, selectedEmployee, toast, t]);

  const handleDeleteEmployee = useCallback(async () => {
    if (!selectedEmployee) return;

    try {
      await deleteEmployee.mutateAsync(selectedEmployee.id);
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
      toast({
        title: t('common.success'),
        description: t('employees.employee_deleted'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('employees.error_deleting_employee'),
        variant: 'destructive',
      });
    }
  }, [deleteEmployee, selectedEmployee, toast, t]);

  const handleEdit = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setIsAddDialogOpen(true);
  }, []);

  const handleDelete = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  }, []);

  const actionElement = (
    <Button onClick={() => setIsAddDialogOpen(true)}>
      <Plus className="mr-2 h-4 w-4" />
      {t('employees.add_employee')}
    </Button>
  );

  if (onRenderAction) {
    onRenderAction(actionElement);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('employees.search_employees')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px]"
            />
          </div>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t('employees.all_departments')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('employees.all_departments')}</SelectItem>
              <SelectItem value="Sales">{t('employees.department_sales')}</SelectItem>
              <SelectItem value="Operations">{t('employees.department_operations')}</SelectItem>
              <SelectItem value="Finance">{t('employees.department_finance')}</SelectItem>
              <SelectItem value="HR">{t('employees.department_hr')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(value) => setStatus(value as Employee['status'] | '')}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t('employees.all_statuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('employees.all_statuses')}</SelectItem>
              <SelectItem value="active">{t('employees.status_active')}</SelectItem>
              <SelectItem value="inactive">{t('employees.status_inactive')}</SelectItem>
              <SelectItem value="on_leave">{t('employees.status_on_leave')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {!onRenderAction && actionElement}
      </div>

      <EmployeesTable
        employees={employees}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EmployeeDialogStandardized
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={selectedEmployee ? handleEditEmployee : handleAddEmployee}
        employee={selectedEmployee || undefined}
        isLoading={createEmployee.isPending || updateEmployee.isPending}
      />

      {selectedEmployee && (
        <DeleteConfirmDialogStandardized
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteEmployee}
          employee={selectedEmployee}
          isLoading={deleteEmployee.isPending}
        />
      )}
    </div>
  );
} 