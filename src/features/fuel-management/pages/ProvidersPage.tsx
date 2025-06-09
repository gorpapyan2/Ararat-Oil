import React, { useState, useCallback } from 'react';
import { 
  Truck, 
  Users, 
  FileText, 
  BarChart3,
  DollarSign,
  Calendar,
  CheckCircle,
  TrendingUp,
  Pencil,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { NavigationCard } from '@/shared/components/navigation/NavigationCard';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { useToast } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PetrolProvider, petrolProvidersApi } from '@/core/api';

// UI Components
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/core/components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/core/components/ui/alert-dialog";
import { Button } from '@/core/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/core/components/ui/tabs';
import { Input } from '@/core/components/ui/input';
import { Badge } from '@/core/components/ui/badge';
import { ProviderDialogStandardized } from "../components/ProviderDialogStandardized";

interface ProviderModule {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}


export default function ProvidersPage() {
  const [activeTab, setActiveTab] = useState<string>("directory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<PetrolProvider | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Fuel Operations', href: '/fuel' },
    { label: 'Providers', href: '/fuel/providers' }
  ];

  // Fetch providers data
  const { data: providersResponse, isLoading, refetch } = useQuery({
    queryKey: ["petrol-providers"],
    queryFn: petrolProvidersApi.getPetrolProviders,
  });

  // Extract providers from the API response
  const providers = providersResponse?.data || [];
  
  // Filter providers based on search term
  const filteredProviders = providers.filter(provider => 
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (provider.contact_info && provider.contact_info.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Provider mutations
  const createMutation = useMutation({
    mutationFn: petrolProvidersApi.createPetrolProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
      toast({
        title: t("common.success"),
        description: t("petrolProviders.providerCreated", "Provider created successfully"),
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PetrolProvider> }) =>
      petrolProvidersApi.updatePetrolProvider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
      toast({
        title: t("common.success"),
        description: t("petrolProviders.providerUpdated", "Provider updated successfully"),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: petrolProvidersApi.deletePetrolProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
      toast({
        title: t("common.success"),
        description: t("petrolProviders.providerDeleted", "Provider deleted successfully"),
      });
    },
  });

  // Dialog handlers
  const handleOpenCreateDialog = useCallback(
    () => setIsCreateDialogOpen(true),
    []
  );
  
  const handleOpenEditDialog = useCallback((provider: PetrolProvider) => {
    setSelectedProvider(provider);
    setIsEditDialogOpen(true);
  }, []);
  
  const handleOpenDeleteDialog = useCallback((provider: PetrolProvider) => {
    setSelectedProvider(provider);
    setIsDeleteDialogOpen(true);
  }, []);
  
  const handleDeleteProvider = useCallback(() => {
    if (selectedProvider) {
      deleteMutation.mutate(selectedProvider.id);
      setIsDeleteDialogOpen(false);
      setSelectedProvider(null);
    }
  }, [selectedProvider, deleteMutation]);

  // Form handlers
  const handleCreateSubmit = async (data: { name: string; contact?: string }) => {
    await createMutation.mutateAsync({
      name: data.name,
      contact: data.contact,
      contact_info: data.contact,
      is_active: true,
    });
  };

  const handleUpdateSubmit = async (data: { name: string; contact?: string }) => {
    if (!selectedProvider) return;
    await updateMutation.mutateAsync({
      id: selectedProvider.id,
      data: {
        name: data.name,
        contact: data.contact,
        contact_info: data.contact,
      },
    });
  };

  return (
    <WindowContainer
      title="Providers Management"
      subtitle="Supplier management and provider relationships for fuel procurement"
      breadcrumbItems={breadcrumbItems}
    >
      {/* Stats Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span><strong className="text-card-foreground">{providers.length}</strong> total providers</span>
            <span><strong className="text-card-foreground">{providers.filter(p => p.is_active).length}</strong> active</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => refetch()}
              disabled={isLoading}
              className="p-2 text-muted-foreground hover:text-card-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            >
              <Filter className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleOpenCreateDialog}
              className="px-3 py-1.5 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1 inline" />
              Add Provider
            </button>
          </div>
        </div>
      </div>

          {/* Search and Filter Row */}
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-sm h-9"
              />
            </div>
          </div>

          {/* Providers Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Information</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Loading providers...
                    </TableCell>
                  </TableRow>
                ) : filteredProviders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      {searchTerm 
                        ? "No providers match your search criteria" 
                        : "No providers found. Click 'Add Provider' to create one."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                            <Users className="w-3 h-3 text-accent-foreground" />
                          </div>
                          <span className="font-medium">{provider.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{provider.contact || provider.contact_info || "No contact info"}</TableCell>
                      <TableCell>
                        <Badge variant={provider.is_active ? "success" : "secondary"}>
                          {provider.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditDialog(provider)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDeleteDialog(provider)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

      <ProviderDialogStandardized
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        title="Add Provider"
      />

      {/* Edit Dialog */}
      <ProviderDialogStandardized
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedProvider(null);
        }}
        onSubmit={handleUpdateSubmit}
        initialData={selectedProvider ? {
          name: selectedProvider.name,
          contact: selectedProvider.contact || selectedProvider.contact_info,
        } : undefined}
        title="Edit Provider"
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Provider
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this provider? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProvider} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </WindowContainer>
  );
}
