import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Employee } from '../types/employees.types';

interface EmployeesTableProps {
  employees: Employee[];
  isLoading?: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeesTable({
  employees,
  isLoading,
  onEdit,
  onDelete,
}: EmployeesTableProps) {
  const { t } = useTranslation();

  const getStatusBadge = (status: Employee['status']) => {
    const variants = {
      active: 'success',
      inactive: 'destructive',
      on_leave: 'warning',
    } as const;

    const labels = {
      active: t('employees.status_active'),
      inactive: t('employees.status_inactive'),
      on_leave: t('employees.status_on_leave'),
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('employees.name')}</TableHead>
              <TableHead>{t('employees.position')}</TableHead>
              <TableHead>{t('employees.department')}</TableHead>
              <TableHead>{t('employees.email')}</TableHead>
              <TableHead>{t('employees.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {t('common.loading')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('employees.name')}</TableHead>
              <TableHead>{t('employees.position')}</TableHead>
              <TableHead>{t('employees.department')}</TableHead>
              <TableHead>{t('employees.email')}</TableHead>
              <TableHead>{t('employees.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {t('employees.no_employees')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('employees.name')}</TableHead>
            <TableHead>{t('employees.position')}</TableHead>
            <TableHead>{t('employees.department')}</TableHead>
            <TableHead>{t('employees.email')}</TableHead>
            <TableHead>{t('employees.status')}</TableHead>
            <TableHead className="text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                {employee.first_name} {employee.last_name}
              </TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{getStatusBadge(employee.status)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(employee)}
                >
                  {t('common.edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(employee)}
                >
                  {t('common.delete')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 