
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { createDailyInventoryRecord } from "@/services/supabase";
import type { Employee, FuelTank } from "@/services/supabase";
import { TankSelect } from "./form/TankSelect";
import { StockInputs } from "./form/StockInputs";
import { PriceAndEmployeeInputs } from "./form/PriceAndEmployeeInputs";
import * as z from "zod";

interface InventoryFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  tanks?: FuelTank[];
  employees?: Employee[];
}

// Form validation schema using zod
const formSchema = z.object({
  tank_id: z.string({ required_error: "Fuel tank is required" }),
  opening_stock: z.coerce.number({ required_error: "Opening stock is required" })
    .nonnegative("Must be a positive number"),
  received: z.coerce.number({ required_error: "Received amount is required" })
    .nonnegative("Must be a positive number"),
  sold: z.coerce.number({ required_error: "Sold amount is required" })
    .nonnegative("Must be a positive number"),
  closing_stock: z.coerce.number().optional(),
  unit_price: z.coerce.number({ required_error: "Unit price is required" })
    .positive("Price must be greater than zero"),
  employee_id: z.string({ required_error: "Employee is required" }),
});

type FormData = z.infer<typeof formSchema>;

export function InventoryForm({ isOpen, onOpenChange, selectedDate, tanks, employees }: InventoryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opening_stock: 0,
      received: 0,
      sold: 0,
      closing_stock: 0,
      unit_price: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: createDailyInventoryRecord,
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

  const updateClosingStock = () => {
    const opening = Number(form.watch('opening_stock')) || 0;
    const received = Number(form.watch('received')) || 0;
    const sold = Number(form.watch('sold')) || 0;
    const closing = opening + received - sold;
    form.setValue('closing_stock', closing);
  };

  const onSubmit = (data: FormData) => {
    const record = {
      ...data,
      date: formattedDate,
      opening_stock: Number(data.opening_stock),
      received: Number(data.received),
      sold: Number(data.sold),
      closing_stock: Number(data.closing_stock),
      unit_price: Number(data.unit_price),
    };
    
    mutation.mutate(record);
  };

  // If this is in a dialog (original design)
  if (isOpen !== true) {
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
              <TankSelect control={form.control} tanks={tanks} />
              <StockInputs control={form.control} onStockChange={updateClosingStock} />
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

  // For full page form
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 mb-6">
          <TankSelect control={form.control} tanks={tanks} />
          <StockInputs control={form.control} onStockChange={updateClosingStock} />
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
