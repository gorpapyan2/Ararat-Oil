import { StandardDialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTankDialog, tankFormSchema, TankFormData } from "@/hooks/useTankDialog";
import { useZodForm } from "@/hooks/use-form";
import { FormInput, FormSelect } from "@/components/ui/composed/form-fields";
import { ConfirmAddTankDialogStandardized } from "./ConfirmAddTankDialogStandardized";

interface TankFormDialogStandardizedProps {
  onSuccess?: () => void;
}

export function TankFormDialogStandardized({ 
  onSuccess 
}: TankFormDialogStandardizedProps) {
  const {
    isFormOpen,
    setIsFormOpen,
    isConfirmOpen,
    setIsConfirmOpen,
    isSubmitting,
    pendingTankData,
    handleFormSubmit,
    handleConfirm,
    handleCancel,
    fuelTypeOptions,
  } = useTankDialog({ 
    onSuccess 
  });

  const form = useZodForm({
    schema: tankFormSchema,
    defaultValues: {
      name: "",
      fuel_type: undefined,
      capacity: 0,
      current_level: 0,
    },
  });

  const onSubmit = (data: TankFormData) => {
    const validationResult = handleFormSubmit(data);
    if (validationResult) {
      form.setError(validationResult.error as any, {
        type: "manual",
        message: validationResult.message,
      });
    }
  };

  return (
    <>
      <StandardDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title="Add New Fuel Tank"
        description="Enter the details of the new fuel tank"
        maxWidth="sm:max-w-[450px]"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsFormOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Tank"}
            </Button>
          </div>
        </form>
      </StandardDialog>

      <ConfirmAddTankDialogStandardized
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={isSubmitting}
        data={pendingTankData}
      />
    </>
  );
} 