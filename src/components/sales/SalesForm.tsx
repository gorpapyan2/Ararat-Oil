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
import { FillingSystemSelect } from "@/components/sales/form/FillingSystemSelect";
import { PriceAndEmployeeInputs } from "@/components/sales/form/PriceAndEmployeeInputs";
import { useQuery } from "@tanstack/react-query";
import { fetchEmployees } from "@/services/employees";
import { fetchLatestSale } from "@/services/sales";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Sale } from "@/types";
import { useShift } from "@/hooks/useShift";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SalesFormValues {
  filling_system_id: string;
  meter_start: number;
  meter_end: number;
  unit_price: number;
  employee_id: string;
}

interface SalesFormProps {
  onSubmit: (data: SalesFormValues) => void;
  sale?: Sale | null;
}

export function SalesForm({ onSubmit, sale }: SalesFormProps) {
  const { t } = useTranslation();
  const form = useForm<SalesFormValues>({
    defaultValues: sale ? {
      filling_system_id: sale.filling_system_id,
      meter_start: sale.meter_start,
      meter_end: sale.meter_end,
      unit_price: sale.price_per_unit,
      employee_id: sale.employee_id,
    } : undefined
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFillingSystem, setSelectedFillingSystem] = useState<string>(sale?.filling_system_id || "");
  const { activeShift } = useShift();

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees
  });

  const { data: latestSale } = useQuery({
    queryKey: ['latest-sale', selectedFillingSystem],
    queryFn: () => selectedFillingSystem ? fetchLatestSale(selectedFillingSystem) : null,
    enabled: !!selectedFillingSystem && !sale // Only fetch latest sale if no sale prop is provided
  });

  // Update default values when filling system changes or latest sale is loaded
  useEffect(() => {
    if (latestSale && !sale) {
      form.setValue('meter_start', latestSale.meter_end);
      form.setValue('unit_price', latestSale.price_per_unit);
    }
  }, [latestSale, form, sale]);

  // Set initial values if sale prop is provided
  useEffect(() => {
    if (sale) {
      form.reset({
        filling_system_id: sale.filling_system_id,
        meter_start: sale.meter_start,
        meter_end: sale.meter_end,
        unit_price: sale.price_per_unit,
        employee_id: sale.employee_id,
      });
      
      setSelectedFillingSystem(sale.filling_system_id);
    }
  }, [sale, form]);

  const handleFillingSystemChange = (value: string) => {
    setSelectedFillingSystem(value);
    form.setValue('filling_system_id', value);
  };

  const handleSubmit = async (data: SalesFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      if (!sale) form.reset(); // Only reset if creating a new sale
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <DialogHeader>
          <h2 className="text-lg font-semibold">{sale ? 'Edit Sale' : 'New Sale'}</h2>
          <p className="text-sm text-muted-foreground">
            {sale ? 'Edit sale details below' : 'Record a new sale by filling in the details below'}
          </p>
        </DialogHeader>

        {!activeShift && !sale && (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>
              {t("shifts.noActiveShift")}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <FillingSystemSelect 
            control={form.control} 
            onChange={handleFillingSystemChange}
            value={selectedFillingSystem}
          />

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
            {isSubmitting ? "Saving..." : (sale ? "Update Sale" : "Create Sale")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
