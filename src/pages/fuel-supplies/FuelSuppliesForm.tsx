import { useMemo, useEffect } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/shared/utils";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { FormProvider } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks";
import { useNavigate } from "react-router-dom";
import {
  apiNamespaces,
  getApiErrorMessage,
  getApiSuccessMessage,
} from "@/i18n/i18n";

// Services
import {
  petrolProvidersApi,
  Tank,
  tanksApi,
  employeesApi,
  Employee,
  ApiResponse,
} from "@/core/api";
import { FuelSupply, FuelType, FuelTypeCode } from "@/types";

// UI Components
import { Button } from "@/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/primitives/dialog";
import { Alert, AlertDescription } from "@/core/components/ui/alert";
import { Skeleton } from "@/core/components/ui/skeleton";

// Form Components
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormCurrencyInput,
  FormDatePicker,
} from "@/core/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";

// Define custom styles for the tank select dropdown
const tankSelectStyles = {
  trigger: "bg-slate-800 text-white font-semibold border-slate-600 shadow-sm",
  content: "bg-slate-800 border border-slate-600 shadow-lg",
};

// Add custom styles for the dropdown items
const selectItemStyle =
  "text-white hover:bg-slate-700 hover:text-white data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground";

// Define fuel type color indicators for the tank options
const fuelTypeColors: Record<FuelTypeCode, string> = {
  diesel: "text-green-400",
  gas: "text-blue-400",
  petrol_regular: "text-rose-400",
  petrol_premium: "text-red-500",
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
  shift_id: z.string({ required_error: "Shift is required" }),
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
  isConfirmOpen,
}: FuelSuppliesFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch data with proper error handling and loading states
  const {
    data: providers,
    isLoading: isLoadingProviders,
    error: providersError,
  } = useQuery({
    queryKey: ["petrol-providers"],
    queryFn: petrolProvidersApi.getPetrolProviders,
  });

  const {
    data: tanks,
    isLoading: isLoadingTanks,
    error: tanksError,
  } = useQuery({
    queryKey: ["fuel-tanks"],
    queryFn: tanksApi.getTanks,
  });

  const {
    data: employees,
    isLoading: isLoadingEmployees,
    error: employeesError,
  } = useQuery<ApiResponse<Employee[]>, Error>({
    queryKey: ["employees"],
    queryFn: async () => {
      return await employeesApi.getEmployees();
    },
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
      shift_id: defaultValues?.shift_id || "",
      comments: defaultValues?.comments || "",
    },
  });

  // Get form submission handler
  const { onSubmit: handleSubmit } = useFormSubmitHandler<FuelSupplyFormValues>(
    form,
    (data) => {
      // Additional validation to prevent empty UUIDs
      const requiredUuidFields = ["provider_id", "tank_id"] as const;
      const emptyFields = requiredUuidFields.filter(
        (field) => !data[field] || data[field] === ""
      );

      if (emptyFields.length > 0) {
        const fieldNames = emptyFields.map((field) => {
          switch (field) {
            case "provider_id":
              return t("fuelSupplies.provider", "Provider");
            case "tank_id":
              return t("fuelSupplies.tank", "Fuel Tank");
            default:
              return field;
          }
        });

        toast({
          title: t("common.error"),
          description: t(
            "fuelSupplies.requiredFieldsError",
            "Please select a value for: {{fields}}",
            {
              fields: fieldNames.join(", "),
            }
          ),
          variant: "destructive",
        });

        return false;
      }

      onSubmit(data as Omit<FuelSupply, "id" | "created_at">);
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
    return tanks.data?.find((t: Tank) => t.id === selectedTankId);
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

  // Provider options for select - ALWAYS call this hook, but its content may be empty
  const providerOptions = useMemo(() => {
    if (!providers || !providers.data || providers.data.length === 0) {
      return [];
    }

    return providers.data
      .filter((provider) => provider.status === "active") // Filter out inactive providers
      .map((provider) => ({
        value: provider.id,
        label: provider.name || "Unnamed Provider",
      }));
  }, [providers]);

  // Tank options for select with color-coded fuel types - ALWAYS call this hook
  const tankOptions = useMemo(() => {
    return (
      tanks?.data?.map((tank) => {
        // Safely extract fuel type label
        const fuelTypeLabel = tank.fuel_type_id || "";

        const fuelTypeCode = tank.fuel_type_id;
        const fuelTypeColor = fuelTypeColors[fuelTypeCode as FuelTypeCode];

        return {
          value: tank.id,
          label: `${tank.name} (${fuelTypeLabel})`,
          colorClass: fuelTypeColor,
        };
      }) || []
    );
  }, [tanks]);

  // Employee options for select - ALWAYS call this hook
  const employeeOptions = useMemo(() => {
    if (!employees || !employees.data) return [];

    return employees.data.map((employee: Employee) => ({
      value: employee.id,
      label: employee.name,
    }));
  }, [employees]);

  // Custom render function for tank options
  const renderTankOption = (option: {
    value: string;
    label: string;
    colorClass?: string;
  }) => (
    <div>
      {option.colorClass ? (
        <span className={option.colorClass}>{option.label}</span>
      ) : (
        option.label
      )}
    </div>
  );

  // Compute explanatory string and visual percentage for tank - ALWAYS call this hook
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

  // Create a renderContent function to handle conditional rendering
  const renderContent = () => {
    // Show loading state
    const isLoading =
      isLoadingProviders || isLoadingTanks || isLoadingEmployees;
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      );
    }

    // Show error states
    const error = providersError || tanksError || employeesError;
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : getApiErrorMessage(apiNamespaces.fuelSupplies, "fetch")}
          </AlertDescription>
        </Alert>
      );
    }

    // Show warning if no providers are available
    if (!providers || !providers.data || providers.data.length === 0) {
      return (
        <div className="space-y-6">
          <Alert variant="default" className="border-amber-500 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="flex flex-col space-y-3">
              <p>
                {t(
                  "fuelSupplies.noProviders",
                  "No petrol providers found. You need to create a provider before adding a fuel supply."
                )}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await petrolProvidersApi.createPetrolProvider({
                        name: "Sample Provider",
                        contact_person: "Sample Contact",
                        email: "sample@example.com",
                        phone: "123-456-7890",
                        address: "123 Main St",
                        status: "active",
                      });
                      await queryClient.invalidateQueries({
                        queryKey: ["petrol-providers"],
                      });
                      toast({
                        title: t("common.success"),
                        description: getApiSuccessMessage(
                          apiNamespaces.petrolProviders,
                          "create",
                          "sample provider"
                        ),
                      });
                    } catch (error) {
                      toast({
                        title: t("common.error"),
                        description:
                          error instanceof Error
                            ? error.message
                            : getApiErrorMessage(
                                apiNamespaces.petrolProviders,
                                "create"
                              ),
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  {t(
                    "fuelSupplies.createSampleProvider",
                    "Create Sample Provider"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/fuel-management/providers/create")}
                >
                  {t("fuelSupplies.createProvider", "Create Provider")}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // Regular form
    return (
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

          <FormTextarea
            name="comments"
            label={t("fuelSupplies.comments", "Comments")}
            form={form}
            placeholder={t(
              "fuelSupplies.optionalComments",
              "Optional comments about the fuel supply"
            )}
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
    );
  };

  return (
    <>
      <FormProvider {...form}>{renderContent()}</FormProvider>

      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmOpen}
        onOpenChange={onConfirmCancel}
        title={t("fuelSupplies.confirmSupply", "Confirm Fuel Supply")}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("fuelSupplies.confirmSupply", "Confirm Fuel Supply")}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="mb-4">
              {t(
                "fuelSupplies.confirmMessage",
                "Please confirm the following fuel supply:"
              )}
            </p>

            <div className="space-y-2 text-sm">
              {selectedTank && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">
                    {t("fuelSupplies.tank")}:
                  </span>
                  <span className="font-medium">{selectedTank.name}</span>
                </div>
              )}

              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">
                  {t("fuelSupplies.quantity")}:
                </span>
                <span className="font-medium">{quantity} L</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">
                  {t("fuelSupplies.pricePerLiter")}:
                </span>
                <span className="font-medium">{price} ֏</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">
                  {t("fuelSupplies.totalCost")}:
                </span>
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
            <Button variant="outline" onClick={onConfirmCancel}>
              {t("common.cancel")}
            </Button>
            <Button onClick={onConfirm} disabled={isSubmitting}>
              {t("common.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
