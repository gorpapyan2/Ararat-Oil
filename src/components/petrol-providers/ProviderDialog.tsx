import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PetrolProvider } from "@/services/petrol-providers";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface ProviderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; contact: string }) => Promise<any>;
  initialData?: PetrolProvider;
  title: string;
}

export function ProviderDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: ProviderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      contact: initialData?.contact || "",
    },
  });

  const handleSubmit = async (data: { name: string; contact: string }) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("petrolProviders.saveError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("petrolProviders.providerName")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("petrolProviders.providerName")} />
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
                  <FormLabel>{t("petrolProviders.contact")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("petrolProviders.contactInformation")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {t("common.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
