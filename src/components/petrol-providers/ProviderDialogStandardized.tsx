import { useState, useEffect } from "react";
import { z } from "zod";
import { StandardDialog } from "@/components/ui/composed/dialog";
import { Button } from "@/components/ui/button";
import { PetrolProvider } from "@/services/petrol-providers";
import { useToast } from "@/hooks";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";

// Define Zod schema for validation
const providerSchema = z.object({
  name: z.string({ required_error: "Provider name is required" })
    .min(2, "Provider name must be at least 2 characters"),
  contact: z.string({ required_error: "Contact information is required" })
    .min(5, "Contact information must be at least 5 characters"),
});

// Type based on schema
type ProviderFormData = z.infer<typeof providerSchema>;

interface ProviderDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProviderFormData) => Promise<any>;
  initialData?: PetrolProvider;
  title: string;
}

export function ProviderDialogStandardized({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
}: ProviderDialogStandardizedProps) {
  const { toast } = useToast();
  const { t } = useTranslation();

  // Initialize form with Zod validation
  const form = useZodForm({
    schema: providerSchema,
    defaultValues: {
      name: "",
      contact: "",
    },
  });

  // Set form values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        contact: initialData.contact || "",
      });
    } else {
      form.reset({
        name: "",
        contact: "",
      });
    }
  }, [initialData, form]);

  // Form submission handler
  const { isSubmitting, onSubmit: handleSubmit } = useFormSubmitHandler<ProviderFormData>(
    form,
    async (data) => {
      try {
        await onSubmit(data);
        form.reset();
        onOpenChange(false);
        return true;
      } catch (error) {
        toast({
          title: t("common.error"),
          description: t("petrolProviders.saveError"),
          variant: "destructive",
        });
        return false;
      }
    }
  );

  // Create form actions
  const formActions = (
    <div className="flex justify-end gap-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => onOpenChange(false)}
        disabled={isSubmitting}
      >
        {t("common.cancel")}
      </Button>
      <Button type="submit" disabled={isSubmitting} form="provider-form">
        {isSubmitting ? t("common.saving") : t("common.save")}
      </Button>
    </div>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      actions={formActions}
      maxWidth="sm:max-w-[425px]"
    >
      <form id="provider-form" onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          name="name"
          label={t("petrolProviders.providerName")}
          form={form}
          placeholder={t("petrolProviders.providerName")}
          autoComplete="organization"
        />

        <FormInput
          name="contact"
          label={t("petrolProviders.contact")}
          form={form}
          placeholder={t("petrolProviders.contactInformation")}
          autoComplete="tel"
        />
      </form>
    </StandardDialog>
  );
} 