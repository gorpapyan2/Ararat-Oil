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
import { FuelSupply, FuelType } from "@/types";

// UI Components
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
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

// Form Components
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormCurrencyInput,
  FormDatePicker
} from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";

// Define custom styles for the tank select dropdown
const tankSelectStyles = {
  trigger: "bg-slate-800 text-white font-semibold border-slate-600 shadow-sm",
  content: "bg-slate-800 border border-slate-600 shadow-lg"
};

// Add custom styles for the dropdown items
const selectItemStyle = "text-white hover:bg-slate-700 hover:text-white data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground";

// Define fuel type color indicators for the tank options
const fuelTypeColors: Record<FuelType, string> = {
  petrol: "text-red-400",
  diesel: "text-green-400",
  gas: "text-blue-400",
  kerosene: "text-amber-400",
  cng: "text-purple-400"
};

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

interface FuelSuppliesFormProps {
  onSubmit: (data: Omit<FuelSupply, "id" | "created_at">) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<Omit<FuelSupply, "id" | "created_at">>;
  onConfirm: () => void;
  onConfirmCancel: () => void;
  isConfirmOpen: boolean;
}

export function FuelSuppliesForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
  onConfirm,
  onConfirmCancel,
  isConfirmOpen
}: FuelSuppliesFormProps) {
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
  const { onSubmit: handleSubmit } = useFormSubmitHandler<FuelSupplyFormValues>(
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

  // Tank options for select with color-coded fuel types
  const tankOptions = useMemo(() => {
    return tanks?.map(tank => {
      const fuelTypeColor = fuelTypeColors[tank.fuel_type];
      
      return {
        value: tank.id,
        label: `${tank.name} (${tank.fuel_type})`,
        colorClass: fuelTypeColor
      };
    }) || [];
  }, [tanks]);

  // Employee options for select
  const employeeOptions = useMemo(() => {
    return employees?.map(employee => ({
      value: employee.id,
      label: employee.name,
    })) || [];
  }, [employees]);

  // Custom render function for tank options
  const renderTankOption = (option: { value: string; label: string; colorClass?: string }) => (
    <div>
      {option.colorClass ? (
        <span className={option.colorClass}>{option.label}</span>
      ) : (
        option.label
      )}
    </div>
  );

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormDatePicker
                name="delivery_date"
                label={t("fuelSupplies.deliveryDate", "Delivery Date")}
                form={form}
                placeholder={t("fuelSupplies.selectDate", "Select date")}
              />

              <FormSelect
                name="provider_id"
                label={t("fuelSupplies.provider", "Provider")}
                form={form}
                options={providerOptions}
                placeholder={t("fuelSupplies.selectProvider", "Select provider")}
              />
            </div>

            <FormSelect
              name="tank_id"
              label={t("fuelSupplies.tank", "Fuel Tank")}
              form={form}
              options={tankOptions}
              placeholder={t("fuelSupplies.selectTank", "Select tank")}
              selectClassName={tankSelectStyles.trigger}
              contentClassName={tankSelectStyles.content}
              itemClassName={selectItemStyle}
              renderOption={renderTankOption}
            />

            {selectedTank && (
              <div className="rounded-md border p-3 bg-slate-900/50">
                <div className="text-sm mb-2 flex justify-between">
                  <span>Tank Capacity: {selectedTank.capacity} L</span>
                  <span>Current Level: {selectedTank.current_level} L</span>
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-2 ${tankStatus.color}`}
                    style={{ width: `${Math.min(tankStatus.percentage, 100)}%` }}
                  ></div>
                </div>
                <p
                  className={`text-xs mt-1 ${
                    tankStatus.isFull ? "text-red-400" : "text-slate-400"
                  }`}
                >
                  {tankStatus.str}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                name="quantity_liters"
                label={t("fuelSupplies.quantity", "Quantity (Liters)")}
                type="number"
                form={form}
                inputClassName="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              <FormCurrencyInput
                name="price_per_liter"
                label={t("fuelSupplies.pricePerLiter", "Price Per Liter")}
                form={form}
                placeholder="0"
                symbol="֏"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">
                {t("fuelSupplies.totalCost", "Total Cost")}
              </label>
              <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                {totalCost.toFixed(2)} ֏
              </div>
            </div>

            <FormSelect
              name="employee_id"
              label={t("fuelSupplies.employee", "Employee")}
              form={form}
              options={employeeOptions}
              placeholder={t("fuelSupplies.selectEmployee", "Select employee")}
            />

            <FormTextarea
              name="comments"
              label={t("fuelSupplies.comments", "Comments")}
              form={form}
              placeholder={t("fuelSupplies.optionalComments", "Optional comments about the fuel supply")}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {t("fuelSupplies.addFuelSupply", "Add Fuel Supply")}
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={onConfirmCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("fuelSupplies.confirmSupply", "Confirm Fuel Supply")}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4">{t("fuelSupplies.confirmMessage", "Please confirm the following fuel supply:")}</p>
            
            <div className="space-y-2 text-sm">
              {selectedTank && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">{t("fuelSupplies.tank")}:</span>
                  <span className="font-medium">{selectedTank.name}</span>
                </div>
              )}
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">{t("fuelSupplies.quantity")}:</span>
                <span className="font-medium">{quantity} L</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">{t("fuelSupplies.pricePerLiter")}:</span>
                <span className="font-medium">{price} ֏</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">{t("fuelSupplies.totalCost")}:</span>
                <span className="font-medium">{totalCost} ֏</span>
              </div>
              
              {tankStatus.isFull && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded-md text-red-400">
                  <p className="font-semibold">{t("fuelSupplies.warning")}:</p>
                  <p>{tankStatus.str}</p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onConfirmCancel}>{t("common.cancel")}</Button>
            <Button 
              onClick={onConfirm} 
              disabled={isSubmitting}
            >
              {t("common.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 