import { useMemo, useEffect } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { FormProvider } from "react-hook-form";

// Services
import { fetchPetrolProviders } from "@/services/petrol-providers";
import { fetchFuelTanks } from "@/services/tanks";
import { fetchEmployees } from "@/services/employees";

// Types
import { FuelSupply } from "@/types";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from "@/components/ui/form";

// Form Components
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormCurrencyInput
} from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";

// Define the Zod schema for form validation
const fuelSupplySchema = z.object({
  delivery_date: z.string({ required_error: "Delivery date is required" }),
  provider_id: z.string({ required_error: "Provider is required" }),
  tank_id: z.string({ required_error: "Tank is required" }),
  quantity_liters: z.coerce
    .number({ required_error: "Quantity is required" })
    .positive("Quantity must be a positive number"),
  price_per_liter: z.coerce
    .number({ required_error: "Price per liter is required" })
    .nonnegative("Price must be a positive number or zero"),
  total_cost: z.coerce.number().optional(),
  employee_id: z.string({ required_error: "Employee is required" }),
  comments: z.string().optional(),
});

// Type based on the schema
type FuelSupplyFormValues = z.infer<typeof fuelSupplySchema>;

interface FuelSuppliesFormStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<FuelSupply, "id" | "created_at">) => void;
  defaultValues?: Partial<Omit<FuelSupply, "id" | "created_at">>;
}

