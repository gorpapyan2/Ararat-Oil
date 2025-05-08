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
import { FormInput, FormSelect, FormTextArea } from "@/components/ui/composed/form-fields";
import { FuelSupply } from "@/types";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";

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

  const { data: providers } = useQuery({
    queryKey: ["petrol-providers"],
    queryFn: fetchPetrolProviders,
  });

  const { data: tanks } = useQuery({
    queryKey: ["fuel-tanks"],
    queryFn: fetchFuelTanks,
  });

  const providerOptions = providers?.map(provider => ({
    value: provider.id,
    label: provider.name
  })) || [];

  const tankOptions = tanks?.map(tank => ({
    value: tank.id,
    label: `${tank.name} (${tank.fuel_type})`
  })) || [];

  const { isSubmitting, onSubmit: handleSubmit } = useFormSubmitHandler<FuelSupplyFormData>(
    form,
    async (data) => {
      try {
        if (initialData) {
          await updateFuelSupply(initialData.id, data);
        } else {
          await createFuelSupply(data);
        }
        toast({
          title: "Success",
          description: `Fuel supply ${initialData ? 'updated' : 'created'} successfully`,
        });
        form.reset();
        onSuccess();
        return true;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create fuel supply",
          variant: "destructive",
        });
        return false;
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
        <FormTextArea
          name="comments"
          label="Comments"
          form={form}
          placeholder="Enter any comments"
        />
      </form>
    </StandardDialog>
  );
}
