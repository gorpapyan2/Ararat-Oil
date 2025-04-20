import { useState } from "react";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { InventoryHeader } from "./inventory/InventoryHeader";
import { InventoryTable } from "./inventory/InventoryTable";
import { 
  fetchDailyInventoryRecords, 
  fetchFuelTanks,
  fetchEmployees,
  createDailyInventoryRecord,
} from "@/services/supabase";

type FormData = {
  tank_id: string;
  opening_stock: number;
  received: number;
  sold: number;
  closing_stock: number;
  unit_price: number;
  employee_id: string;
};

export function DailyInventory() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const { data: records, isLoading: isLoadingRecords } = useQuery({
    queryKey: ['daily-inventory', formattedDate],
    queryFn: () => fetchDailyInventoryRecords(formattedDate),
  });

  const { data: tanks } = useQuery({
    queryKey: ['fuel-tanks'],
    queryFn: fetchFuelTanks,
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  const mutation = useMutation({
    mutationFn: createDailyInventoryRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-inventory', formattedDate] });
      toast({
        title: "Record added successfully",
        description: "The inventory record has been saved.",
      });
      setIsAddingRecord(false);
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

  const form = useForm<FormData>({
    defaultValues: {
      opening_stock: 0,
      received: 0,
      sold: 0,
      closing_stock: 0,
      unit_price: 0,
    },
  });

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

  const watchOpeningStock = form.watch('opening_stock');
  const watchReceived = form.watch('received');
  const watchSold = form.watch('sold');

  const updateClosingStock = () => {
    const opening = Number(watchOpeningStock) || 0;
    const received = Number(watchReceived) || 0;
    const sold = Number(watchSold) || 0;
    const closing = opening + received - sold;
    form.setValue('closing_stock', closing);
  };

  return (
    <div className="space-y-6">
      <InventoryHeader
        selectedDate={selectedDate}
        onDateChange={(date) => date && setSelectedDate(date)}
        onAddRecord={() => setIsAddingRecord(true)}
      />

      <InventoryTable 
        records={records || []} 
        isLoading={isLoadingRecords} 
      />

      <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Daily Inventory Record</DialogTitle>
            <DialogDescription>
              Enter the inventory details for {format(selectedDate, 'PP')}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="tank_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Tank</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel tank" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tanks?.map((tank) => (
                          <SelectItem key={tank.id} value={tank.id}>
                            {tank.name} ({tank.fuel_type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="opening_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Stock</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          setTimeout(updateClosingStock, 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="received"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Received</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          setTimeout(updateClosingStock, 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sold</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          setTimeout(updateClosingStock, 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="closing_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Closing Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
    </div>
  );
}
