import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Sale,
  CreateSaleRequest,
  UpdateSaleRequest,
  SalesFilters,
  SalesExportOptions,
} from "../types";
import * as salesService from "../services/sales";

export const salesKeys = {
  all: ["sales"] as const,
  lists: () => [...salesKeys.all, "list"] as const,
  list: (filters: SalesFilters) => [...salesKeys.lists(), filters] as const,
  details: () => [...salesKeys.all, "detail"] as const,
  detail: (id: string) => [...salesKeys.details(), id] as const,
};

export function useSalesQuery(filters?: SalesFilters) {
  return useQuery({
    queryKey: salesKeys.list(filters || {}),
    queryFn: () => salesService.fetchSales(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSaleQuery(id: string) {
  return useQuery({
    queryKey: salesKeys.detail(id),
    queryFn: () => salesService.fetchSale(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSalesMutations() {
  const queryClient = useQueryClient();

  const createSale = useMutation({
    mutationFn: (newSale: CreateSaleRequest) =>
      salesService.createSale(newSale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
      toast.success("Sale created successfully");
    },
    onError: (error) => {
      console.error("Error creating sale:", error);
      toast.error("Failed to create sale");
    },
  });

  const updateSale = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSaleRequest }) =>
      salesService.updateSale(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: salesKeys.detail(variables.id),
      });
      toast.success("Sale updated successfully");
    },
    onError: (error) => {
      console.error("Error updating sale:", error);
      toast.error("Failed to update sale");
    },
  });

  const deleteSale = useMutation({
    mutationFn: (id: string) => salesService.deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
      toast.success("Sale deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting sale:", error);
      toast.error("Failed to delete sale");
    },
  });

  const exportSales = useMutation({
    mutationFn: (options: SalesExportOptions) =>
      salesService.exportSales(options),
    onSuccess: () => {
      toast.success("Sales data exported successfully");
    },
    onError: (error) => {
      console.error("Error exporting sales:", error);
      toast.error("Failed to export sales data");
    },
  });

  return {
    createSale,
    updateSale,
    deleteSale,
    exportSales,
  };
}

export function useExportSales() {
  const { exportSales } = useSalesMutations();

  const exportSalesData = async (options: SalesExportOptions) => {
    try {
      const data = await exportSales.mutateAsync(options);

      // Handle CSV data
      if (options.format === "csv" || !options.format) {
        const blob = new Blob([data as string], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sales-export-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error in export function:", error);
    }
  };

  return {
    exportSalesData,
    isExporting: exportSales.isPending,
  };
}

export default function useSales() {
  return {
    useSalesQuery,
    useSaleQuery,
    useSalesMutations,
    useExportSales,
  };
}
