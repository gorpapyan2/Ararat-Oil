import { z } from "zod";
import { StandardDialog } from "@/core/components/ui/composed/base-dialog";
import { Button } from "@/core/components/ui/button";
import { useToast } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { tanksApi } from "@/core/api";
import {
  FormInput,
  FormSelect,
} from "@/core/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/shared/hooks/use-form";
import { useTranslation } from "react-i18next";
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";
import { useFillingSystem } from "../hooks/useFillingSystem";

interface FillingSystemFormStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Define Zod schema for validation
const fillingSystemSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters"),
  tank_id: z.string({ required_error: "Tank selection is required" }),
});

// Type based on schema
type FillingSystemFormData = z.infer<typeof fillingSystemSchema>;

export function FillingSystemFormStandardized({
  open,
  onOpenChange,
  onSuccess,
}: FillingSystemFormStandardizedProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { useCreateFillingSystemMutation } = useFillingSystem();
  const createFillingSystemMutation = useCreateFillingSystemMutation();

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
    queryFn: tanksApi.getTanks,
  });

  // Format tanks as options for select
  const tankOptions =
    tanks?.data?.map((tank) => ({
      value: tank.id,
      label: `${tank.name} (${tank.fuel_type_id})`,
    })) || [];

  // Get translated strings or use API translation helpers
  const title =
    t("fillingSystems.addSystem") ||
    getApiActionLabel(apiNamespaces.fillingSystems, "create");
  const description =
    t("fillingSystems.addSystemDescription") ||
    "Create a new filling system connected to a fuel tank";
  const cancelButton = t("common.cancel") || "Cancel";
  const createButton = t("common.create") || "Create System";
  const creatingButton = t("common.creating") || "Creating...";
  const systemNameLabel = t("fillingSystems.systemName") || "System Name";
  const systemNamePlaceholder =
    t("fillingSystems.enterSystemName") || "Enter system name";
  const tankLabel = t("fillingSystems.associatedTank") || "Associated Tank";
  const tankPlaceholder = t("fillingSystems.selectTank") || "Select a tank";

  // Form submission handler
  const { isSubmitting, onSubmit: handleSubmit } =
    useFormSubmitHandler<FillingSystemFormData>(form, async (data) => {
      try {
        // Use the mutation from our hook
        await createFillingSystemMutation.mutateAsync({
          name: data.name,
          tank_id: data.tank_id,
          location: "Default Location",
          status: "active",
          type: "standard",
        });
        form.reset();
        onSuccess();
        return true;
      } catch (error) {
        return false;
      }
    });

  // Create form actions
  const formActions = (
    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isSubmitting}
      >
        {cancelButton}
      </Button>
      <Button type="submit" disabled={isSubmitting} form="filling-system-form">
        {isSubmitting ? creatingButton : createButton}
      </Button>
    </div>
  );

  return (
    <StandardDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      className="sm:max-w-[425px]"
      footer={formActions}
    >
      <form
        id="filling-system-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <FormInput
          name="name"
          label={systemNameLabel}
          form={form}
          placeholder={systemNamePlaceholder}
        />

        <FormSelect
          name="tank_id"
          label={tankLabel}
          form={form}
          options={tankOptions}
          placeholder={tankPlaceholder}
        />
      </form>
    </StandardDialog>
  );
}
