import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks";
import { useTranslation } from "react-i18next";
import { DateRange } from "react-day-picker";
import { fuelSuppliesApi, petrolProvidersApi } from "@/core/api";
import { FuelSupply } from "@/features/supplies/types";

export interface FuelSuppliesFilters {
  search: string;
  date: DateRange | undefined;
  provider: string;
  fuelType: string;
  minQuantity: number;
  maxQuantity: number;
  minPrice: number;
  maxPrice: number;
  minTotal: number;
  maxTotal: number;
}

export function useFuelSuppliesFilters() {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Define filters
  const [search, setSearch] = useState<string>("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [provider, setProvider] = useState<string>("");
  const [fuelType, setType] = useState<string>("");
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [maxQuantity, setMaxQuantity] = useState<number>(100000);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [minTotal, setMinTotal] = useState<number>(0);
  const [maxTotal, setMaxTotal] = useState<number>(10000000);

  // Fetch fuel supplies using the new API client
  const {
    data: fuelSupplies,
    isLoading: isLoadingSupplies,
    error: suppliesError,
    refetch: refetchSupplies,
  } = useQuery({
    queryKey: ["fuel-supplies"],
    queryFn: async () => {
      // Make the API call without parameters for now
      // In a real implementation, parameters would be passed when backend supports them
      const response = await fuelSuppliesApi.getFuelSupplies();
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data || [];
    },
  });

  // Fetch providers using the core API
  const {
    data: providers,
    isLoading: isLoadingProviders,
    error: providersError,
  } = useQuery({
    queryKey: ["petrol-providers"],
    queryFn: async () => {
      const response = await petrolProvidersApi.getPetrolProviders();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data || [];
    },
  });

  // Handle API errors
  useEffect(() => {
    if (suppliesError) {
      toast({
        title: t("errors.loadFuelSuppliesFailed") || "Failed to load fuel supplies",
        description: suppliesError instanceof Error ? suppliesError.message : t("errors.unknownError"),
        variant: "destructive",
      });
    }
    
    if (providersError) {
      toast({
        title: t("errors.loadProvidersFailed") || "Failed to load providers",
        description: providersError instanceof Error ? providersError.message : t("errors.unknownError"),
        variant: "destructive",
      });
    }
  }, [suppliesError, providersError, toast, t]);

  // Apply client-side filters for advanced filtering
  const filteredSupplies = useMemo(() => {
    if (!fuelSupplies) return [];

    return fuelSupplies.filter((supply: FuelSupply) => {
      // Apply search filter across multiple fields
      const searchLower = search.toLowerCase();
      const matchesSearch =
        searchLower === "" ||
        (supply.provider?.name || "").toLowerCase().includes(searchLower) ||
        (supply.tank?.name || "").toLowerCase().includes(searchLower) ||
        (supply.id || "").toLowerCase().includes(searchLower);

      // Apply numeric range filters
      const matchesQuantity =
        supply.quantity_liters >= minQuantity &&
        supply.quantity_liters <= maxQuantity;
      
      const matchesPrice =
        supply.price_per_liter >= minPrice &&
        supply.price_per_liter <= maxPrice;
      
      const matchesTotal =
        supply.total_cost >= minTotal &&
        supply.total_cost <= maxTotal;

      return (
        matchesSearch &&
        matchesQuantity &&
        matchesPrice &&
        matchesTotal
      );
    });
  }, [
    fuelSupplies,
    search,
    minQuantity,
    maxQuantity,
    minPrice,
    maxPrice,
    minTotal,
    maxTotal,
  ]);

  // Return everything needed by consumers
  return {
    filters: {
      search,
      date,
      provider,
      fuelType,
      minQuantity,
      maxQuantity,
      minPrice,
      maxPrice,
      minTotal,
      maxTotal,
    },
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
    fuelSupplies,
    filteredSupplies,
    isLoading: isLoadingSupplies || isLoadingProviders,
    refetchSupplies,
  };
}
