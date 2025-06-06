import { useForm } from "react-hook-form";
import { z } from "zod";
import { StandardDialog } from "@/core/components/ui/composed/base-dialog";
import { Button } from "@/core/components/ui/button";
import { useToast } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/core/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/shared/hooks/use-form";
import { useCreateFuelSale, useUpdateFuelSale } from "../hooks/useFuelSales";
import { tanksApi } from "@/core/api";
import type { FuelSale, FuelSaleFormData } from "../types/fuel-sales.types";

interface FuelTank {
  id: string;
  name: string;
  fuel_type?: string | { code?: string; name?: string };
}

interface FuelSalesFormStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: FuelSale;
}

const fuelSaleSchema = z.object({
  transaction_date: z.string({ required_error: "Sale date is required" }),
  filling_system_id: z.string({ required_error: "Tank is required" }),
  fuel_type_id: z.string({ required_error: "Fuel type is required" }),
  quantity: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z
      .number({ required_error: "Quantity must be a number" })
      .gt(0, "Quantity must be greater than 0")
  ),
  price_per_liter: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z
      .number({ required_error: "Price per liter must be a number" })
      .gt(0, "Price per liter must be greater than 0")
  ),
  payment_method: z.enum(["cash", "card", "credit", "transfer"], {
    required_error: "Payment method is required",
  }),
  employee_id: z.string({ required_error: "Employee is required" }),
});

type FuelSaleFormValues = z.infer<typeof fuelSaleSchema>;

async function fetchFuelTanks(): Promise<FuelTank[]> {
  const response = await tanksApi.getTanks();
  if (response.error) throw new Error(response.error.message || 'Failed to fetch tanks');
  
  const tanks = response.data || [];
  return tanks.map((tank: any) => ({
    id: tank.id,
    name: tank.name,
    fuel_type: tank.fuel_type?.name || 'Unknown',
  }));
}

export function FuelSalesFormStandardized({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: FuelSalesFormStandardizedProps) {
  const { toast } = useToast();
  const createSale = useCreateFuelSale();
  const updateSale = useUpdateFuelSale();

  const form = useZodForm({
    schema: fuelSaleSchema,
    defaultValues: {
      transaction_date:
        initialData?.transaction_date || new Date().toISOString().split("T")[0],
      filling_system_id: initialData?.filling_system_id || "",
      fuel_type_id: initialData?.fuel_type_id || "",
      quantity: initialData?.quantity || 0,
      price_per_liter: initialData?.price_per_liter || 0,
      payment_method: (initialData?.payment_method as "cash" | "card" | "credit" | "transfer") || "cash",
      employee_id: initialData?.employee_id || "",
    },
  });

  const { data: tanks = [] } = useQuery<FuelTank[]>({
    queryKey: ["fuel-tanks"],
    queryFn: fetchFuelTanks,
  });

  const tankOptions =
    tanks.map((tank) => ({
      value: tank.id,
      label: tank.name,
    })) || [];

  const { isSubmitting, onSubmit: handleSubmit } =
    useFormSubmitHandler<FuelSaleFormValues>(form, async (data) => {
      try {
        const fuelSaleData: FuelSaleFormData = {
          filling_system_id: data.filling_system_id,
          fuel_type_id: data.fuel_type_id,
          quantity: data.quantity,
          price_per_liter: data.price_per_liter,
          total_price: data.quantity * data.price_per_liter,
          payment_method: data.payment_method,
          employee_id: data.employee_id,
        };

        if (initialData) {
          await updateSale.mutateAsync({
            id: initialData.id,
            data: fuelSaleData,
          });
        } else {
          await createSale.mutateAsync(fuelSaleData);
        }
        toast({
          title: "Success",
          description: "Fuel sale record has been saved.",
        });
        onSuccess();
        onOpenChange(false);
      } catch (error: unknown) {
        console.error("Error saving fuel sale:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to save fuel sale record.",
          variant: "destructive",
        });
      }
    });

  const formActions = (
    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting} form="fuel-sale-form">
        {isSubmitting
          ? "Saving..."
          : initialData
            ? "Update Sale"
            : "Create Sale"}
      </Button>
    </div>
  );

  return (
    <StandardDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit Fuel Sale" : "Add New Fuel Sale"}
      description={
        initialData
          ? "Update existing fuel sale record"
          : "Create a new fuel sale record"
      }
      className="lg:max-w-4xl"
      footer={formActions}
    >
      <form id="fuel-sale-form" onSubmit={handleSubmit} className="space-y-4">
        <FormInput name="transaction_date" label="Sale Date" form={form} type="date" />
        <FormSelect
          name="filling_system_id"
          label="Tank"
          form={form}
          options={tankOptions}
          placeholder="Select a tank"
        />
        <FormInput
          name="fuel_type_id"
          label="Fuel Type ID"
          form={form}
          placeholder="Enter fuel type ID"
        />
        <FormInput
          name="quantity"
          label="Quantity (Liters)"
          form={form}
          type="number"
          placeholder="Enter quantity in liters"
        />
        <FormInput
          name="price_per_liter"
          label="Price per Liter"
          form={form}
          type="number"
          placeholder="Enter price per liter"
        />
        <FormSelect
          name="payment_method"
          label="Payment Method"
          form={form}
          options={[
            { value: "cash", label: "Cash" },
            { value: "card", label: "Card" },
            { value: "credit", label: "Credit" },
            { value: "transfer", label: "Bank Transfer" },
          ]}
          placeholder="Select payment method"
        />
        <FormInput
          name="employee_id"
          label="Employee ID"
          form={form}
          placeholder="Enter employee ID"
        />
      </form>
    </StandardDialog>
  );
}
