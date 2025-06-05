import { tanksApi, fuelSuppliesApi, salesApi } from "@/core/api";
import type { Tank, TankCreate, TankUpdate, FuelSupply, Sale, FuelSupplyCreate, SaleCreate, SaleUpdate } from "@/core/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FuelSupplyUpdate } from "@/core/api/types";

export function useFuel() {
  const queryClient = useQueryClient();

  // Tanks
  const tanks = useQuery({
    queryKey: ["tanks"],
    queryFn: async () => {
      const response = await tanksApi.getTanks();
      return response.data || [];
    },
  });

  const createTankMutation = useMutation({
    mutationFn: async (data: TankCreate) => {
      const response = await tanksApi.createTank(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tanks"] });
    },
  });

  const updateTankMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TankUpdate }) => {
      const response = await tanksApi.updateTank(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tanks"] });
    },
  });

  // Supplies
  const supplies = useQuery({
    queryKey: ["supplies"],
    queryFn: async () => {
      const response = await fuelSuppliesApi.getFuelSupplies();
      return response.data || [];
    },
  });

  const createSupplyMutation = useMutation({
    mutationFn: async (data: FuelSupplyCreate) => {
      const response = await fuelSuppliesApi.createFuelSupply(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
    },
  });

  const updateSupplyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FuelSupplyUpdate }) => {
      const response = await fuelSuppliesApi.updateFuelSupply(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplies"] });
    },
  });

  // Sales
  const sales = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const response = await salesApi.getSales();
      return response.data || [];
    },
  });

  const createSaleMutation = useMutation({
    mutationFn: async (data: SaleCreate) => {
      const response = await salesApi.createSale(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  const updateSaleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SaleUpdate }) => {
      const response = await salesApi.updateSale(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  return {
    // Tanks
    tanks: tanks.data || [],
    isLoadingTanks: tanks.isLoading,
    createTank: createTankMutation,
    updateTank: updateTankMutation,

    // Supplies
    supplies: supplies.data || [],
    isLoadingSupplies: supplies.isLoading,
    createSupply: createSupplyMutation,
    updateSupply: updateSupplyMutation,

    // Sales
    sales: sales.data || [],
    isLoadingSales: sales.isLoading,
    createSale: createSaleMutation,
    updateSale: updateSaleMutation,
  };
}
