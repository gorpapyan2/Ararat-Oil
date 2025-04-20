
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { createDailyInventoryRecord } from "@/services/inventory";
import type { Employee } from "@/types";
import { StockInputs } from "./form/StockInputs";
import { PriceAndEmployeeInputs } from "./form/PriceAndEmployeeInputs";
import { TankSelect } from "./form/TankSelect";
import { ProviderSelect } from "./form/ProviderSelect";
import * as z from "zod";
import { useEffect } from "react";

interface InventoryFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  employees?: Employee[];
}

const formSchema = z.object({
  tank_id: z.string({ required_error: "Tank is required" }),
  provider_id: z.string({ required_error: "Provider is required" }),
  opening_stock: z.coerce.number({ required_error: "Opening stock is required" })
    .nonnegative("Must be a positive number"),
  received: z.coerce.number().nonnegative("Must be a positive number").default(0),
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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opening_stock: 0,
      received: 0,
      closing_stock: 0,
      unit_price: 0,
    },
  });

  // Watch received and unit_price to calculate total price
  const received = form.watch("received");
  const unitPrice = form.watch("unit_price");
  const totalPrice = received * unitPrice;
  
  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      return createDailyInventoryRecord({
        date: format(selectedDate, 'yyyy-MM-dd'),
        tank_id: data.tank_id,
        provider_id: data.provider_id,
        employee_id: data.employee_id,
        opening_stock: Number(data.opening_stock),
        received: Number(data.received),
        sold: 0, // Default to 0 since this is a new record
        closing_stock: Number(data.closing_stock),
        unit_price: Number(data.unit_price),
        total_price: Number(data.received) * Number(data.unit_price),
        filling_system_id: "", // This will be set on the backend if needed
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-inventory', format(selectedDate, 'yyyy-MM-dd')] });
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Daily Inventory Record</DialogTitle>
          <DialogDescription>
            Enter the inventory details for {format(selectedDate, 'PP')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              <TankSelect control={form.control} />
              <ProviderSelect control={form.control} />
              <StockInputs control={form.control} />
              <PriceAndEmployeeInputs control={form.control} employees={employees} />
            </div>
            
            <div className="text-muted-foreground text-sm">
              Total Price: ${totalPrice.toFixed(2)}
            </div>
            
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
