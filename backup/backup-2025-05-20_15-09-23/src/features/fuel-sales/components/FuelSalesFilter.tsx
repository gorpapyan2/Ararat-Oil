import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/core/api/supabase";
import { Card, CardContent } from '@/core/components/ui/card';
import { Input } from '@/core/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
import { DateRangePicker } from '@/core/components/ui/date-range-picker';
import type { FuelSaleFilters } from "../types/fuel-sales.types";

interface FuelTank {
  id: string;
  name: string;
  fuel_type?: string | { code?: string; name?: string };
}

interface FuelSalesFilterProps {
  filters: FuelSaleFilters;
  onFiltersChange: (filters: FuelSaleFilters) => void;
}

async function fetchFuelTanks(): Promise<FuelTank[]> {
  const { data, error } = await supabase
    .from('fuel_tanks')
    .select('id, name, fuel_type')
    .order('name');
  
  if (error) throw error;
  return data;
}

export function FuelSalesFilter({
  filters,
  onFiltersChange,
}: FuelSalesFilterProps) {
  const { data: tanks = [] } = useQuery<FuelTank[]>({
    queryKey: ["fuel-tanks"],
    queryFn: fetchFuelTanks,
  });

  const handleDateRangeChange = useCallback((range: { from: Date; to: Date } | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: range,
    });
  }, [filters, onFiltersChange]);

  const handleTankChange = useCallback((value: string) => {
    onFiltersChange({
      ...filters,
      tankId: value || undefined,
    });
  }, [filters, onFiltersChange]);

  const handlePaymentStatusChange = useCallback((value: string) => {
    onFiltersChange({
      ...filters,
      paymentStatus: value || undefined,
    });
  }, [filters, onFiltersChange]);

  const handleSearchChange = useCallback((value: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: value || undefined,
    });
  }, [filters, onFiltersChange]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <DateRangePicker
              value={filters.dateRange}
              onChange={handleDateRangeChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tank</label>
            <Select
              value={filters.tankId}
              onValueChange={handleTankChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tanks</SelectItem>
                {tanks.map((tank) => (
                  <SelectItem key={tank.id} value={tank.id}>
                    {tank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Status</label>
            <Select
              value={filters.paymentStatus}
              onValueChange={handlePaymentStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <Input
              placeholder="Search by customer name..."
              value={filters.searchQuery || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 