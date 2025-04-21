
import React from "react";

interface SalesRangesFiltersProps {
  litersRange: [number, number];
  onLitersRangeChange: (range: [number, number]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  totalSalesRange: [number, number];
  onTotalSalesRangeChange: (range: [number, number]) => void;
}

const handleRangeChange = (
  idx: number,
  value: string,
  range: [number, number],
  setRange: (r: [number, number]) => void
) => {
  const newVal = value === "" ? "" : Number(value);
  const updated: [number, number] = [range[0], range[1]];
  updated[idx] = newVal as number;
  setRange(updated);
};

export function SalesRangesFilters({
  litersRange,
  onLitersRangeChange,
  priceRange,
  onPriceRangeChange,
  totalSalesRange,
  onTotalSalesRangeChange,
}: SalesRangesFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Liters Range */}
      <div className="p-3 rounded-md border bg-background/50">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Liters Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="h-9 flex-1 px-3 py-1 rounded-md border border-input bg-background text-sm"
              value={litersRange[0] === 0 ? "" : litersRange[0]}
              onChange={e => handleRangeChange(0, e.target.value, litersRange, onLitersRangeChange)}
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              placeholder="Max"
              className="h-9 flex-1 px-3 py-1 rounded-md border border-input bg-background text-sm"
              value={litersRange[1] === 0 ? "" : litersRange[1]}
              onChange={e => handleRangeChange(1, e.target.value, litersRange, onLitersRangeChange)}
            />
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="p-3 rounded-md border bg-background/50">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Price/Unit Range (֏)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="h-9 flex-1 px-3 py-1 rounded-md border border-input bg-background text-sm"
              value={priceRange[0] === 0 ? "" : priceRange[0]}
              onChange={e => handleRangeChange(0, e.target.value, priceRange, onPriceRangeChange)}
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              placeholder="Max"
              className="h-9 flex-1 px-3 py-1 rounded-md border border-input bg-background text-sm"
              value={priceRange[1] === 0 ? "" : priceRange[1]}
              onChange={e => handleRangeChange(1, e.target.value, priceRange, onPriceRangeChange)}
            />
          </div>
        </div>
      </div>

      {/* Total Sales Range */}
      <div className="p-3 rounded-md border bg-background/50">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Total Sales Range (֏)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="h-9 flex-1 px-3 py-1 rounded-md border border-input bg-background text-sm"
              value={totalSalesRange[0] === 0 ? "" : totalSalesRange[0]}
              onChange={e => handleRangeChange(0, e.target.value, totalSalesRange, onTotalSalesRangeChange)}
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              placeholder="Max"
              className="h-9 flex-1 px-3 py-1 rounded-md border border-input bg-background text-sm"
              value={totalSalesRange[1] === 0 ? "" : totalSalesRange[1]}
              onChange={e => handleRangeChange(1, e.target.value, totalSalesRange, onTotalSalesRangeChange)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
