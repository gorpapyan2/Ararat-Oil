
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { createDailyInventoryRecord, fetchLatestInventoryRecordByFillingSystemId } from "@/services/inventory";
import type { Employee, FuelTank } from "@/services/supabase";
import { TankSelect } from "./form/TankSelect";
import { StockInputs } from "./form/StockInputs";
import { PriceAndEmployeeInputs } from "./form/PriceAndEmployeeInputs";
import * as z from "zod";
import { FillingSystemSelect } from "./form/FillingSystemSelect";
import { fetchFillingSystems } from "@/services/filling-systems";

interface InventoryFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  employees?: Employee[];
}

const formSchema = z.object({
  filling_system_id: z.string({ required_error: "Filling system is required" }),
  opening_stock: z.coerce.number({ required_error: "Opening stock is required" })
    .nonnegative("Must be a positive number"),
  closing_stock: z.coerce.number({ required_error: "Closing stock is required" })
    .nonnegative("Must be a positive number"),
  unit_price: z.coerce.number({ required_error: "Unit price is required" })
    .positive("Price must be greater than zero"),
  employee_id: z.string({ required_error: "Employee is required" }),
});

type FormData = z.infer<typeof formSchema>;

export function InventoryForm({ isOpen, onOpenChange, selectedDate, employees }: InventoryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opening_stock: 0,
      closing_stock: 0,
      unit_price: 0,
    },
  });

  const { data: fillingSystems } = useQuery({
    queryKey: ['filling-systems'],
    queryFn: fetchFillingSystems,
  });

  const handleFillingSystemSelect = async (systemId: string) => {
    try {
      const lastRecord = await fetchLatestInventoryRecordByFillingSystemId(systemId);
      if (lastRecord) {
        form.setValue('opening_stock', lastRecord.closing_stock);
        form.setValue('closing_stock', lastRecord.closing_stock); // Set closing stock to same value by default
        // Also update unit price from last record if available
        if (lastRecord.unit_price) {
          form.setValue('unit_price', lastRecord.unit_price);
        }
      } else {
        // Reset to default if no previous record
        form.setValue('opening_stock', 0);
        form.setValue('closing_stock', 0);
      }
    } catch (error) {
      console.error('Error fetching last record:', error);
      // Reset to default on error
      form.setValue('opening_stock', 0);
      form.setValue('closing_stock', 0);
    }
  };

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const fillingSystem = fillingSystems?.find(s => s.id === data.filling_system_id);
      if (!fillingSystem?.tank_id) throw new Error('No tank associated with this filling system');

      return createDailyInventoryRecord({
        date: formattedDate,
        tank_id: fillingSystem.tank_id,
        employee_id: data.employee_id,
        opening_stock: Number(data.opening_stock),
        received: 0, // Adding the received field with default value
        sold: 0,
        closing_stock: Number(data.closing_stock),
        unit_price: Number(data.unit_price),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-inventory', formattedDate] });
      toast({
        title: "Record added successfully",
        description: "The inventory record has been saved.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error adding record",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  if (isOpen === true) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 mb-6">
            <FillingSystemSelect 
              control={form.control} 
              onSelect={handleFillingSystemSelect}
            />
            <StockInputs control={form.control} />
            <PriceAndEmployeeInputs control={form.control} employees={employees} />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Saving...' : 'Save Record'}
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Daily Inventory Record</DialogTitle>
          <DialogDescription>
            Enter the inventory details for {format(selectedDate, 'PP')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FillingSystemSelect 
              control={form.control} 
              onSelect={handleFillingSystemSelect}
            />
            <StockInputs control={form.control} />
            <PriceAndEmployeeInputs control={form.control} employees={employees} />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="w-full sm:w-auto"
              >
                {mutation.isPending ? 'Saving...' : 'Save Record'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
