import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { StandardDialog } from '@/shared/components/common/dialog/StandardDialog';
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
              aria-invalid={!!form.formState.errors.name}
              aria-describedby={form.formState.errors.name ? "name-error" : undefined}
            />
            {form.formState.errors.name && (
              <p id="name-error" className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="contact_person">{t('petrol-providers.contact_person')}</label>
            <Input
              id="contact_person"
              {...form.register('contact_person')}
              aria-invalid={!!form.formState.errors.contact_person}
              aria-describedby={form.formState.errors.contact_person ? "contact_person-error" : undefined}
            />
            {form.formState.errors.contact_person && (
              <p id="contact_person-error" className="text-sm text-red-500">
                {form.formState.errors.contact_person.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="phone">{t('petrol-providers.phone')}</label>
            <Input
              id="phone"
              {...form.register('phone')}
              aria-invalid={!!form.formState.errors.phone}
              aria-describedby={form.formState.errors.phone ? "phone-error" : undefined}
            />
            {form.formState.errors.phone && (
              <p id="phone-error" className="text-sm text-red-500">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="email">{t('petrol-providers.email')}</label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              aria-invalid={!!form.formState.errors.email}
              aria-describedby={form.formState.errors.email ? "email-error" : undefined}
            />
            {form.formState.errors.email && (
              <p id="email-error" className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="address">{t('petrol-providers.address')}</label>
          <Input
            id="address"
            {...form.register('address')}
            aria-invalid={!!form.formState.errors.address}
            aria-describedby={form.formState.errors.address ? "address-error" : undefined}
          />
          {form.formState.errors.address && (
            <p id="address-error" className="text-sm text-red-500">
              {form.formState.errors.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="tax_id">{t('petrol-providers.tax_id')}</label>
            <Input
              id="tax_id"
              {...form.register('tax_id')}
              aria-invalid={!!form.formState.errors.tax_id}
              aria-describedby={form.formState.errors.tax_id ? "tax_id-error" : undefined}
            />
            {form.formState.errors.tax_id && (
              <p id="tax_id-error" className="text-sm text-red-500">
                {form.formState.errors.tax_id.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="bank_account">{t('petrol-providers.bank_account')}</label>
            <Input
              id="bank_account"
              {...form.register('bank_account')}
              aria-invalid={!!form.formState.errors.bank_account}
              aria-describedby={form.formState.errors.bank_account ? "bank_account-error" : undefined}
            />
            {form.formState.errors.bank_account && (
              <p id="bank_account-error" className="text-sm text-red-500">
                {form.formState.errors.bank_account.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes">{t('petrol-providers.notes')}</label>
          <Textarea
            id="notes"
            {...form.register('notes')}
            aria-invalid={!!form.formState.errors.notes}
            aria-describedby={form.formState.errors.notes ? "notes-error" : undefined}
          />
          {form.formState.errors.notes && (
            <p id="notes-error" className="text-sm text-red-500">
              {form.formState.errors.notes.message}
            </p>
          )}
        </div>
      </form>
    </StandardDialog>
  );
} 