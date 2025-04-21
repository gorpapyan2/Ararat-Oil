
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { AdvancedSearchInput } from "./AdvancedSearchInput";
import { DateRangeFilter } from "./DateRangeFilter";
import { FillingSystemFilter } from "./FillingSystemFilter";
import { RangeSliderFilter } from "./RangeSliderFilter";
import { addDays, startOfDay, startOfMonth, startOfWeek, subDays } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface SalesFilterBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  systemId: string;
  onSystemChange: (id: string) => void;
  systems: { id: string; name: string }[];
  litersRange: [number, number];
  onLitersRangeChange: (range: [number, number]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  totalSalesRange: [number, number];
  onTotalSalesRangeChange: (range: [number, number]) => void;
  recentSearches?: string[];
}

const datePresets = [
  {
    label: "Today",
    getDate: () => startOfDay(new Date()),
  },
  {
    label: "Yesterday",
    getDate: () => subDays(startOfDay(new Date()), 1),
  },
  {
    label: "This Week",
    getDate: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  },
  {
    label: "This Month",
    getDate: () => startOfMonth(new Date()),
  },
];

export function SalesFilterBar({
  search,
  onSearchChange,
  date,
  onDateChange,
  systemId,
  onSystemChange,
  systems,
  litersRange,
  onLitersRangeChange,
  priceRange,
  onPriceRangeChange,
  totalSalesRange,
  onTotalSalesRangeChange,
  recentSearches = [],
}: SalesFilterBarProps) {
  const [showFilters, setShowFilters] = React.useState(true);

  return (
    <Card className="border shadow-sm bg-card/70 backdrop-blur-sm">
      <div className="px-4 py-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <h3 className="text-sm font-medium">Sales Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="h-8 w-8 p-0"
        >
          {showFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showFilters ? "Hide filters" : "Show filters"}
          </span>
        </Button>
      </div>
      
      {showFilters && (
        <CardContent className="p-4 grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <AdvancedSearchInput
                value={search}
                onChange={onSearchChange}
                placeholder="Search sales..."
                recentSearches={recentSearches}
              />
            </div>
            <DateRangeFilter
              date={date}
              onDateChange={onDateChange}
              presets={datePresets}
            />
            <FillingSystemFilter
              value={systemId}
              onChange={onSystemChange}
              systems={systems}
            />
          </div>
          
          <Separator className="my-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RangeSliderFilter
              label="Liters Range"
              value={litersRange}
              min={0}
              max={10000}
              step={10}
              onChange={onLitersRangeChange}
              formatValue={(v) => v.toFixed(0)}
              unit="L"
            />
            <RangeSliderFilter
              label="Price per Unit Range"
              value={priceRange}
              min={0}
              max={2000}
              step={10}
              onChange={onPriceRangeChange}
              formatValue={(v) => v.toLocaleString()}
              unit="֏"
            />
            <RangeSliderFilter
              label="Total Sales Range"
              value={totalSalesRange}
              min={0}
              max={1000000}
              step={1000}
              onChange={onTotalSalesRangeChange}
              formatValue={(v) => v.toLocaleString()}
              unit="֏"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
