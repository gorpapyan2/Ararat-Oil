import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { usePetrolProviders } from '../hooks/usePetrolProviders';
import { ProviderDialogStandardized } from './ProviderDialogStandardized';
import { DeleteConfirmDialogStandardized } from './DeleteConfirmDialogStandardized';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search } from 'lucide-react';
import type { PetrolProvider, PetrolProviderFormData } from '../types/petrol-providers.types';

interface ProviderManagerStandardizedProps {
  onRenderAction?: (action: React.ReactNode) => void;
}

export function ProviderManagerStandardized({ onRenderAction }: ProviderManagerStandardizedProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<PetrolProvider | null>(null);

  const {
    providers,
    isLoading,
    createProvider,
    updateProvider,
    deleteProvider,
  } = usePetrolProviders({ searchQuery });

  const handleAddProvider = useCallback(async (data: PetrolProviderFormData) => {
    try {
      await createProvider.mutateAsync(data);
      setIsAddDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('petrol-providers.provider_added'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('petrol-providers.error_adding_provider'),
        variant: 'destructive',
      });
    }
  }, [createProvider, toast, t]);

  const handleEditProvider = useCallback(async (data: PetrolProviderFormData) => {
    if (!selectedProvider) return;

    try {
      await updateProvider.mutateAsync({ id: selectedProvider.id, data });
      setIsAddDialogOpen(false);
      setSelectedProvider(null);
      toast({
        title: t('common.success'),
        description: t('petrol-providers.provider_updated'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('petrol-providers.error_updating_provider'),
        variant: 'destructive',
      });
    }
  }, [updateProvider, selectedProvider, toast, t]);

  const handleDeleteProvider = useCallback(async () => {
    if (!selectedProvider) return;

    try {
      await deleteProvider.mutateAsync(selectedProvider.id);
      setIsDeleteDialogOpen(false);
      setSelectedProvider(null);
      toast({
        title: t('common.success'),
        description: t('petrol-providers.provider_deleted'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('petrol-providers.error_deleting_provider'),
        variant: 'destructive',
      });
    }
  }, [deleteProvider, selectedProvider, toast, t]);

  const handleEdit = useCallback((provider: PetrolProvider) => {
    setSelectedProvider(provider);
    setIsAddDialogOpen(true);
  }, []);

  const handleDelete = useCallback((provider: PetrolProvider) => {
    setSelectedProvider(provider);
    setIsDeleteDialogOpen(true);
  }, []);

  const actionElement = (
    <Button onClick={() => setIsAddDialogOpen(true)}>
      <Plus className="mr-2 h-4 w-4" />
      {t('petrol-providers.add_provider')}
    </Button>
  );

  if (onRenderAction) {
    onRenderAction(actionElement);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('petrol-providers.search_providers')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
        </div>
        {!onRenderAction && actionElement}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('petrol-providers.name')}</TableHead>
              <TableHead>{t('petrol-providers.contact_person')}</TableHead>
              <TableHead>{t('petrol-providers.phone')}</TableHead>
              <TableHead>{t('petrol-providers.email')}</TableHead>
              <TableHead>{t('petrol-providers.tax_id')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {t('common.loading')}
                </TableCell>
              </TableRow>
            ) : providers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {t('petrol-providers.no_providers')}
                </TableCell>
              </TableRow>
            ) : (
              providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>{provider.contact_person}</TableCell>
                  <TableCell>{provider.phone}</TableCell>
                  <TableCell>{provider.email}</TableCell>
                  <TableCell>{provider.tax_id}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(provider)}
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(provider)}
                    >
                      {t('common.delete')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProviderDialogStandardized
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={selectedProvider ? handleEditProvider : handleAddProvider}
        provider={selectedProvider || undefined}
        isLoading={createProvider.isPending || updateProvider.isPending}
      />

      {selectedProvider && (
        <DeleteConfirmDialogStandardized
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteProvider}
          provider={selectedProvider}
          isLoading={deleteProvider.isPending}
        />
      )}
    </div>
  );
} 