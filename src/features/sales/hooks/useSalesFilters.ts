import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSales } from "@/services/sales";
import { fetchFillingSystems } from "@/services/filling-systems";
import { format } from "date-fns";
import { Sale } from "@/types";

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
    data: sales = [],
    isLoading: salesLoading,
    refetch: refetchSales,
  } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      return fetchSales();
    },
  });

  // Query filling systems data with proper error handling
  const { data: systemsData, isLoading: systemsLoading } = useQuery({
    queryKey: ["filling-systems"],
    queryFn: async () => {
      try {
        const data = await fetchFillingSystems();
        // Map the data to the expected format and ensure it's an array
        if (!data || !Array.isArray(data)) return [];

        return data.map((sys) => ({
          id: sys.id || "",
          name: sys.name || `System ${sys.id?.slice(0, 4) || "Unknown"}`,
        }));
      } catch (error) {
        console.error("Error fetching filling systems:", error);
        return [];
      }
    },
    // Initialize with empty array to prevent undefined
    initialData: [],
  });

  // Ensure systems is always an array and handle loading state
  const systems = useMemo(() => {
    // Return an empty array explicitly if loading or data is invalid
    if (systemsLoading) return [];
    if (!systemsData) return [];

    // Ensure we're working with an array
    return Array.isArray(systemsData) ? systemsData : [];
  }, [systemsData, systemsLoading]);

  const filteredSales = useMemo(() => {
    let filtered = sales || [];
    if (search) {
      const lower = search.toLowerCase();
      filtered = Array.isArray(filtered) ? filtered.filter(
        (sale) =>
          sale?.filling_system_name?.toLowerCase().includes(lower) ||
          sale?.fuel_type?.toLowerCase().includes(lower) ||
          sale?.date?.toString().includes(lower)
      ) : [];
    }
    if (date && Array.isArray(filtered)) {
      const filterDate = format(date, "yyyy-MM-dd");
      filtered = filtered.filter((sale) => {
        const saleDate = sale?.date?.slice(0, 10);
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
        const p = sale?.price_per_unit;
        return (
          (priceMin === 0 || p >= priceMin) && (priceMax === 0 || p <= priceMax)
        );
      });
    }
    const [tsMin, tsMax] = totalSalesRange;
    if ((tsMin > 0 || tsMax > 0) && Array.isArray(filtered)) {
      filtered = filtered.filter((sale) => {
        const t = sale?.total_sales;
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