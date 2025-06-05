import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Sale,
  CreateSaleRequest,
  UpdateSaleRequest,
  SalesFilters,
  SalesExportOptions,
} from "../types";
import { getSales, getSaleById, createSale, updateSale, deleteSale } from "../services";

// Adapter functions to transform between feature types and centralized service types
const adaptCreateSaleRequest = (request: CreateSaleRequest) => ({
  customer_name: request.customerName,
  fuel_type: request.fuelType,
  quantity: request.quantityLiters,
  price_per_liter: request.unitPrice,
  total_amount: request.amount,
  sale_date: request.saleDate instanceof Date ? request.saleDate.toISOString() : request.saleDate,
  filling_system_id: request.fillingSystemId,
  payment_method: request.paymentMethod as "cash" | "card" | "credit",
  status: "active" as const,
});

const adaptUpdateSaleRequest = (request: UpdateSaleRequest) => ({
  customer_name: request.customerName,
  fuel_type: request.fuelType,
  quantity: request.quantityLiters,
  price_per_liter: request.unitPrice,
  total_amount: request.amount,
  sale_date: request.saleDate instanceof Date ? request.saleDate.toISOString() : request.saleDate,
  filling_system_id: request.fillingSystemId,
  payment_method: request.paymentMethod as "cash" | "card" | "credit",
});

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
    queryFn: () => getSales(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSaleQuery(id: string) {
  return useQuery({
    queryKey: salesKeys.detail(id),
    queryFn: () => getSaleById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSalesMutations() {
  const queryClient = useQueryClient();

  const createSaleMutation = useMutation({
    mutationFn: (newSale: CreateSaleRequest) =>
      createSale(adaptCreateSaleRequest(newSale)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
      toast.success("Sale created successfully");
    },
    onError: () => {
      toast.error("Failed to create sale");
    },
  });

  const updateSaleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSaleRequest }) =>
      updateSale(id, adaptUpdateSaleRequest(data)),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: salesKeys.detail(variables.id),
      });
      toast.success("Sale updated successfully");
    },
    onError: () => {
      toast.error("Failed to update sale");
    },
  });

  const deleteSaleMutation = useMutation({
    mutationFn: (id: string) => deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
      toast.success("Sale deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete sale");
    },
  });

  const exportSalesMutation = useMutation({
    mutationFn: (options: SalesExportOptions) => {
      throw new Error("Export functionality not yet implemented in centralized service");
    },
    onSuccess: () => {
      toast.success("Sales data exported successfully");
    },
    onError: () => {
      toast.error("Failed to export sales data");
    },
  });

  return {
    createSale: createSaleMutation,
    updateSale: updateSaleMutation,
    deleteSale: deleteSaleMutation,
    exportSales: exportSalesMutation,
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
