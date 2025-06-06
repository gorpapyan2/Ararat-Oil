import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/core/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/ui/form';
import { Input } from '@/core/components/ui/input';
import { Button } from '@/core/components/ui/button';
import { useTranslation } from 'react-i18next';

const providerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact: z.string().optional(),
});

type ProviderFormData = z.infer<typeof providerSchema>;

interface ProviderDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProviderFormData) => Promise<void>;
  title: string;
  initialData?: Partial<ProviderFormData>;
}

export function ProviderDialogStandardized({
  open,
  onOpenChange,
  onSubmit,
  title,
  initialData,
}: ProviderDialogStandardizedProps) {
  const { t } = useTranslation();
  
  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: initialData?.name || '',
      contact: initialData?.contact || '',
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || '',
        contact: initialData.contact || '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: ProviderFormData) => {
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting provider:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? t('petrolProviders.editDescription') : t('petrolProviders.createDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('petrolProviders.namePlaceholder')} {...field} />
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
                  <FormLabel>{t('petrolProviders.contact')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('petrolProviders.contactPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('common.saving') : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 