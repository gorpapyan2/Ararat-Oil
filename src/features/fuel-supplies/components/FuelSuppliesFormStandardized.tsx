import { useForm } from "react-hook-form";
import { z } from "zod";
import { StandardDialog } from "@/components/ui/composed/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { FormInput, FormSelect, FormTextarea } from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";
import { useFuelSupplies } from "../hooks/useFuelSupplies";
import { supabase } from "@/lib/supabase";
import type { FuelSupply, FuelSupplyFormData } from "../types/fuel-supplies.types";

// Define types locally since we don't have access to the actual type files
interface PetrolProvider {
  id: string;
  name: string;
}

interface FuelTank {
  id: string;
  name: string;
  fuel_type?: string | { code?: string; name?: string };
}

interface FuelSuppliesFormStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: FuelSupply;
}

const fuelSupplySchema = z.object({
  delivery_date: z.string({ required_error: "Delivery date is required" }),
  provider_id: z.string({ required_error: "Provider is required" }),
  tank_id: z.string({ required_error: "Tank is required" }),
  shift_id: z.string({ required_error: "Shift is required" }),
  quantity_liters: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z.number({ required_error: "Quantity must be a number" })
      .gt(0, "Quantity must be greater than 0")
  ),
  price_per_liter: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z.number({ required_error: "Price per liter must be a number" })
      .gt(0, "Price per liter must be greater than 0")
  ),
  total_cost: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z.number({ required_error: "Total cost must be a number" })
      .gt(0, "Total cost must be greater than 0")
  ),
  payment_method: z.string({ required_error: "Payment method is required" }),
  payment_status: z.string({ required_error: "Payment status is required" }),
  comments: z.string().optional(),
});

type FuelSupplyFormValues = z.infer<typeof fuelSupplySchema>;

async function fetchPetrolProviders(): Promise<PetrolProvider[]> {
  const { data, error } = await supabase
    .from('petrol_providers')
    .select('id, name')
    .order('name');
  
  if (error) throw error;
  return data;
}

async function fetchFuelTanks(): Promise<FuelTank[]> {
  const { data, error } = await supabase
    .from('fuel_tanks')
    .select('id, name, fuel_type')
    .order('name');
  
  if (error) throw error;
  return data;
}

export function FuelSuppliesFormStandardized({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: FuelSuppliesFormStandardizedProps) {
  const { toast } = useToast();
  const { createSupply, updateSupply } = useFuelSupplies();

  const form = useZodForm({
    schema: fuelSupplySchema,
    defaultValues: {
      delivery_date: initialData?.delivery_date || "",
      provider_id: initialData?.provider_id || "",
      tank_id: initialData?.tank_id || "",
      shift_id: initialData?.shift_id || "",
      quantity_liters: initialData?.quantity_liters || 0,
      price_per_liter: initialData?.price_per_liter || 0,
      total_cost: initialData?.total_cost || 0,
      payment_method: initialData?.payment_method || "cash",
      payment_status: initialData?.payment_status || "pending",
      comments: initialData?.comments || "",
    },
  });

  const { data: providers = [] } = useQuery<PetrolProvider[]>({
    queryKey: ["petrol-providers"],
    queryFn: fetchPetrolProviders,
  });

  const { data: tanks = [] } = useQuery<FuelTank[]>({
    queryKey: ["fuel-tanks"],
    queryFn: fetchFuelTanks,
  });

  const providerOptions = providers.map(provider => ({
    value: provider.id,
    label: provider.name
  })) || [];

  const tankOptions = tanks.map(tank => ({
    value: tank.id,
    label: tank.name
  })) || [];

  const { isSubmitting, onSubmit: handleSubmit } = useFormSubmitHandler<FuelSupplyFormValues>(
    form,
    async (data) => {
      try {
        const fuelSupplyData: FuelSupplyFormData = {
          delivery_date: data.delivery_date,
          provider_id: data.provider_id,
          tank_id: data.tank_id,
          shift_id: data.shift_id,
          quantity_liters: data.quantity_liters,
          price_per_liter: data.price_per_liter,
          payment_method: data.payment_method,
          payment_status: data.payment_status,
          comments: data.comments,
        };
        
        if (initialData) {
          await updateSupply.mutateAsync({ id: initialData.id, data: fuelSupplyData });
        } else {
          await createSupply.mutateAsync(fuelSupplyData);
        }
        toast({
          title: "Success",
          description: "Fuel supply record has been saved.",
        });
        onSuccess();
        onOpenChange(false);
      } catch (error: any) {
        console.error("Error saving fuel supply:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to save fuel supply record.",
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
      <Button type="submit" disabled={isSubmitting} form="fuel-supply-form">
        {isSubmitting ? "Saving..." : initialData ? "Update Supply" : "Create Supply"}
      </Button>
    </div>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit Fuel Supply" : "Add New Fuel Supply"}
      description={initialData ? "Update existing fuel supply record" : "Create a new fuel supply record"}
      maxWidth="sm:max-w-[600px]"
      actions={formActions}
    >
      <form id="fuel-supply-form" onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          name="delivery_date"
          label="Delivery Date"
          form={form}
          type="date"
        />
        <FormSelect
          name="provider_id"
          label="Provider"
          form={form}
          options={providerOptions}
          placeholder="Select a provider"
        />
        <FormSelect
          name="tank_id"
          label="Tank"
          form={form}
          options={tankOptions}
          placeholder="Select a tank"
        />
        <FormInput
          name="shift_id"
          label="Shift"
          form={form}
          placeholder="Enter shift ID"
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
        <FormInput
          name="total_cost"
          label="Total Cost"
          form={form}
          placeholder="Enter total cost"
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
        <FormTextarea
          name="comments"
          label="Comments"
          form={form}
          placeholder="Enter any comments"
        />
      </form>
    </StandardDialog>
  );
} 