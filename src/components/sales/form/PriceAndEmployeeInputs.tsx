import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Employee } from "@/types";
import type { Control } from "react-hook-form";

interface PriceAndEmployeeInputsProps {
  control: Control<any>;
  employees?: Employee[];
}

export function PriceAndEmployeeInputs({ control, employees }: PriceAndEmployeeInputsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="unit_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Unit Price</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                className="h-12 text-base"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="employee_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Employee</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {employees?.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 