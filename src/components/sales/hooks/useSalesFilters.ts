
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSales } from "@/services/sales";
import { fetchFillingSystems } from "@/services/filling-systems";
import { format } from "date-fns";
import { Sale } from "@/types";

export function useSalesFilters() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [systemId, setSystemId] = useState<string>("");
  const [litersRange, setLitersRange] = useState<[number, number]>([0, 0]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [totalSalesRange, setTotalSalesRange] = useState<[number, number]>([0, 0]);

  const { data: sales, isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: fetchSales,
  });
  const { data: systems = [] } = useQuery({
    queryKey: ["filling-systems"],
    queryFn: async () => {
      const systemsData = await fetchFillingSystems();
      return systemsData.map(sys => ({ id: sys.id, name: sys.name }));
    }
  });

  const filteredSales = useMemo(() => {
    let filtered = sales || [];
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter((sale) =>
        sale.filling_system_name?.toLowerCase().includes(lower) ||
        sale.fuel_type?.toLowerCase().includes(lower) ||
        sale.date?.toString().includes(lower)
      );
    }
    if (date) {
      const filterDate = format(date, 'yyyy-MM-dd');
      filtered = filtered.filter(sale => {
        const saleDate = sale.date?.slice(0, 10);
        return saleDate === filterDate;
      });
    }
    if (systemId && systemId !== "all") {
      filtered = filtered.filter(sale => sale.filling_system_id === systemId);
    }
    const [litMin, litMax] = litersRange;
    if (litMin > 0 || litMax > 0) {
      filtered = filtered.filter(sale => {
        const q = sale.quantity;
        return (litMin === 0 || q >= litMin) && (litMax === 0 || q <= litMax);
      });
    }
    const [priceMin, priceMax] = priceRange;
    if (priceMin > 0 || priceMax > 0) {
      filtered = filtered.filter(sale => {
        const p = sale.price_per_unit;
        return (priceMin === 0 || p >= priceMin) && (priceMax === 0 || p <= priceMax);
      });
    }
    const [tsMin, tsMax] = totalSalesRange;
    if (tsMin > 0 || tsMax > 0) {
      filtered = filtered.filter(sale => {
        const t = sale.total_sales;
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
    systems,
    litersRange,
    setLitersRange,
    priceRange,
    setPriceRange,
    totalSalesRange,
    setTotalSalesRange,
    filteredSales,
    sales,
    isLoading,
  };
}
