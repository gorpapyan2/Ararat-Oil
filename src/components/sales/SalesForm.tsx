
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FillingSystemSelect } from "@/components/inventory/form/FillingSystemSelect";
import { PriceAndEmployeeInputs } from "@/components/inventory/form/PriceAndEmployeeInputs";
import { useQuery } from "@tanstack/react-query";
import { fetchEmployees } from "@/services/employees";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

interface SalesFormValues {
  filling_system_id: string;
  meter_start: number;
  meter_end: number;
  unit_price: number;
  employee_id: string;
}

export function SalesForm({ onSubmit }: { onSubmit: (data: SalesFormValues) => void }) {
  const form = useForm<SalesFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees
  });

  const handleSubmit = async (data: SalesFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <DialogHeader>
          <h2 className="text-lg font-semibold">New Sale</h2>
          <p className="text-sm text-muted-foreground">
            Record a new sale by filling in the details below
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <FillingSystemSelect control={form.control} />

          <FormField
            control={form.control}
            name="meter_start"
            rules={{ required: "Meter start reading is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meter Start</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meter_end"
            rules={{ required: "Meter end reading is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meter End</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PriceAndEmployeeInputs 
            control={form.control}
            employees={employees}
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Sale"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
