import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { StandardDialog } from '@/components/common/StandardDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Employee, EmployeeFormData } from '../types/employees.types';

const employeeSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  position: z.string().min(1, 'Position is required'),
  department: z.string().min(1, 'Department is required'),
  hire_date: z.string().min(1, 'Hire date is required'),
  salary: z.number().min(0, 'Salary must be a positive number'),
  status: z.enum(['active', 'inactive', 'on_leave']),
  notes: z.string().optional(),
});

interface EmployeeDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EmployeeFormData) => void;
  employee?: Employee;
  isLoading?: boolean;
}

export function EmployeeDialogStandardized({
  open,
  onOpenChange,
  onSubmit,
  employee,
  isLoading,
}: EmployeeDialogStandardizedProps) {
  const { t } = useTranslation();
  const isEditing = !!employee;

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee || {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      hire_date: '',
      salary: 0,
      status: 'active',
      notes: '',
    },
  });

  const handleSubmit = (data: EmployeeFormData) => {
    onSubmit(data);
  };

  const dialogActions = (
    <>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        {t('common.cancel')}
      </Button>
      <Button onClick={form.handleSubmit(handleSubmit)} disabled={isLoading}>
        {isLoading ? t('common.saving') : isEditing ? t('common.save') : t('common.create')}
      </Button>
    </>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? t('employees.edit_employee') : t('employees.add_employee')}
      description={isEditing ? t('employees.edit_employee_description') : t('employees.add_employee_description')}
      actions={dialogActions}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="first_name">{t('employees.first_name')}</label>
            <Input
              id="first_name"
              {...form.register('first_name')}
              error={form.formState.errors.first_name?.message}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="last_name">{t('employees.last_name')}</label>
            <Input
              id="last_name"
              {...form.register('last_name')}
              error={form.formState.errors.last_name?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="email">{t('employees.email')}</label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              error={form.formState.errors.email?.message}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone">{t('employees.phone')}</label>
            <Input
              id="phone"
              {...form.register('phone')}
              error={form.formState.errors.phone?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="position">{t('employees.position')}</label>
            <Input
              id="position"
              {...form.register('position')}
              error={form.formState.errors.position?.message}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="department">{t('employees.department')}</label>
            <Input
              id="department"
              {...form.register('department')}
              error={form.formState.errors.department?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="hire_date">{t('employees.hire_date')}</label>
            <Input
              id="hire_date"
              type="date"
              {...form.register('hire_date')}
              error={form.formState.errors.hire_date?.message}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="salary">{t('employees.salary')}</label>
            <Input
              id="salary"
              type="number"
              {...form.register('salary', { valueAsNumber: true })}
              error={form.formState.errors.salary?.message}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="status">{t('employees.status')}</label>
          <Select
            value={form.watch('status')}
            onValueChange={(value) => form.setValue('status', value as 'active' | 'inactive' | 'on_leave')}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('employees.select_status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t('employees.status_active')}</SelectItem>
              <SelectItem value="inactive">{t('employees.status_inactive')}</SelectItem>
              <SelectItem value="on_leave">{t('employees.status_on_leave')}</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.status && (
            <p className="text-sm text-destructive">{form.formState.errors.status.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="notes">{t('employees.notes')}</label>
          <Textarea
            id="notes"
            {...form.register('notes')}
            error={form.formState.errors.notes?.message}
          />
        </div>
      </form>
    </StandardDialog>
  );
} 