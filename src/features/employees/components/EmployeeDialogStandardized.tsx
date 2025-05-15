import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { StandardDialog } from '@/shared/components/common/dialog/StandardDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Employee, EmployeeFormData } from '../types/employees.types';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define the Zod schema that validates our form inputs
const employeeSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  position: z.string().min(1, { message: 'Position is required' }),
  department: z.string().min(1, { message: 'Department is required' }),
  hire_date: z.string().min(1, { message: 'Hire date is required' }),
  salary: z.coerce.number().min(0, { message: 'Salary must be a positive number' }),
  status: z.enum(['active', 'inactive', 'on_leave'], {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be one of the available options',
  }),
  notes: z.string().optional().default(''),
});

// Infer the TS type from the schema
type EmployeeFormSchema = z.infer<typeof employeeSchema>;

// Available departments - could move to a configuration file or fetch from API
const DEPARTMENTS = [
  'Sales',
  'Operations',
  'Marketing',
  'Finance',
  'HR',
  'IT',
  'Engineering',
  'general',
];

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

  // Initialize the form with default values or employee data for editing
  const form = useForm<EmployeeFormSchema>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee || {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      position: '',
      department: 'general',
      hire_date: '',
      salary: 0,
      status: 'active',
      notes: '',
    },
  });

  const handleSubmit = (data: EmployeeFormSchema) => {
    onSubmit(data);
  };

  const dialogActions = (
    <>
      <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
        {t('common.cancel')}
      </Button>
      <Button 
        onClick={form.handleSubmit(handleSubmit)} 
        disabled={isLoading}
        type="button"
      >
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('employees.first_name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('employees.last_name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('employees.email')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('employees.phone')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('employees.position')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('employees.department')}</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('employees.select_department')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {t(`employees.department_${dept.toLowerCase()}`, dept)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hire_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('employees.hire_date')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('employees.salary')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('employees.status')}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('employees.select_status')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">{t('employees.status_active')}</SelectItem>
                    <SelectItem value="inactive">{t('employees.status_inactive')}</SelectItem>
                    <SelectItem value="on_leave">{t('employees.status_on_leave')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('employees.notes')}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </StandardDialog>
  );
} 