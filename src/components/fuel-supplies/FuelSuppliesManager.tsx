import { useState, useEffect, useMemo, useCallback } from "react";
import { useFuelSuppliesFilters } from "./hooks/useFuelSuppliesFilters";
import { FuelSuppliesForm } from "./FuelSuppliesForm";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { ConfirmAddDialog } from "./ConfirmAddDialog";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createFuelSupply,
  updateFuelSupply,
  deleteFuelSupply,
} from "@/services/fuel-supplies";
import { useToast } from "@/hooks";
import { FuelSupply } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchFuelTanks } from "@/services/tanks";
import { FuelSuppliesTable } from "./FuelSuppliesTable";
import { FuelSuppliesSummary } from "./summary/FuelSuppliesSummary";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Building,
  Droplet,
  Banknote,
  UserCircle2,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { FuelSuppliesFormStandardized } from "./FuelSuppliesFormStandardized";

interface FuelSuppliesManagerProps {
  onRenderAction?: (actionNode: React.ReactNode) => void;
}

export function FuelSuppliesManager({
  onRenderAction,
}: FuelSuppliesManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<FuelSupply | null>(null);
  const [deletingSupply, setDeletingSupply] = useState<FuelSupply | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Use the filter hook
  const {
    filters,
    setSearch,
    setDate,
    setProvider,
    setType,
    setMinQuantity,
    setMaxQuantity,
    setMinPrice,
    setMaxPrice,
    setMinTotal,
    setMaxTotal,
    providers,
    filteredSupplies,
    isLoading,
    refetchSupplies,
  } = useFuelSuppliesFilters();

  // Add new state variables for confirmation
  const [confirmData, setConfirmData] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);

  const { data: tanks } = useQuery({
    queryKey: ["fuel-tanks"],
    queryFn: fetchFuelTanks,
  });

  // Handler for updating filters in a modern, scalable way
  const handleFiltersChange = useCallback((updates: Partial<typeof filters>) => {
    if ("search" in updates) {
      const searchValue =
        typeof updates.search === "string" ? updates.search : "";
      setSearch(searchValue);
    }
    if ("date" in updates && setDate) setDate(updates.date!);
    if ("provider" in updates && setProvider) setProvider(updates.provider!);
    if ("fuelType" in updates && setType) setType(updates.fuelType! as string);
    if ("quantityRange" in updates) {
      setMinQuantity(updates.quantityRange![0]);
      setMaxQuantity(updates.quantityRange![1]);
    }
    if ("priceRange" in updates) {
      setMinPrice(updates.priceRange![0]);
      setMaxPrice(updates.priceRange![1]);
    }
    if ("totalRange" in updates) {
      setMinTotal(updates.totalRange![0]);
      setMaxTotal(updates.totalRange![1]);
    }
  }, [setSearch, setDate, setProvider, setType, setMinQuantity, setMaxQuantity, setMinPrice, setMaxPrice, setMinTotal, setMaxTotal]);

  const createMutation = useMutation({
    mutationFn: createFuelSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      setIsDialogOpen(false);
      setIsConfirmOpen(false);
      setPendingData(null);
      setConfirmData(null);
      toast({
        title: "Success",
        description:
          "Fuel supply record created successfully and tank level updated",
      });
    },
    onError: (error) => {
      setIsConfirmOpen(false);
      toast({
        title: "Error",
        description: "Failed to create fuel supply record: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<FuelSupply>;
    }) => updateFuelSupply(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      setIsDialogOpen(false);
      setEditingSupply(null);
      toast({
        title: "Success",
        description: "Fuel supply record updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update fuel supply record: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleAdd = useCallback(() => {
    setEditingSupply(null);
    setIsDialogOpen(true);
  }, []);

  const handleEdit = useCallback((supply: FuelSupply) => {
    setEditingSupply(supply);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback((supply: FuelSupply) => {
    setDeletingSupply(supply);
  }, []);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setEditingSupply(null);
      setIsDialogOpen(false);
    }
  }, []);

  const handleSubmit = useCallback((data: any) => {
    if (editingSupply) {
      updateMutation.mutate({
        id: editingSupply.id,
        updates: data,
      });
    } else {
      setPendingData(data);
      const providerName = providers?.find((p) => p.id === data.provider_id)?.name;
      const selectedTank = tanks?.find((t) => t.id === data.tank_id);
      setConfirmData({
        quantity: Number(data.quantity_liters) || 0,
        price: Number(data.price_per_liter) || 0,
        totalCost: Number(data.total_cost) || 0,
        providerName,
        tankName: selectedTank?.name,
        tankCapacity: Number(selectedTank?.capacity) || 0,
        tankLevel: Number(selectedTank?.current_level) || 0,
      });
      setIsConfirmOpen(true);
    }
  }, [editingSupply, updateMutation, providers, tanks]);

  const handleConfirmSubmit = useCallback(() => {
    if (pendingData) {
      createMutation.mutate(pendingData);
    }
  }, [pendingData, createMutation]);

  const handleConfirmCancel = useCallback(() => {
    setIsConfirmOpen(false);
  }, []);

  const handleDeleteDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setDeletingSupply(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deletingSupply) return;
    setDeleteLoading(true);
    try {
      await deleteFuelSupply(deletingSupply.id);
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      toast({
        title: "Deleted",
        description: "Fuel supply record deleted successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete fuel supply: " + error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
      setDeletingSupply(null);
    }
  }, [deletingSupply, queryClient, toast]);

  const createButton = useMemo(
    () => (
      <Button
        className="ml-auto"
        onClick={handleAdd}
        disabled={createMutation.isLoading}
      >
        <Plus className="mr-2 h-4 w-4" />
        {t("fuelSupplies.addSupply")}
      </Button>
    ),
    [handleAdd, createMutation.isLoading, t]
  );

  useEffect(() => {
    if (onRenderAction) {
      onRenderAction(createButton);
    }
  }, [onRenderAction, createButton]);

  // Get fuel types from the tanks
  const fuelTypes = useMemo(() => {
    if (!tanks) return [];
    const uniqueTypes = new Set(tanks.map((tank) => tank.fuel_type));
    return Array.from(uniqueTypes).map((type) => ({
      id: type,
      name: type,
    }));
  }, [tanks]);

  return (
    <>
      {/* Summary Component */}
      <FuelSuppliesSummary
        data={filteredSupplies}
        className="mb-6"
        loading={isLoading}
      />

      {/* Main Data Table */}
      <FuelSuppliesTable
        fuelSupplies={filteredSupplies}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        providers={providers || []}
        fuelTypes={fuelTypes}
        onFiltersChange={handleFiltersChange}
      />

      {/* Dialogs */}
      <FuelSuppliesFormStandardized
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleSubmit}
        defaultValues={editingSupply}
      />

      <ConfirmAddDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmSubmit}
        onCancel={handleConfirmCancel}
        data={confirmData}
        isLoading={createMutation.isLoading}
      />

      <ConfirmDeleteDialog
        open={!!deletingSupply}
        onOpenChange={handleDeleteDialogOpenChange}
        onConfirm={confirmDelete}
        isLoading={deleteLoading}
      />
    </>
  );
}
