import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { salesApi, fillingSystemsApi, Sale, FillingSystem, ApiResponse } from "@/core/api";
import { format } from "date-fns";

export function useSalesFilters() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [systemId, setSystemId] = useState<string>("all");
  const [litersRange, setLitersRange] = useState<[number, number]>([0, 0]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [totalSalesRange, setTotalSalesRange] = useState<[number, number]>([
    0, 0,
  ]);

  // Query sales data
  const {
    data: salesResponse,
    isLoading: salesLoading,
    refetch: refetchSales,
  } = useQuery<ApiResponse<Sale[]>, Error>({
    queryKey: ["sales"],
    queryFn: async () => {
      return salesApi.getSales();
    },
  });

  // Extract sales data from response
  const sales = useMemo(() => {
    return salesResponse?.data || [];
  }, [salesResponse]);

  // Query filling systems data with proper error handling
  const { data: systemsResponse, isLoading: systemsLoading } = useQuery<ApiResponse<FillingSystem[]>, Error>({
    queryKey: ["filling-systems"],
    queryFn: async () => {
      return fillingSystemsApi.getFillingSystems();
    },
  });

  // Ensure systems is always an array and handle loading state
  const systems = useMemo(() => {
    // Return an empty array explicitly if loading or data is invalid
    if (systemsLoading) return [];
    if (!systemsResponse?.data) return [];

    // Map the data to the expected format
    return systemsResponse.data.map((sys: FillingSystem) => ({
      id: sys.id || "",
      name: sys.name || `System ${sys.id?.slice(0, 4) || "Unknown"}`,
    }));
  }, [systemsResponse, systemsLoading]);

  const filteredSales = useMemo(() => {
    let filtered = sales || [];
    if (search) {
      const lower = search.toLowerCase();
      filtered = Array.isArray(filtered) ? filtered.filter(
        (sale) =>
          sale?.filling_system_id?.toLowerCase().includes(lower) ||
          sale?.fuel_type_id?.toLowerCase().includes(lower) ||
          sale?.created_at?.toString().includes(lower)
      ) : [];
    }
    if (date && Array.isArray(filtered)) {
      const filterDate = format(date, "yyyy-MM-dd");
      filtered = filtered.filter((sale) => {
        const saleDate = sale?.created_at?.slice(0, 10);
        return saleDate === filterDate;
      });
    }
    if (systemId && systemId !== "all" && Array.isArray(filtered)) {
      filtered = filtered.filter((sale) => sale?.filling_system_id === systemId);
    }
    const [litMin, litMax] = litersRange;
    if ((litMin > 0 || litMax > 0) && Array.isArray(filtered)) {
      filtered = filtered.filter((sale) => {
        const q = sale?.quantity;
        return (litMin === 0 || q >= litMin) && (litMax === 0 || q <= litMax);
      });
    }
    const [priceMin, priceMax] = priceRange;
    if ((priceMin > 0 || priceMax > 0) && Array.isArray(filtered)) {
      filtered = filtered.filter((sale) => {
        const p = sale?.price_per_liter;
        return (
          (priceMin === 0 || p >= priceMin) && (priceMax === 0 || p <= priceMax)
        );
      });
    }
    const [tsMin, tsMax] = totalSalesRange;
    if ((tsMin > 0 || tsMax > 0) && Array.isArray(filtered)) {
      filtered = filtered.filter((sale) => {
        const t = sale?.total_price;
        return (tsMin === 0 || t >= tsMin) && (tsMax === 0 || t <= tsMax);
      });
    }
    return filtered;
  }, [sales, search, date, systemId, litersRange, priceRange, totalSalesRange]);

  return {
    search,
    setSearch,
    date,
    setDate,
    systemId,
    setSystemId,
    litersRange,
    setLitersRange,
    priceRange,
    setPriceRange,
    totalSalesRange,
    setTotalSalesRange,
    systems,
    filteredSales,
    isLoading: salesLoading || systemsLoading, // Combine loading states
    refetchSales,
  };
} 