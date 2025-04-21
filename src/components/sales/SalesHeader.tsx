
import React from "react";
import { SalesFilters } from "./SalesFilters";
import { SalesRangesFilters } from "./SalesRangesFilters";
import { NewSaleButton } from "./NewSaleButton";

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
          {/* Prevent duplication with card header */}
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sales</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage and track fuel sales records</p>
        </div>
        <div className="ml-auto">
          <NewSaleButton />
        </div>
      </div>
      <SalesFilters
        search={search}
        onSearchChange={onSearchChange}
        date={date}
        onDateChange={onDateChange}
        systemId={systemId}
        onSystemChange={onSystemChange}
        systems={systems}
      />
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

