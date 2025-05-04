import { useForm } from "react-hook-form";
import { z } from "zod";
import { StandardDialog } from "@/components/ui/composed/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks";
import { createFillingSystem } from "@/services/filling-systems";
import { fetchFuelTanks } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import { FormInput, FormSelect } from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";

interface FillingSystemFormStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Define Zod schema for validation
const fillingSystemSchema = z.object({
  name: z.string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters"),
  tank_id: z.string({ required_error: "Tank selection is required" })
});

// Type based on schema
type FillingSystemFormData = z.infer<typeof fillingSystemSchema>;

export function FillingSystemFormStandardized({
  open,
  onOpenChange,
  onSuccess,
}: FillingSystemFormStandardizedProps) {
  const { toast } = useToast();
  
  // Initialize form with Zod validation
  const form = useZodForm({
    schema: fillingSystemSchema,
    defaultValues: {
      name: "",
      tank_id: "",
    },
  });

  const { data: tanks } = useQuery({
    queryKey: ["fuel-tanks"],
    queryFn: fetchFuelTanks,
  });

  // Format tanks as options for select
  const tankOptions = tanks?.map(tank => ({
    value: tank.id,
    label: `${tank.name} (${tank.fuel_type})`
  })) || [];

  // Form submission handler
  const { isSubmitting, onSubmit: handleSubmit } = useFormSubmitHandler<FillingSystemFormData>(
    form,
    async (data) => {
      try {
        await createFillingSystem(data.name, data.tank_id);
        toast({
          title: "Success",
          description: "Filling system created successfully",
        });
        form.reset();
        onSuccess();
        return true;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create filling system",
          variant: "destructive",
        });
        return false;
      }
    }
  );

  // Create form actions
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
      <Button type="submit" disabled={isSubmitting} form="filling-system-form">
        {isSubmitting ? "Creating..." : "Create System"}
      </Button>
    </div>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Filling System"
      description="Create a new filling system connected to a fuel tank"
      maxWidth="sm:max-w-[425px]"
      actions={formActions}
    >
      <form id="filling-system-form" onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          name="name"
          label="System Name"
          form={form}
          placeholder="Enter system name"
          autoComplete="off"
        />
        
        <FormSelect
          name="tank_id"
          label="Associated Tank"
          form={form}
          options={tankOptions}
          placeholder="Select a tank"
        />
      </form>
    </StandardDialog>
  );
} 