import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFuelTank } from "@/services/supabase";
import { FuelType } from "@/types";
import * as z from "zod";
import { ConfirmAddTankDialog } from "./ConfirmAddTankDialog";

interface TankFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTankAdded: () => void;
}

// Form validation schema using zod
const formSchema = z.object({
  name: z.string({ required_error: "Tank name is required" })
    .min(2, "Tank name must be at least 2 characters"),
  fuel_type: z.enum(["petrol", "diesel", "cng"] as const, {
    required_error: "Fuel type is required",
  }),
  capacity: z.coerce.number({ required_error: "Capacity is required" })
    .positive("Capacity must be greater than zero"),
  current_level: z.coerce.number({ required_error: "Current level is required" })
    .nonnegative("Current level must be a positive number or zero")
    .optional().default(0),
});

type FormData = z.infer<typeof formSchema>;

export function TankForm({ isOpen, onOpenChange, onTankAdded }: TankFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingTankData, setPendingTankData] = useState<any>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      capacity: 0,
      current_level: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: createFuelTank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-tanks'] });
      toast({
        title: "Tank added successfully",
        description: "The new fuel tank has been added.",
      });
      onOpenChange(false);
      setConfirmDialogOpen(false);
      setPendingTankData(null);
      onTankAdded();
      form.reset();
    },
    onError: (error) => {
      setConfirmDialogOpen(false);
      toast({
        title: "Error adding tank",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    // Validate that current level doesn't exceed capacity
    if (data.current_level && data.current_level > data.capacity) {
      form.setError('current_level', { 
        type: 'manual', 
        message: 'Current level cannot exceed capacity' 
      });
      return;
    }
    
    // Instead of creating directly, show confirmation dialog
    setPendingTankData({
      name: data.name,
      fuel_type: data.fuel_type,
      capacity: Number(data.capacity),
      current_level: Number(data.current_level || 0),
    });
    
    setConfirmDialogOpen(true);
  };
  
  const handleConfirmTank = () => {
    if (pendingTankData) {
      mutation.mutate(pendingTankData);
    }
  };
  
  const handleCancelTank = () => {
    setConfirmDialogOpen(false);
    // Keep form open for editing
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add New Fuel Tank</DialogTitle>
            <DialogDescription>
              Enter the details of the new fuel tank
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Tank name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fuel_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tank Capacity (liters)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Capacity in liters" 
                        {...field} 
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="current_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Fuel Level (liters)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Current level in liters" 
                        {...field} 
                        min={0}
                      />
                    </FormControl>
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
                  {mutation.isPending ? 'Adding...' : 'Add Tank'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {pendingTankData && (
        <ConfirmAddTankDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          onConfirm={handleConfirmTank}
          onCancel={handleCancelTank}
          loading={mutation.isPending}
          data={{
            name: pendingTankData.name,
            fuelType: pendingTankData.fuel_type === 'cng' ? 'CNG' :
                     pendingTankData.fuel_type === 'petrol' ? 'Petrol' : 
                     pendingTankData.fuel_type === 'diesel' ? 'Diesel' : 
                     pendingTankData.fuel_type,
            capacity: pendingTankData.capacity
          }}
        />
      )}
    </>
  );
}
