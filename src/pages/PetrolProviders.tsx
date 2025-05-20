import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { useToast } from "@/hooks";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/core/components/ui/table';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/core/components/ui/alert-dialog';
import { ProviderDialogStandardized } from "@/features/petrol-providers/components/ProviderDialogStandardized";
import { petrolProvidersApi, type PetrolProvider } from "@/core/api";
import { useTranslation } from "react-i18next";
import { CreateButton } from '@/core/components/ui/create-button';
import { IconButton } from '@/core/components/ui/icon-button';
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

export default function PetrolProviders() {
  const [selectedProvider, setSelectedProvider] =
    useState<PetrolProvider | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: providers = [] } = useQuery({
    queryKey: ["petrol-providers"],
    queryFn: petrolProvidersApi.getPetrolProviders,
  });

  const createMutation = useMutation({
    mutationFn: petrolProvidersApi.createPetrolProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
      toast({ title: t("common.success"), description: t("petrolProviders.providerCreated") });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PetrolProvider> }) =>
      petrolProvidersApi.updatePetrolProvider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
      toast({ title: t("common.success"), description: t("petrolProviders.providerUpdated") });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: petrolProvidersApi.deletePetrolProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
      toast({ title: t("common.success"), description: t("petrolProviders.providerDeleted") });
    },
  });

  const handleOpenCreateDialog = useCallback(() => setIsCreateDialogOpen(true), []);
  const handleOpenEditDialog = useCallback((provider: PetrolProvider) => {
    setSelectedProvider(provider);
    setIsEditDialogOpen(true);
  }, []);
  const handleOpenDeleteDialog = useCallback((provider: PetrolProvider) => {
    setSelectedProvider(provider);
    setIsDeleteDialogOpen(true);
  }, []);
  const handleCloseEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setSelectedProvider(null);
  }, []);
  const handleDeleteProvider = useCallback(() => {
    if (selectedProvider) {
      deleteMutation.mutate(selectedProvider.id);
      setIsDeleteDialogOpen(false);
      setSelectedProvider(null);
    }
  }, [selectedProvider, deleteMutation]);

  usePageBreadcrumbs({
    segments: [
      { name: "Dashboard", href: "/" },
      { name: "Providers", href: "/providers", isCurrent: true }
    ],
    title: "Providers"
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t("petrolProviders.title")}</h1>
        <CreateButton 
          onClick={handleOpenCreateDialog}
          label={t("petrolProviders.addProvider")}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("common.name")}</TableHead>
            <TableHead>{t("petrolProviders.contact")}</TableHead>
            <TableHead>{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((provider) => (
            <TableRow key={provider.id}>
              <TableCell>{provider.name}</TableCell>
              <TableCell>{provider.contact}</TableCell>
              <TableCell className="space-x-2">
                <IconButton
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenEditDialog(provider)}
                  icon={<Pencil className="h-4 w-4" />}
                  ariaLabel={t("common.edit")}
                />
                <IconButton
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenDeleteDialog(provider)}
                  icon={<Trash2 className="h-4 w-4" />}
                  ariaLabel={t("common.delete")}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProviderDialogStandardized
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={createMutation.mutateAsync}
        title={t("petrolProviders.addProvider")}
      />

      <ProviderDialogStandardized
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedProvider(null);
        }}
        onSubmit={(data) =>
          updateMutation.mutateAsync({
            id: selectedProvider!.id,
            data,
          })
        }
        initialData={selectedProvider ?? undefined}
        title={t("petrolProviders.editProvider")}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("petrolProviders.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("petrolProviders.deleteConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProvider}>
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
