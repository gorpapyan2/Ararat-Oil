import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { StandardDialog } from '@/components/common/StandardDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { PetrolProvider, PetrolProviderFormData } from '../types/petrol-providers.types';

const providerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact_person: z.string().min(1, 'Contact person is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  tax_id: z.string().min(1, 'Tax ID is required'),
  bank_account: z.string().min(1, 'Bank account is required'),
  notes: z.string().optional(),
});

interface ProviderDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PetrolProviderFormData) => void;
  provider?: PetrolProvider;
  isLoading?: boolean;
}

export function ProviderDialogStandardized({
  open,
  onOpenChange,
  onSubmit,
  provider,
  isLoading,
}: ProviderDialogStandardizedProps) {
  const { t } = useTranslation();
  const isEditing = !!provider;

  const form = useForm<PetrolProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: provider || {
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      tax_id: '',
      bank_account: '',
      notes: '',
    },
  });

  const handleSubmit = (data: PetrolProviderFormData) => {
    onSubmit(data);
  };

  const dialogActions = (
    <>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        {t('common.cancel')}
      </Button>
      <Button onClick={form.handleSubmit(handleSubmit)} disabled={isLoading}>
        {isLoading ? t('common.saving') : isEditing ? t('common.save') : t('common.create')}
      </Button>
    </>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? t('petrol-providers.edit_provider') : t('petrol-providers.add_provider')}
      description={isEditing ? t('petrol-providers.edit_provider_description') : t('petrol-providers.add_provider_description')}
      actions={dialogActions}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name">{t('petrol-providers.name')}</label>
            <Input
              id="name"
              {...form.register('name')}
              error={form.formState.errors.name?.message}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="contact_person">{t('petrol-providers.contact_person')}</label>
            <Input
              id="contact_person"
              {...form.register('contact_person')}
              error={form.formState.errors.contact_person?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="phone">{t('petrol-providers.phone')}</label>
            <Input
              id="phone"
              {...form.register('phone')}
              error={form.formState.errors.phone?.message}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email">{t('petrol-providers.email')}</label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              error={form.formState.errors.email?.message}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="address">{t('petrol-providers.address')}</label>
          <Input
            id="address"
            {...form.register('address')}
            error={form.formState.errors.address?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="tax_id">{t('petrol-providers.tax_id')}</label>
            <Input
              id="tax_id"
              {...form.register('tax_id')}
              error={form.formState.errors.tax_id?.message}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="bank_account">{t('petrol-providers.bank_account')}</label>
            <Input
              id="bank_account"
              {...form.register('bank_account')}
              error={form.formState.errors.bank_account?.message}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes">{t('petrol-providers.notes')}</label>
          <Textarea
            id="notes"
            {...form.register('notes')}
            error={form.formState.errors.notes?.message}
          />
        </div>
      </form>
    </StandardDialog>
  );
} 