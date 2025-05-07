import React from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createPetrolProvider, updatePetrolProvider } from "@/services/petrol-providers";
import { PetrolProvider } from "@/types";

// Define the form schema
const providerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().min(1, "Contact information is required"),
  is_active: z.boolean().default(true),
});

type ProviderFormValues = z.infer<typeof providerSchema>;

interface ProviderDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: PetrolProvider | null;
  onClose: () => void;
}

export function ProviderDialogStandardized({
  open,
  onOpenChange,
  provider,
  onClose,
}: ProviderDialogStandardizedProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isEditing = !!provider;

  // Initialize form
  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: provider?.name || "",
      contact: provider?.contact || "",
      is_active: provider?.is_active ?? true,
    },
  });

  // Create provider mutation
  const createMutation = useMutation({
    mutationFn: createPetrolProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
      toast.success(t("providers.success.created"));
      onClose();
    },
    onError: (error) => {
      toast.error(t("providers.error.create"));
      console.error("Error creating provider:", error);
    },
  });

  // Update provider mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PetrolProvider> }) =>
      updatePetrolProvider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
      toast.success(t("providers.success.updated"));
      onClose();
    },
    onError: (error) => {
      toast.error(t("providers.error.update"));
      console.error("Error updating provider:", error);
    },
  });

  // Handle form submission
  const onSubmit = (data: ProviderFormValues) => {
    if (isEditing && provider) {
      updateMutation.mutate({ id: provider.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("providers.edit") : t("providers.create")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("providers.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("providers.contact")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("providers.status")}
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {field.value ? t("providers.active") : t("providers.inactive")}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {isEditing ? t("common.save") : t("common.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 