import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FlaskConical, 
  Plus, 
  Pencil,
  Trash2,
  Search,
  Filter
} from 'lucide-react';

// Import UI components
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
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
import { Input } from '@/core/components/ui/input';
import { Badge } from '@/core/components/ui/badge';
import { useToast } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FuelType } from "@/shared/types/tank.types";
import { fuelTypesApi } from '@/core/api/endpoints/fuel-types';
import { FuelTypeDialogStandardized } from "../components/FuelTypeDialogStandardized";

export default function FuelTypesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Fuel Operations', href: '/fuel' },
    { label: 'Fuel Types', href: '/fuel/types' }
  ];

  // Fetch fuel types data
  const { data: fuelTypesResponse, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["fuel-types"],
    queryFn: () => fuelTypesApi.getFuelTypes(),
    retry: 1
  });

  // Handle API errors
  React.useEffect(() => {
    if (isError) {
      console.error("Error fetching fuel types:", error);
      toast({
        title: "Error",
        description: "Failed to load fuel types. Please try again later.",
        variant: "destructive"
      });
    }
  }, [isError, error, toast]);

  // Extract fuel types from the API response
  const fuelTypes: FuelType[] = fuelTypesResponse?.data || [];
  
  // Filter fuel types based on search term
  const filteredFuelTypes = fuelTypes.filter((fuelType: FuelType) => 
    fuelType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (fuelType.code && fuelType.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (fuelType.description && fuelType.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Fuel Type mutations
  const createMutation = useMutation({
    mutationFn: fuelTypesApi.createFuelType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-types"] });
      toast({
        title: t("common.success"),
        description: t("fuelTypes.fuelTypeCreated", "Fuel type created successfully"),
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FuelType> }) =>
      fuelTypesApi.updateFuelType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-types"] });
      toast({
        title: t("common.success"),
        description: t("fuelTypes.fuelTypeUpdated", "Fuel type updated successfully"),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: fuelTypesApi.deleteFuelType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-types"] });
      toast({
        title: t("common.success"),
        description: t("fuelTypes.fuelTypeDeleted", "Fuel type deleted successfully"),
      });
    },
  });

  // Dialog handlers
  const handleOpenCreateDialog = useCallback(
    () => setIsCreateDialogOpen(true),
    []
  );
  
  const handleOpenEditDialog = useCallback((fuelType: FuelType) => {
    setSelectedFuelType(fuelType);
    setIsEditDialogOpen(true);
  }, []);
  
  const handleOpenDeleteDialog = useCallback((fuelType: FuelType) => {
    setSelectedFuelType(fuelType);
    setIsDeleteDialogOpen(true);
  }, []);
  
  const handleDeleteFuelType = useCallback(() => {
    if (selectedFuelType) {
      deleteMutation.mutate(selectedFuelType.id);
      setIsDeleteDialogOpen(false);
      setSelectedFuelType(null);
    }
  }, [selectedFuelType, deleteMutation]);

  // Form handlers
  const handleCreateSubmit = async (data: { name: string; code?: string; description?: string }) => {
    await createMutation.mutateAsync({
      name: data.name,
      code: data.code,
      description: data.description,
    });
  };

  const handleUpdateSubmit = async (data: { name: string; code?: string; description?: string }) => {
    if (!selectedFuelType) return;
    await updateMutation.mutateAsync({
      id: selectedFuelType.id,
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
      },
    });
  };

  // Quick stats data calculation
  const totalTypes = fuelTypes.length;
  
  return (
    <WindowContainer
      title="Fuel Types"
      subtitle="Manage fuel specifications and properties for your station"
      breadcrumbItems={breadcrumbItems}
    >
      {/* Stats Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span><strong className="text-card-foreground">{totalTypes}</strong> total fuel types</span>
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
              Add Fuel Type
            </button>
          </div>
        </div>
      </div>

      {/* Search Filter Row */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search fuel types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-sm h-9"
          />
        </div>
      </div>

      {/* Fuel Types Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Loading fuel types...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-destructive">
                  Error loading fuel types. Please try refreshing the page.
                </TableCell>
              </TableRow>
            ) : filteredFuelTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  {searchTerm 
                    ? "No fuel types match your search criteria" 
                    : "No fuel types found. Click 'Add Fuel Type' to create one."}
                </TableCell>
              </TableRow>
            ) : (
              filteredFuelTypes.map((fuelType: FuelType) => (
                <TableRow key={fuelType.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <FlaskConical className="w-3 h-3 text-accent-foreground" />
                      </div>
                      <span className="font-medium">{fuelType.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {fuelType.code ? (
                      <Badge variant="outline" className="text-xs">
                        {fuelType.code}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">No code</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {fuelType.description || "No description"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditDialog(fuelType)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDeleteDialog(fuelType)}
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

      {/* Create Dialog */}
      <FuelTypeDialogStandardized
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        title="Add Fuel Type"
      />

      {/* Edit Dialog */}
      <FuelTypeDialogStandardized
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedFuelType(null);
        }}
        onSubmit={handleUpdateSubmit}
        initialData={selectedFuelType || undefined}
        title="Edit Fuel Type"
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Fuel Type
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this fuel type? This action cannot be undone and may affect tanks using this fuel type.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFuelType} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </WindowContainer>
  );
} 