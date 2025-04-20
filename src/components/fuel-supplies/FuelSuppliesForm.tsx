
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchPetrolProviders } from "@/services/petrol-providers";
import { fetchFuelTanks } from "@/services/tanks";
import { fetchEmployees } from "@/services/employees";
import { FuelSupply } from "@/types";
import { DeliveryDateProvider } from "./form/DeliveryDateProvider";
import { QuantityAndPrice } from "./form/QuantityAndPrice";
import { TankEmployee } from "./form/TankEmployee";
import { CommentsField } from "./form/CommentsField";
import { useEffect } from "react";

interface FuelSuppliesFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<FuelSupply, 'id' | 'created_at'>) => void;
}

export function FuelSuppliesForm({
  open,
  onOpenChange,
  onSubmit
}: FuelSuppliesFormProps) {
  const {
    data: providers
  } = useQuery({
    queryKey: ['petrol-providers'],
    queryFn: fetchPetrolProviders
  });
  
  const {
    data: tanks
  } = useQuery({
    queryKey: ['fuel-tanks'],
    queryFn: fetchFuelTanks
  });
  
  const {
    data: employees
  } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees
  });
  
  const form = useForm<Omit<FuelSupply, 'id' | 'created_at'>>({
    defaultValues: {
      delivery_date: new Date().toISOString().split('T')[0],
      provider_id: '',
      tank_id: '',
      quantity_liters: undefined,
      price_per_liter: undefined,
      total_cost: 0,
      employee_id: '',
      comments: ''
    }
  });

  // Watch for changes in quantity and price to calculate the total
  const quantity = form.watch('quantity_liters');
  const price = form.watch('price_per_liter');
  
  useEffect(() => {
    if (quantity && price) {
      const total = Number(quantity) * Number(price);
      form.setValue('total_cost', Number(total.toFixed(2)));
    } else {
      form.setValue('total_cost', 0);
    }
  }, [quantity, price, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Fuel Supply</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DeliveryDateProvider 
                control={form.control} 
                providers={providers}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TankEmployee 
                control={form.control}
                tanks={tanks}
                employees={employees}
              />
            </div>

            <QuantityAndPrice 
              control={form.control}
              totalCost={form.getValues('total_cost')}
            />

            <CommentsField control={form.control} />

            <Button type="submit" className="w-full">
              Add Fuel Supply
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
