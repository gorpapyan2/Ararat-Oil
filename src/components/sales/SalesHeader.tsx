
import { SalesSearchBar } from "./SalesSearchBar";
import { SalesDatePicker } from "./SalesDatePicker";
import { SalesSystemSelect } from "./SalesSystemSelect";
import { SalesRangesFilters } from "./SalesRangesFilters";
import { NewSaleButton } from "./NewSaleButton";
import React from "react";

interface SalesHeaderProps {
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
}

export function SalesHeader({
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
}: SalesHeaderProps) {
  return (
    <div className="flex flex-col space-y-6 bg-background">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
        <div className="hidden">
          {/* We're hiding this to prevent duplication with the card header */}
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sales</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage and track fuel sales records</p>
        </div>
        <div className="ml-auto">
          <NewSaleButton />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="md:col-span-3 lg:col-span-2">
          <SalesSearchBar value={search} onChange={onSearchChange} />
        </div>
        <SalesDatePicker date={date} onDateChange={onDateChange} />
        <SalesSystemSelect value={systemId} onChange={onSystemChange} systems={systems} />
      </div>
      <SalesRangesFilters
        litersRange={litersRange}
        onLitersRangeChange={onLitersRangeChange}
        priceRange={priceRange}
        onPriceRangeChange={onPriceRangeChange}
        totalSalesRange={totalSalesRange}
        onTotalSalesRangeChange={onTotalSalesRangeChange}
      />
    </div>
  );
}
