import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTanks } from "@/core/api/endpoints/tanks";
import { Card, CardContent } from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/primitives/select";
import { DateRangePicker } from "@/core/components/ui/date-range-picker";
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
  const response = await getTanks();
  if (response.error) throw new Error(response.error.message);
  
  const tanks = response.data || [];
  return tanks.map((tank) => ({
    id: tank.id,
    name: tank.name,
    fuel_type: tank.fuel_type?.name || 'Unknown',
  }));
}

export function FuelSalesFilter({
  filters,
  onFiltersChange,
}: FuelSalesFilterProps) {
  const { data: tanks = [] } = useQuery<FuelTank[]>({
    queryKey: ["fuel-tanks"],
    queryFn: fetchFuelTanks,
  });

  const handleDateRangeChange = useCallback(
    (range: { from: Date; to: Date } | undefined) => {
      onFiltersChange({
        ...filters,
        date_range: range ? {
          start: range.from.toISOString().split('T')[0],
          end: range.to.toISOString().split('T')[0]
        } : undefined,
      });
    },
    [filters, onFiltersChange]
  );

  const handleTankChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        filling_system_id: value || undefined,
      });
    },
    [filters, onFiltersChange]
  );

  const handlePaymentStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        payment_status: value || undefined,
      });
    },
    [filters, onFiltersChange]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        search_query: value || undefined,
      });
    },
    [filters, onFiltersChange]
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <DateRangePicker
              date={filters.date_range ? {
                from: new Date(filters.date_range.start),
                to: new Date(filters.date_range.end)
              } : undefined}
              onDateChange={handleDateRangeChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tank</label>
            <Select value={filters.filling_system_id} onValueChange={handleTankChange}>
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
              value={filters.payment_status}
              onValueChange={handlePaymentStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <Input
              placeholder="Search by customer name..."
              value={filters.search_query || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