export function FuelSuppliesFormStandardized({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: FuelSuppliesFormStandardizedProps) {
  const { t } = useTranslation();
  
  // Fetch data
  const { data: providers } = useQuery({
    queryKey: ["petrol-providers"],
    queryFn: fetchPetrolProviders,
  });

  const { data: tanks } = useQuery({
    queryKey: ["fuel-tanks"],
    queryFn: fetchFuelTanks,
  });

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  // Use formatted today's date as the default
  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  // Initialize the form with Zod validation
  const form = useZodForm({
    schema: fuelSupplySchema,
    defaultValues: {
      delivery_date: defaultValues?.delivery_date || today,
      provider_id: defaultValues?.provider_id || "",
      tank_id: defaultValues?.tank_id || "",
      quantity_liters: defaultValues?.quantity_liters || 0,
      price_per_liter: defaultValues?.price_per_liter || 0,
      total_cost: defaultValues?.total_cost || 0,
      employee_id: defaultValues?.employee_id || "",
      comments: defaultValues?.comments || "",
    },
  });
  
  // Get form submission handler
  const { isSubmitting, onSubmit: handleSubmit } = useFormSubmitHandler<FuelSupplyFormValues>(
    form,
    (data) => {
      onSubmit(data);
      return true;
    }
  );

  // Watch for changes in quantity and price to calculate the total
  const quantity = form.watch("quantity_liters");
  const price = form.watch("price_per_liter");
  const selectedTankId = form.watch("tank_id");

  // Get selected tank
  const selectedTank = useMemo(() => {
    if (!tanks || !selectedTankId) return null;
    return tanks.find((t) => t.id === selectedTankId);
  }, [tanks, selectedTankId]);

  // Calculate max quantity available for selected tank
  const maxQuantity = useMemo(() => {
    if (!selectedTank) return undefined;
    return Number(selectedTank.capacity) - Number(selectedTank.current_level);
  }, [selectedTank]);

  // Calculate total cost whenever quantity or price changes
  useEffect(() => {
    const qtyNum = Number(quantity) || 0;
    const priceNum = Number(price) || 0;

    const total = qtyNum * priceNum;
    form.setValue("total_cost", Number(total.toFixed(2)));
  }, [quantity, price, form]);

  // Get the current total from the form for display
  const totalCost = form.watch("total_cost") || 0;

  // Compute explanatory string and visual percentage for tank
  const tankStatus = useMemo(() => {
    if (!selectedTank) {
      return { percentage: 0, str: "", color: "", isFull: false };
    }

    const currentLevel = Number(selectedTank.current_level) || 0;
    const capacity = Number(selectedTank.capacity) || 1; // Avoid division by zero
    const supplyQuantity = Number(quantity) || 0;
    const afterSupply = currentLevel + supplyQuantity;

    // Calculate percentages
    const currentPercentage = (currentLevel / capacity) * 100;
    const afterPercentage = (afterSupply / capacity) * 100;

    // Check if tank will be over capacity
    const isOverCapacity = afterSupply > capacity;
    const overAmount = isOverCapacity ? afterSupply - capacity : 0;
    const barColor = isOverCapacity
      ? "bg-red-500"
      : afterPercentage > 90
        ? "bg-amber-500"
        : "bg-green-500";

    // Explanatory string
    const statusStr = isOverCapacity
      ? `Warning: Over capacity by ${overAmount.toFixed(1)} liters!`
      : `Current: ${currentLevel.toFixed(1)}L → After: ${afterSupply.toFixed(1)}L (${afterPercentage.toFixed(1)}% of capacity)`;

    return {
      percentage: afterPercentage,
      str: statusStr,
      color: barColor,
      isFull: isOverCapacity,
    };
  }, [selectedTank, quantity]);

  // Provider options for select
  const providerOptions = useMemo(() => {
    return providers?.map(provider => ({
      value: provider.id,
      label: provider.name
    })) || [];
  }, [providers]);

  // Tank options for select
  const tankOptions = useMemo(() => {
    return tanks?.map(tank => ({
      value: tank.id,
      label: `${tank.name} (${tank.fuel_type})`
    })) || [];
  }, [tanks]);

  // Employee options for select
  const employeeOptions = useMemo(() => {
    return employees?.map(employee => ({
      value: employee.id,
      label: employee.name
    })) || [];
  }, [employees]);

  // Save and Close button text logic
  const editing = Boolean(defaultValues);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Fuel Supply" : "Add Fuel Supply"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the details of this fuel supply record."
              : "Fill in the details to add a new fuel supply record."}
          </DialogDescription>
        </DialogHeader>
        
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Date Picker */}
              <FormField 
                name="delivery_date" 
                label="Delivery Date"
                form={form}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) =>
                          field.onChange(format(date || new Date(), "yyyy-MM-dd"))
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />

              {/* Provider Select */}
              <FormSelect
                name="provider_id"
                label="Petrol Provider"
                form={form}
                options={providerOptions}
                placeholder="Select a provider"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tank Select */}
              <FormSelect
                name="tank_id"
                label="Fuel Tank"
                form={form}
                options={tankOptions}
                placeholder="Select a tank"
              />

              {/* Employee Select */}
              <FormSelect
                name="employee_id"
                label="Employee"
                form={form}
                options={employeeOptions}
                placeholder="Select an employee"
              />
            </div>

            <div className="space-y-4">
              {/* Quantity Input */}
              <FormInput
                name="quantity_liters"
                label="Quantity (Liters)"
                form={form}
                type="number"
                inputClassName="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min={0}
                description={
                  selectedTank ? (
                    <div className="mt-2">
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${tankStatus.color}`}
                          style={{
                            width: `${Math.min(tankStatus.percentage, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <div
                        className={`text-xs mt-1 transition-all duration-500 flex items-center ${tankStatus.isFull ? "text-red-500" : "text-muted-foreground"}`}
                      >
                        {tankStatus.str}
                      </div>
                    </div>
                  ) : undefined
                }
              />

              {/* Price Per Liter */}
              <FormCurrencyInput
                name="price_per_liter"
                label="Price Per Liter"
                form={form}
                placeholder="0"
                symbol="֏"
              />

              {/* Total Cost (calculated field) */}
              <FormCurrencyInput
                name="total_cost"
                label="Total Cost"
                form={form}
                placeholder="0"
                symbol="֏"
                disabled={true}
                className="cursor-not-allowed bg-gray-500/40 font-semibold"
              />
            </div>

            {/* Comments Field */}
            <FormTextarea
              name="comments"
              label="Comments"
              form={form}
              placeholder="Optional comments about the fuel supply"
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Processing..." 
                : editing ? "Save Changes" : "Add Fuel Supply"
              }
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
} 