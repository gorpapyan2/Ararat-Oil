import { useForm } from "react-hook-form";
import { z } from "zod";
import { StandardDialog } from "@/components/ui/composed/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks";
import {
  createFuelSupply,
  updateFuelSupply,
} from "@/services/fuel-supplies";
import { fetchPetrolProviders } from "@/services/petrol-providers";
import { fetchFuelTanks } from "@/services/tanks";
import { useQuery } from "@tanstack/react-query";
import { FormInput, FormSelect, FormTextarea } from "@/components/ui/composed/form-fields";
import { FuelSupply } from "@/types";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";

// Define types locally since we don't have access to the actual type files
interface PetrolProvider {
  id: string;
  name: string;
  // Add other fields as needed
}

interface FuelTank {
  id: string;
  name: string;
  fuel_type?: string;
  // Add other fields as needed
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
  employee_id: z.string().optional(),
  comments: z.string().optional(),
});

type FuelSupplyFormData = z.infer<typeof fuelSupplySchema>;

export function FuelSuppliesFormStandardized({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: FuelSuppliesFormStandardizedProps) {
  const { toast } = useToast();

  const form = useZodForm({
    schema: fuelSupplySchema,
    defaultValues: {
      delivery_date: initialData?.delivery_date || "",
      provider_id: initialData?.provider_id || "",
      tank_id: initialData?.tank_id || "",
      quantity_liters: initialData?.quantity_liters || 0,
      price_per_liter: initialData?.price_per_liter || 0,
      total_cost: initialData?.total_cost || 0,
      employee_id: initialData?.employee_id || "",
      comments: initialData?.comments || "",
    },
  });

  const { data: providers = [] } = useQuery<PetrolProvider[]>({
    queryKey: ["petrol-providers"],
    queryFn: () => fetchPetrolProviders(),
  });

  const { data: tanks = [] } = useQuery<FuelTank[]>({
    queryKey: ["fuel-tanks"],
    queryFn: () => fetchFuelTanks(),
  });

  const providerOptions = providers.map(provider => ({
    value: provider.id,
    label: provider.name
  })) || [];

  const tankOptions = tanks.map(tank => ({
    value: tank.id,
    label: tank.name
  })) || [];

  const { isSubmitting, onSubmit: handleSubmit } = useFormSubmitHandler<FuelSupplyFormData>(
    form,
    async (data) => {
      try {
        // Ensure all required fields are present
        const fuelSupplyData = {
          delivery_date: data.delivery_date || new Date().toISOString().split('T')[0],
          provider_id: data.provider_id || "",
          tank_id: data.tank_id || "",
          quantity_liters: data.quantity_liters || 0,
          price_per_liter: data.price_per_liter || 0,
          total_cost: data.total_cost || 0,
          employee_id: data.employee_id || "",
          comments: data.comments || ""
        };
        
        if (initialData) {
          await updateFuelSupply(initialData.id, fuelSupplyData as any);
        } else {
          await createFuelSupply(fuelSupplyData as any);
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
        {isSubmitting ? "Creating..." : "Create Supply"}
      </Button>
    </div>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Fuel Supply"
      description="Create a new fuel supply record"
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
