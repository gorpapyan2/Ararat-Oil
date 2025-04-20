
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { fetchPetrolProviders } from "@/services/petrol-providers";
import { fetchFuelTanks } from "@/services/tanks";
import { fetchEmployees } from "@/services/employees";
import { FuelSupply } from "@/types";
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
      delivery_date: format(new Date(), 'yyyy-MM-dd'),
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

  const handleSubmit = (data: Omit<FuelSupply, 'id' | 'created_at'>) => {
    onSubmit(data);
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Fuel Supply</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="delivery_date" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-base font-medium">Delivery Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={new Date(field.value)} onSelect={date => field.onChange(format(date || new Date(), 'yyyy-MM-dd'))} initialFocus className={cn("p-3 pointer-events-auto")} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="provider_id" rules={{
              required: "Provider is required"
            }} render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-base font-medium">Petrol Provider</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {providers?.map(provider => <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="tank_id" rules={{
              required: "Tank is required"
            }} render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-base font-medium">Fuel Tank</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tank" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tanks?.map(tank => <SelectItem key={tank.id} value={tank.id}>
                            {tank.name} ({tank.fuel_type})
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="employee_id" rules={{
              required: "Employee is required"
            }} render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-base font-medium">Employee</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees?.map(employee => <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />
            </div>

            <div className="grid grid-cols-3 gap-4 items-end">
              <FormField control={form.control} name="quantity_liters" rules={{
              required: "Quantity is required",
              min: {
                value: 0,
                message: "Quantity must be positive"
              }
            }} render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-base font-medium">
                      Quantity (Liters)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber || undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="price_per_liter" rules={{
              required: "Price is required",
              min: {
                value: 0,
                message: "Price must be positive"
              }
            }} render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-base font-medium">
                      Price per Liter
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber || undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="total_cost" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-base font-medium">Total Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        readOnly
                        value={field.value}
                        className="cursor-not-allowed bg-gray-100"
                      />
                    </FormControl>
                  </FormItem>} />
            </div>

            <FormField control={form.control} name="comments" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-base font-medium">Comments</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Optional comments about the fuel supply" />
                  </FormControl>
                </FormItem>} />

            <Button type="submit" className="w-full">
              Add Fuel Supply
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>;
}
