import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { ProviderDialogStandardized } from "./ProviderDialogStandardized";
import { fetchPetrolProviders, deletePetrolProvider } from "@/services/petrol-providers";
import { PetrolProvider } from "@/types";

interface ProviderManagerStandardizedProps {
  onRenderAction?: (action: React.ReactNode) => void;
}

export function ProviderManagerStandardized({ onRenderAction }: ProviderManagerStandardizedProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<PetrolProvider | null>(null);

  // Fetch providers with expanded error handling
  const { data: providers, isLoading, error, isError } = useQuery({
    queryKey: ["petrol-providers"],
    queryFn: async () => {
      console.log("Fetching petrol providers from ProviderManagerStandardized");
      try {
        const result = await fetchPetrolProviders({ activeOnly: false });
        console.log("Provider fetch result:", result);
        return result as PetrolProvider[];
      } catch (error) {
        console.error("Error in provider fetch queryFn:", error);
        throw error;
      }
    },
    retry: 2
  });

  // Delete provider mutation
  const deleteMutation = useMutation({
    mutationFn: deletePetrolProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
      toast.success(t("providers.success.deleted"));
    },
    onError: (error) => {
      toast.error(t("providers.error.delete"));
      console.error("Error deleting provider:", error);
    },
  });

  // Filter providers based on search query
  const filteredProviders = providers && providers.length > 0
    ? providers.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.contact.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Log providers data for debugging
  React.useEffect(() => {
    console.log("Providers data:", providers);
    console.log("Filtered providers:", filteredProviders);
  }, [providers, filteredProviders]);

  // Handle provider actions
  const handleEdit = useCallback((provider: PetrolProvider) => {
    setSelectedProvider(provider);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback((provider: PetrolProvider) => {
    if (window.confirm(t("providers.confirmDelete"))) {
      deleteMutation.mutate(provider.id);
    }
  }, [deleteMutation, t]);

  const handleCreate = useCallback(() => {
    setSelectedProvider(null);
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedProvider(null);
  }, []);

  // Render action button
  React.useEffect(() => {
    if (onRenderAction) {
      onRenderAction(
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          {t("providers.addProvider")}
        </Button>
      );
    }
  }, [onRenderAction, handleCreate, t]);

  if (isLoading) {
    return <div>{t("common.loading")}</div>;
  }

  if (isError) {
    return (
      <div className="p-4 border border-destructive rounded-md bg-destructive/10">
        <h3 className="text-lg font-medium text-destructive mb-2">{t("providers.error.fetch")}</h3>
        <p className="text-sm text-muted-foreground">{String(error)}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["petrol-providers"] })}
        >
          {t("common.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("providers.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("providers.name")}</TableHead>
              <TableHead>{t("providers.contact")}</TableHead>
              <TableHead>{t("providers.status")}</TableHead>
              <TableHead>{t("providers.createdAt")}</TableHead>
              <TableHead className="w-[100px]">{t("providers.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!filteredProviders || filteredProviders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  {t("providers.noProviders")}
                </TableCell>
              </TableRow>
            ) : (
              filteredProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>{provider.contact}</TableCell>
                  <TableCell>
                    <Badge variant={provider.is_active ? "default" : "secondary"}>
                      {provider.is_active ? t("providers.active") : t("providers.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {provider.created_at
                      ? format(new Date(provider.created_at), "PP")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(provider)}>
                          {t("common.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(provider)}
                          className="text-destructive"
                        >
                          {t("common.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProviderDialogStandardized
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        provider={selectedProvider}
        onClose={handleDialogClose}
      />
    </div>
  );
} 