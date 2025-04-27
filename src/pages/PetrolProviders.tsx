import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ProviderDialog } from "@/components/petrol-providers/ProviderDialog";
import {
  fetchPetrolProviders,
  createPetrolProvider,
  updatePetrolProvider,
  deletePetrolProvider,
  type PetrolProvider,
} from "@/services/petrol-providers";
import { useTranslation } from "react-i18next";

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
    queryFn: fetchPetrolProviders,
  });

  const createMutation = useMutation({
    mutationFn: createPetrolProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
      toast({ title: t("common.success"), description: t("petrolProviders.providerCreated") });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PetrolProvider> }) =>
      updatePetrolProvider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
      toast({ title: t("common.success"), description: t("petrolProviders.providerUpdated") });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePetrolProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
      toast({ title: t("common.success"), description: t("petrolProviders.providerDeleted") });
    },
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t("petrolProviders.title")}</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          {t("petrolProviders.addProvider")}
        </Button>
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedProvider(provider);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedProvider(provider);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProviderDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={createMutation.mutateAsync}
        title={t("petrolProviders.addProvider")}
      />

      <ProviderDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedProvider(null);
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
            <AlertDialogAction
              onClick={() => {
                if (selectedProvider) {
                  deleteMutation.mutate(selectedProvider.id);
                  setIsDeleteDialogOpen(false);
                  setSelectedProvider(null);
                }
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
