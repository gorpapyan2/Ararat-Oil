
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Employee } from "@/services/supabase";
import { useEffect } from "react";

interface EmployeeFormData {
  name: string;
  position: string;
  contact: string;
  hire_date: string;
  salary: number;
}

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSubmit: (data: EmployeeFormData) => void;
}

export function EmployeeDialog({ open, onOpenChange, employee, onSubmit }: EmployeeDialogProps) {
  const form = useForm<EmployeeFormData>({
    defaultValues: {
      name: "",
      position: "",
      contact: "",
      hire_date: new Date().toISOString().split('T')[0],
      salary: 0,
    },
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        name: employee.name,
        position: employee.position,
        contact: employee.contact,
        hire_date: employee.hire_date,
        salary: employee.salary,
      });
    } else {
      form.reset({
        name: "",
        position: "",
        contact: "",
        hire_date: new Date().toISOString().split('T')[0],
        salary: 0,
      });
    }
  }, [employee, form]);

  const handleSubmit = (data: EmployeeFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Email or Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hire_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hire Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="50000" 
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {employee ? 'Update' : 'Save'} Employee
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
