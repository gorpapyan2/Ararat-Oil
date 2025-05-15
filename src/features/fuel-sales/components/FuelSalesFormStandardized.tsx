import { useForm } from "react-hook-form";
import { z } from "zod";
import { StandardDialog } from "@/components/ui/composed/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { FormInput, FormSelect, FormTextarea } from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";
import { useFuelSales } from "../hooks/useFuelSales";
import { supabase } from "@/lib/supabase";
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
  sale_date: z.string({ required_error: "Sale date is required" }),
  tank_id: z.string({ required_error: "Tank is required" }),
  customer_name: z.string({ required_error: "Customer name is required" }),
  quantity: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z.number({ required_error: "Quantity must be a number" })
      .gt(0, "Quantity must be greater than 0")
  ),
  price_per_unit: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z.number({ required_error: "Price per unit must be a number" })
      .gt(0, "Price per unit must be greater than 0")
  ),
  payment_method: z.enum(['cash', 'card', 'bank_transfer'], {
    required_error: "Payment method is required",
  }),
  payment_status: z.enum(['pending', 'completed', 'failed'], {
    required_error: "Payment status is required",
  }),
});

type FuelSaleFormValues = z.infer<typeof fuelSaleSchema>;

async function fetchFuelTanks(): Promise<FuelTank[]> {
  const { data, error } = await supabase
    .from('fuel_tanks')
    .select('id, name, fuel_type')
    .order('name');
  
  if (error) throw error;
  return data;
}

export function FuelSalesFormStandardized({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: FuelSalesFormStandardizedProps) {
  const { toast } = useToast();
  const { createSale, updateSale } = useFuelSales();

  const form = useZodForm({
    schema: fuelSaleSchema,
    defaultValues: {
      sale_date: initialData?.sale_date || new Date().toISOString().split('T')[0],
      tank_id: initialData?.tank_id || "",
      customer_name: initialData?.customer_name || "",
      quantity: initialData?.quantity || 0,
      price_per_unit: initialData?.price_per_unit || 0,
      payment_method: initialData?.payment_method || "cash",
      payment_status: initialData?.payment_status || "pending",
    },
  });

  const { data: tanks = [] } = useQuery<FuelTank[]>({
    queryKey: ["fuel-tanks"],
    queryFn: fetchFuelTanks,
  });

  const tankOptions = tanks.map(tank => ({
    value: tank.id,
    label: tank.name
  })) || [];

  const { isSubmitting, onSubmit: handleSubmit } = useFormSubmitHandler<FuelSaleFormValues>(
    form,
    async (data) => {
      try {
        const fuelSaleData: FuelSaleFormData = {
          sale_date: data.sale_date,
          tank_id: data.tank_id,
          customer_name: data.customer_name,
          quantity_liters: data.quantity_liters,
          price_per_liter: data.price_per_liter,
          payment_method: data.payment_method,
          payment_status: data.payment_status,
        };
        
        if (initialData) {
          await updateSale.mutateAsync({ id: initialData.id, data: fuelSaleData });
        } else {
          await createSale.mutateAsync(fuelSaleData);
        }
        toast({
          title: "Success",
          description: "Fuel sale record has been saved.",
        });
        onSuccess();
        onOpenChange(false);
      } catch (error: any) {
        console.error("Error saving fuel sale:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to save fuel sale record.",
          variant: "destructive",
        });
      }
    }
  );

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
        {isSubmitting ? "Saving..." : initialData ? "Update Sale" : "Create Sale"}
      </Button>
    </div>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit Fuel Sale" : "Add New Fuel Sale"}
      description={initialData ? "Update existing fuel sale record" : "Create a new fuel sale record"}
      maxWidth="sm:max-w-[600px]"
      actions={formActions}
    >
      <form id="fuel-sale-form" onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          name="sale_date"
          label="Sale Date"
          form={form}
          type="date"
        />
        <FormSelect
          name="tank_id"
          label="Tank"
          form={form}
          options={tankOptions}
          placeholder="Select a tank"
        />
        <FormInput
          name="customer_name"
          label="Customer Name"
          form={form}
          placeholder="Enter customer name"
        />
        <FormInput
          name="quantity_liters"
          label="Quantity (Liters)"
          form={form}
          placeholder="Enter quantity in liters"
        />
        <FormInput
          name="price_per_liter"
          label="Price per Liter"
          form={form}
          placeholder="Enter price per liter"
        />
        <FormSelect
          name="payment_method"
          label="Payment Method"
          form={form}
          options={[
            { value: "cash", label: "Cash" },
            { value: "card", label: "Card" },
            { value: "bank_transfer", label: "Bank Transfer" },
          ]}
          placeholder="Select payment method"
        />
        <FormSelect
          name="payment_status"
          label="Payment Status"
          form={form}
          options={[
            { value: "pending", label: "Pending" },
            { value: "completed", label: "Completed" },
            { value: "failed", label: "Failed" },
          ]}
          placeholder="Select payment status"
        />
      </form>
    </StandardDialog>
  );
} 