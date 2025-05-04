import { useState } from "react";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks";
import { createFuelTank } from "@/services/supabase";
import { FuelType } from "@/types";
import { 
  FormInput, 
  FormSelect 
} from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FuelTank } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfirmAddTankDialogStandardized } from "./ConfirmAddTankDialogStandardized";
import { FormProvider } from "react-hook-form";

interface TankFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTankAdded: () => void;
}

// Form validation schema using zod
const formSchema = z.object({
  name: z
    .string({ required_error: "Tank name is required" })
    .min(2, "Tank name must be at least 2 characters"),
  fuel_type: z.enum(["petrol", "diesel", "cng"] as const, {
    required_error: "Fuel type is required",
  }),
  capacity: z.coerce
    .number({ required_error: "Capacity is required" })
    .positive("Capacity must be greater than zero"),
  current_level: z.coerce
    .number({ required_error: "Current level is required" })
    .nonnegative("Current level must be a positive number or zero")
    .optional()
    .default(0),
});

type FormData = z.infer<typeof formSchema>;

export function TankFormStandardized({ isOpen, onOpenChange, onTankAdded }: TankFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingTankData, setPendingTankData] = useState<FormData | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      name: "",
      fuel_type: undefined,
      capacity: 0,
      current_level: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: createFuelTank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
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

  const { isSubmitting, onSubmit } = useFormSubmitHandler<FormData>(
    form,
    (data) => {
      // Validate that current level doesn't exceed capacity
      if (data.current_level && data.current_level > data.capacity) {
        form.setError("current_level", {
          type: "manual",
          message: "Current level cannot exceed capacity",
        });
        return;
      }

      // Instead of creating directly, show confirmation dialog
      setFormData({
        name: data.name,
        fuel_type: data.fuel_type,
        capacity: Number(data.capacity),
        current_level: Number(data.current_level || 0),
      });

      setIsConfirmOpen(true);
    }
  );

  const handleConfirmSubmit = () => {
    if (formData) {
      // Create a properly typed object for the mutation
      const tankData: Omit<FuelTank, "id" | "created_at"> = {
        name: formData.name,
        fuel_type: formData.fuel_type,
        capacity: formData.capacity,
        current_level: formData.current_level || 0
      };
      mutation.mutate(tankData);
    }
  };

  const handleConfirmCancel = () => {
    setIsConfirmOpen(false);
    // Keep form open for editing
  };

  const fuelTypeOptions = [
    { value: "petrol", label: "Petrol" },
    { value: "diesel", label: "Diesel" },
    { value: "cng", label: "CNG" },
  ];

  return (
    <>
      <Dialog 
        open={isOpen} 
        onOpenChange={onOpenChange}
        title="Add New Fuel Tank"
      >
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add New Fuel Tank</DialogTitle>
            <DialogDescription>
              Enter the details of the new fuel tank
            </DialogDescription>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormInput
                name="name"
                label="Tank Name"
                form={form}
                placeholder="Tank name"
                autoComplete="off"
              />

              <FormSelect
                name="fuel_type"
                label="Fuel Type"
                form={form}
                options={fuelTypeOptions}
                placeholder="Select fuel type"
              />

              <FormInput
                name="capacity"
                label="Tank Capacity (liters)"
                form={form}
                type="number"
                placeholder="Capacity in liters"
                inputClassName="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              <FormInput
                name="current_level"
                label="Current Fuel Level (liters)"
                form={form}
                type="number"
                placeholder="Current level in liters"
                inputClassName="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting || mutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting || mutation.isPending ? "Adding..." : "Add Tank"}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      {formData && (
        <ConfirmAddTankDialogStandardized
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={handleConfirmSubmit}
          onCancel={handleConfirmCancel}
          isLoading={isSubmitting}
          data={{
            name: formData.name,
            fuelType: formData.fuel_type === "cng" 
              ? "CNG" 
              : formData.fuel_type === "petrol" 
                ? "Petrol" 
                : "Diesel",
            capacity: Number(formData.capacity),
          }}
        />
      )}
    </>
  );
} 