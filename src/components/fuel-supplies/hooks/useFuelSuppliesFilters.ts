import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFuelSupplies } from "@/services/fuel-supplies";
import { fetchPetrolProviders } from "@/services/petrol-providers";
import { format } from "date-fns";

export function useFuelSuppliesFilters() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [providerId, setProviderId] = useState<string>("all"); // Set default value to "all"
  const [type, setType] = useState<string>(""); // Add type filter if needed
  const [quantityRange, setQuantityRange] = useState<[number, number]>([0, 0]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [totalCostRange, setTotalCostRange] = useState<[number, number]>([
    0, 0,
  ]);

  // Query fuel supplies data
  const {
    data: supplies = [],
    isLoading: suppliesLoading,
    refetch: refetchSupplies,
    error: suppliesError
  } = useQuery({
    queryKey: ["fuel-supplies"],
    queryFn: fetchFuelSupplies,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Log query results for debugging
  useEffect(() => {
    if (suppliesError) {
      console.error("Fuel supplies query error:", suppliesError);
    } else if (supplies.length === 0) {
      console.log("No fuel supplies data available");
    } else {
      console.log(`Loaded ${supplies.length} fuel supplies for filtering`);
    }
  }, [supplies, suppliesError]);

  // Query provider data with proper error handling
  const { data: providersData, isLoading: providersLoading } = useQuery({
    queryKey: ["petrol-providers"],
    queryFn: async () => {
      try {
        const data = await fetchPetrolProviders();
        // Map the data to the expected format and ensure it's an array
        if (!data || !Array.isArray(data)) return [];

        return data.map((provider) => ({
          id: provider.id || "",
          name:
            provider.name ||
            `Provider ${provider.id?.slice(0, 4) || "Unknown"}`,
        }));
      } catch (error) {
        console.error("Error fetching petrol providers:", error);
        return [];
      }
    },
    // Initialize with empty array to prevent undefined
    initialData: [],
  });

  // Ensure providers is always a valid array
  const providers = useMemo(() => {
    // Return an empty array if loading or data is invalid
    if (providersLoading) return [];
    if (!providersData) return [];

    // Ensure we're working with an array
    return Array.isArray(providersData) ? providersData : [];
  }, [providersData, providersLoading]);

  const filteredSupplies = useMemo(() => {
    console.log("Starting filtering with", supplies.length, "records");
    let filtered = supplies;

    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (supply) =>
          supply.provider?.name?.toLowerCase().includes(lower) ||
          supply.tank?.name?.toLowerCase().includes(lower) ||
          supply.employee?.name?.toLowerCase().includes(lower) ||
          supply.delivery_date?.toString().includes(lower),
      );
    }

    if (date) {
      const filterDate = format(date, "yyyy-MM-dd");
      filtered = filtered.filter((supply) => {
        const supplyDate = supply.delivery_date?.slice(0, 10);
        return supplyDate === filterDate;
      });
    }

    if (providerId && providerId !== "all") {
      filtered = filtered.filter((supply) => supply.provider_id === providerId);
    }

    const [qtyMin, qtyMax] = quantityRange;
    if (qtyMin > 0 || qtyMax > 0) {
      filtered = filtered.filter((supply) => {
        const q = supply.quantity_liters;
        return (qtyMin === 0 || q >= qtyMin) && (qtyMax === 0 || q <= qtyMax);
      });
    }

    const [priceMin, priceMax] = priceRange;
    if (priceMin > 0 || priceMax > 0) {
      filtered = filtered.filter((supply) => {
        const p = supply.price_per_liter;
        return (
          (priceMin === 0 || p >= priceMin) && (priceMax === 0 || p <= priceMax)
        );
      });
    }

    const [costMin, costMax] = totalCostRange;
    if (costMin > 0 || costMax > 0) {
      filtered = filtered.filter((supply) => {
        const c = supply.total_cost;
        return (
          (costMin === 0 || c >= costMin) && (costMax === 0 || c <= costMax)
        );
      });
    }

    console.log("Final filtered supplies count:", filtered.length);
    return filtered;
  }, [
    supplies,
    search,
    date,
    providerId,
    quantityRange,
    priceRange,
    totalCostRange,
  ]);

  // Helper setters for min/max values
  const setMinQuantity = (min: number) =>
    setQuantityRange(([_, max]) => [min, max]);
  const setMaxQuantity = (max: number) =>
    setQuantityRange(([min, _]) => [min, max]);
  const setMinPrice = (min: number) => setPriceRange(([_, max]) => [min, max]);
  const setMaxPrice = (max: number) => setPriceRange(([min, _]) => [min, max]);
  const setMinTotal = (min: number) =>
    setTotalCostRange(([_, max]) => [min, max]);
  const setMaxTotal = (max: number) =>
    setTotalCostRange(([min, _]) => [min, max]);

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
    isLoading: suppliesLoading || providersLoading, // Combine loading states
    refetchSupplies,
  };
}
