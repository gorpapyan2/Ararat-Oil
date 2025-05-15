import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFuelSupplies } from "../services";
import { FuelSupply } from "../types";

export function useFuelSuppliesFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [selectedFuelType, setSelectedFuelType] = useState("all");

  const { data: supplies = [], isLoading } = useQuery<FuelSupply[]>({
    queryKey: ["fuel-supplies"],
    queryFn: () => fetchFuelSupplies(),
  });

  const filteredSupplies = useMemo<FuelSupply[]>(() => {
    return supplies.filter((supply) => {
      const matchesSearch = searchTerm
        ? supply.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supply.tank?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supply.comments?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesProvider =
        selectedProvider === "all" || supply.provider_id === selectedProvider;

      const matchesFuelType =
        selectedFuelType === "all" ||
        supply.tank?.fuel_type?.toLowerCase() === selectedFuelType.toLowerCase();

      return matchesSearch && matchesProvider && matchesFuelType;
    });
  }, [supplies, searchTerm, selectedProvider, selectedFuelType]);

  return {
    supplies,
    filteredSupplies,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedProvider,
    setSelectedProvider,
    selectedFuelType,
    setSelectedFuelType,
  };
} 