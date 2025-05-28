import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fuelSuppliesService } from "../services";
import type { FuelSupply } from "../types";

export interface FuelSuppliesFilterState {
  searchTerm: string;
  providerId: string;
  tankId: string;
  fuelType: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  paymentStatus?: string;
}

export function useFuelSuppliesFilters() {
  // Initialize filter state
  const [filters, setFilters] = useState<FuelSuppliesFilterState>({
    searchTerm: "",
    providerId: "all",
    tankId: "all",
    fuelType: "all",
    paymentStatus: "all",
  });

  // Fetch all supplies for client-side filtering
  const { data: supplies = [], isLoading } = useQuery({
    queryKey: ["fuel-supplies"],
    queryFn: () => fuelSuppliesService.getFuelSupplies(),
  });

  // Update a specific filter or multiple filters
  const updateFilters = useCallback(
    (newFilters: Partial<FuelSuppliesFilterState>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    },
    []
  );

  // Reset all filters to default values
  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      providerId: "all",
      tankId: "all",
      fuelType: "all",
      paymentStatus: "all",
    });
  }, []);

  // Apply filters to the supplies data
  const filteredSupplies = useMemo<FuelSupply[]>(() => {
    return supplies.filter((supply) => {
      // Search term filter (check provider name, tank name, and comments)
      const matchesSearch = filters.searchTerm
        ? supply.provider?.name
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          supply.tank?.name
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          supply.comments
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase())
        : true;

      // Provider filter
      const matchesProvider =
        filters.providerId === "all" ||
        supply.provider_id === filters.providerId;

      // Tank filter
      const matchesTank =
        filters.tankId === "all" || supply.tank_id === filters.tankId;

      // Fuel type filter
      const matchesFuelType =
        filters.fuelType === "all" ||
        supply.tank?.fuel_type?.toLowerCase() ===
          filters.fuelType.toLowerCase();

      // Payment status filter
      const matchesPaymentStatus =
        filters.paymentStatus === "all" ||
        supply.payment_status === filters.paymentStatus;

      // Date range filter
      const matchesDateRange =
        !filters.dateRange ||
        (new Date(supply.delivery_date) >= filters.dateRange.from &&
          new Date(supply.delivery_date) <= filters.dateRange.to);

      return (
        matchesSearch &&
        matchesProvider &&
        matchesTank &&
        matchesFuelType &&
        matchesPaymentStatus &&
        matchesDateRange
      );
    });
  }, [supplies, filters]);

  // Extract unique providers, tanks, and fuel types for filter options
  const filterOptions = useMemo(() => {
    const providers = new Map();
    const tanks = new Map();
    const fuelTypes = new Map();
    const paymentStatuses = new Map();

    supplies.forEach((supply) => {
      if (supply.provider_id && supply.provider?.name) {
        providers.set(supply.provider_id, supply.provider.name);
      }

      if (supply.tank_id && supply.tank?.name) {
        tanks.set(supply.tank_id, supply.tank.name);
      }

      if (supply.tank?.fuel_type) {
        fuelTypes.set(
          supply.tank.fuel_type.toLowerCase(),
          supply.tank.fuel_type
        );
      }

      if (supply.payment_status) {
        paymentStatuses.set(supply.payment_status, supply.payment_status);
      }
    });

    return {
      providers: Array.from(providers.entries()).map(([id, name]) => ({
        id,
        name,
      })),
      tanks: Array.from(tanks.entries()).map(([id, name]) => ({ id, name })),
      fuelTypes: Array.from(fuelTypes.entries()).map(([id, name]) => ({
        id,
        name,
      })),
      paymentStatuses: Array.from(paymentStatuses.entries()).map(
        ([id, name]) => ({ id, name })
      ),
    };
  }, [supplies]);

  return {
    filters,
    updateFilters,
    resetFilters,
    supplies,
    filteredSupplies,
    filterOptions,
    isLoading,
  };
}
