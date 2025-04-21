import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFuelSupplies } from "@/services/fuel-supplies";
import { fetchPetrolProviders } from "@/services/petrol-providers";
import { format } from "date-fns";

export function useFuelSuppliesFilters() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [providerId, setProviderId] = useState<string>("");
  const [type, setType] = useState<string>(""); // Add type filter if needed
  const [quantityRange, setQuantityRange] = useState<[number, number]>([0, 0]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [totalCostRange, setTotalCostRange] = useState<[number, number]>([0, 0]);

  const { data: supplies = [], isLoading, refetch: refetchSupplies } = useQuery({
    queryKey: ['fuel-supplies'],
    queryFn: fetchFuelSupplies
  });

  const { data: providers = [] } = useQuery({
    queryKey: ["petrol-providers"],
    queryFn: async () => {
      const providersData = await fetchPetrolProviders();
      return providersData.map(provider => ({ id: provider.id, name: provider.name }));
    }
  });

  const filteredSupplies = useMemo(() => {
    let filtered = supplies;
    
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter((supply) =>
        supply.provider?.name?.toLowerCase().includes(lower) ||
        supply.tank?.name?.toLowerCase().includes(lower) ||
        supply.employee?.name?.toLowerCase().includes(lower) ||
        supply.delivery_date?.toString().includes(lower)
      );
    }

    if (date) {
      const filterDate = format(date, 'yyyy-MM-dd');
      filtered = filtered.filter(supply => {
        const supplyDate = supply.delivery_date?.slice(0, 10);
        return supplyDate === filterDate;
      });
    }

    if (providerId && providerId !== "all") {
      filtered = filtered.filter(supply => supply.provider_id === providerId);
    }

    const [qtyMin, qtyMax] = quantityRange;
    if (qtyMin > 0 || qtyMax > 0) {
      filtered = filtered.filter(supply => {
        const q = supply.quantity_liters;
        return (qtyMin === 0 || q >= qtyMin) && (qtyMax === 0 || q <= qtyMax);
      });
    }

    const [priceMin, priceMax] = priceRange;
    if (priceMin > 0 || priceMax > 0) {
      filtered = filtered.filter(supply => {
        const p = supply.price_per_liter;
        return (priceMin === 0 || p >= priceMin) && (priceMax === 0 || p <= priceMax);
      });
    }

    const [costMin, costMax] = totalCostRange;
    if (costMin > 0 || costMax > 0) {
      filtered = filtered.filter(supply => {
        const c = supply.total_cost;
        return (costMin === 0 || c >= costMin) && (costMax === 0 || c <= costMax);
      });
    }

    return filtered;
  }, [supplies, search, date, providerId, quantityRange, priceRange, totalCostRange]);

  // Helper setters for min/max values
  const setMinQuantity = (min: number) => setQuantityRange(([_, max]) => [min, max]);
  const setMaxQuantity = (max: number) => setQuantityRange(([min, _]) => [min, max]);
  const setMinPrice = (min: number) => setPriceRange(([_, max]) => [min, max]);
  const setMaxPrice = (max: number) => setPriceRange(([min, _]) => [min, max]);
  const setMinTotal = (min: number) => setTotalCostRange(([_, max]) => [min, max]);
  const setMaxTotal = (max: number) => setTotalCostRange(([min, _]) => [min, max]);

  // Compose filters object for compatibility
  const filters = {
    search,
    date,
    provider: providerId,
    type,
    minQuantity: quantityRange[0],
    maxQuantity: quantityRange[1],
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    minTotal: totalCostRange[0],
    maxTotal: totalCostRange[1],
  };

  return {
    filters,
    setSearch,
    setDate,
    setProvider: setProviderId,
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
    refetchSupplies
  };
}
