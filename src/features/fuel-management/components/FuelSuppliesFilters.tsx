import React from 'react';
import { Filter, Search, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select';
import { FuelType } from '@/shared/types/tank.types';

export interface SupplyFilters {
  status: string;
  fuelType: string;
  search: string;
  showPast: boolean;
}

interface FuelSuppliesFiltersProps {
  filters: SupplyFilters;
  onFiltersChange: (filters: SupplyFilters) => void;
  fuelTypes: FuelType[];
  resultsCount: number;
}

export const FuelSuppliesFilters: React.FC<FuelSuppliesFiltersProps> = ({
  filters,
  onFiltersChange,
  fuelTypes,
  resultsCount,
}) => {
  const updateFilter = (key: keyof SupplyFilters, value: string | boolean) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card border border-border rounded-lg mb-6">
      {/* Filter Header Row */}
      <div className="flex items-center justify-between gap-4 p-4 border-b border-border">
        {/* Left Side Filters */}
        <div className="flex items-center gap-3 flex-1">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Set
            <span className="text-muted-foreground ml-1">None</span>
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Select
            value={filters.status}
            onValueChange={(value) => updateFilter('status', value)}
          >
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-2">
                <span className="text-sm">Status</span>
                <span className="text-muted-foreground">
                  {filters.status === 'all' ? 'All' : filters.status}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.fuelType}
            onValueChange={(value) => updateFilter('fuelType', value)}
          >
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-2">
                <span className="text-sm">Fuel Type</span>
                <span className="text-muted-foreground">
                  {filters.fuelType === 'all' ? 'All' : 
                   fuelTypes.find(type => type.id === filters.fuelType)?.name || 
                   fuelTypes.find(type => type.code === filters.fuelType)?.name || 
                   filters.fuelType}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {fuelTypes.map((fuelType) => (
                <SelectItem key={fuelType.id} value={fuelType.code || fuelType.id}>
                  {fuelType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Showing {resultsCount} supplies
          </div>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      {/* Search Row */}
      <div className="flex items-center justify-between gap-4 p-4">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search supplies..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Show Past Supplies Toggle */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.showPast}
              onChange={(e) => updateFilter('showPast', e.target.checked)}
              className="rounded border-border"
            />
            Show Past Supplies
          </label>

          <Button variant="outline" size="sm" className="flex items-center gap-2">
            Edit Columns
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}; 