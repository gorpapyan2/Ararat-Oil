import { useState, useEffect, useMemo } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { FuelSupply } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchFuelTanks } from "@/services/tanks";
import { UnifiedDataTable } from "@/components/unified/UnifiedDataTable";
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
  const handleFiltersChange = (updates: Partial<typeof filters>) => {
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
  };

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

  const handleAdd = () => {
    setEditingSupply(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (supply: FuelSupply) => {
    setEditingSupply(supply);
    setIsDialogOpen(true);
  };

  const handleDelete = (supply: FuelSupply) => {
    setDeletingSupply(supply);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditingSupply(null);
      setIsDialogOpen(false);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingSupply) {
      // Handle update
      updateMutation.mutate({
        id: editingSupply.id,
        updates: data,
      });
    } else {
      // Handle create with confirmation
      setPendingData(data);

      // Find the provider name
      const providerName = providers?.find(
        (p) => p.id === data.provider_id,
      )?.name;

      // Find the tank details
      const selectedTank = tanks?.find((t) => t.id === data.tank_id);

      // Prepare confirmation data with proper numeric conversions
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
  };

  const handleConfirmSubmit = () => {
    if (pendingData) {
      createMutation.mutate(pendingData);
    }
  };

  const handleConfirmCancel = () => {
    setIsConfirmOpen(false);
    // Keep the form open so the user can modify details
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    if (!open) setDeletingSupply(null);
  };

  const confirmDelete = async () => {
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
  };

  // Define columns for the UnifiedDataTable
  const columns = useMemo<ColumnDef<FuelSupply>[]>(
    () => [
      {
        id: "delivery_date",
        header: () => (
          <div className="text-left font-medium">Delivery Date</div>
        ),
        accessorKey: "delivery_date",
        cell: ({ row }) => {
          const date = new Date(row.getValue("delivery_date"));
          return (
            <div className="flex items-center gap-2 py-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {isNaN(date.getTime()) ? "N/A" : format(date, "PP")}
              </span>
            </div>
          );
        },
      },
      {
        id: "provider",
        header: () => <div className="text-left font-medium">Provider</div>,
        accessorKey: "provider.name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 py-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {row.original.provider?.name || "N/A"}
            </span>
          </div>
        ),
      },
      {
        id: "tank",
        header: () => <div className="text-left font-medium">Tank</div>,
        accessorKey: "tank.name",
        cell: ({ row }) => {
          const tank = row.original.tank;
          return (
            <div className="flex items-center gap-2 py-2">
              <div className="flex flex-col">
                <span className="font-medium">{tank?.name || "N/A"}</span>
                {tank?.fuel_type && (
                  <Badge variant="outline" className="mt-1">
                    {tank.fuel_type}
                  </Badge>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: "quantity_liters",
        header: () => (
          <div className="text-right font-medium">Quantity (Liters)</div>
        ),
        accessorKey: "quantity_liters",
        cell: ({ row }) => {
          const quantity = row.getValue("quantity_liters");
          const value =
            quantity !== undefined && quantity !== null
              ? Number(quantity).toFixed(2)
              : "0";

          return (
            <div className="text-right font-medium tabular-nums">
              <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">
                {value} L
              </span>
            </div>
          );
        },
      },
      {
        id: "price_per_liter",
        header: () => (
          <div className="text-right font-medium">Price per Liter</div>
        ),
        accessorKey: "price_per_liter",
        cell: ({ row }) => {
          const price = row.getValue("price_per_liter");
          return (
            <div className="text-right font-medium tabular-nums">
              {typeof price === "number" ? price.toLocaleString() : "0"} ֏
            </div>
          );
        },
      },
      {
        id: "total_cost",
        header: () => <div className="text-right font-medium">Total Cost</div>,
        accessorKey: "total_cost",
        cell: ({ row }) => {
          const value = row.getValue("total_cost");
          const formattedValue =
            value !== undefined && value !== null
              ? Number(value).toLocaleString()
              : "0";

          return (
            <div className="text-right font-medium tabular-nums">
              <span className="font-semibold text-primary">
                {formattedValue} ֏
              </span>
            </div>
          );
        },
      },
      {
        id: "employee",
        header: () => <div className="text-left font-medium">Employee</div>,
        accessorKey: "employee.name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 py-2">
            <UserCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {row.original.employee?.name || "N/A"}
            </span>
          </div>
        ),
      },
      {
        id: "comments",
        header: () => <div className="text-left font-medium">Comments</div>,
        accessorKey: "comments",
        cell: ({ row }) => (
          <div
            className="max-w-[200px] truncate"
            title={(row.getValue("comments") as string) || ""}
          >
            {row.getValue("comments") || "N/A"}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center font-medium">Actions</div>,
        cell: ({ row }) => {
          const supply = row.original;
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(supply);
                }}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(supply);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );

  // Memoize the add button to prevent recreation on every render
  const addButton = useMemo(
    () => (
      <Button
        onClick={handleAdd}
        className="gap-2 shadow-sm"
        size="sm"
        aria-label="Add new fuel supply"
      >
        <Plus className="h-4 w-4" />
        <span>Add Supply</span>
      </Button>
    ),
    [],
  );

  // Use useEffect to handle action rendering to avoid state updates during render
  useEffect(() => {
    if (onRenderAction) {
      onRenderAction(addButton);
    }
  }, [onRenderAction, addButton]);

  return (
    <div className="space-y-6">
      <UnifiedDataTable
        title={t("fuelSupplies.title")}
        columns={columns}
        data={filteredSupplies}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        providers={providers || []}
        tanks={tanks || []}
        onFiltersChange={handleFiltersChange}
        filters={{
          search: filters.search || "",
          date: filters.date,
          provider: filters.provider || "all",
          fuelType: filters.type || "all",
          quantityRange: [
            filters.minQuantity || 0,
            filters.maxQuantity || 10000,
          ],
          priceRange: [filters.minPrice || 0, filters.maxPrice || 10000],
          totalRange: [filters.minTotal || 0, filters.maxTotal || 10000000],
        }}
        searchColumn="provider.name"
        searchPlaceholder={t("fuelSupplies.searchProviderPlaceholder")}
        summaryComponent={<FuelSuppliesSummary supplies={filteredSupplies} />}
      />

      <FuelSuppliesForm
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleSubmit}
        defaultValues={editingSupply}
      />

      <ConfirmDeleteDialog
        open={!!deletingSupply}
        onOpenChange={handleDeleteDialogOpenChange}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        recordInfo={
          deletingSupply
            ? `${deletingSupply.provider?.name ?? ""} (${(deletingSupply.quantity_liters || 0).toLocaleString()} L)`
            : undefined
        }
      />

      {confirmData && (
        <ConfirmAddDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={handleConfirmSubmit}
          onCancel={handleConfirmCancel}
          loading={createMutation.isPending}
          data={confirmData}
        />
      )}
    </div>
  );
}
