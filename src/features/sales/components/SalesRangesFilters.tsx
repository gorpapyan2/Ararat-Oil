import React from "react";

interface SalesRangesFiltersProps {
  litersRange: [number, number];
  onLitersRangeChange: (range: [number, number]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  totalSalesRange: [number, number];
  onTotalSalesRangeChange: (range: [number, number]) => void;
}

// Helper to format number or empty for zero
const fieldValue = (v: number) => (v === 0 ? "" : v);

const handleRangeChange = (
  idx: number,
  value: string,
  range: [number, number],
  setRange: (r: [number, number]) => void,
) => {
  const newVal = value === "" ? 0 : Number(value);
  const updated: [number, number] = [...range] as [number, number];
  updated[idx] = newVal;
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
  // Styling:
  // - Card with dark glass effect, strong border
  // - Uniform label and input layout
  // - Min/Max inside a flex-row that aligns inputs and separates clearly

  return (
    <section
      className="rounded-xl shadow-lg border border-border bg-gray-50 bg-opacity-70 p-6 mt-2
        flex flex-col gap-6
        md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6"
      aria-label="Sales Range Filters"
    >
      {/* Liters Range */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-1">
          Liters Range
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            className="w-full md:w-24 flex-1 h-11 px-3 py-2 rounded-lg border border-input bg-gray-50 text-base focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition disabled:opacity-50"
            value={fieldValue(litersRange[0])}
            min={0}
            onChange={(e) =>
              handleRangeChange(
                0,
                e.target.value,
                litersRange,
                onLitersRangeChange,
              )
            }
          />
          <span className="text-lg text-muted-foreground font-medium mx-1">
            –
          </span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            className="w-full md:w-24 flex-1 h-11 px-3 py-2 rounded-lg border border-input bg-gray-50 text-base focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition disabled:opacity-50"
            value={fieldValue(litersRange[1])}
            min={0}
            onChange={(e) =>
              handleRangeChange(
                1,
                e.target.value,
                litersRange,
                onLitersRangeChange,
              )
            }
          />
        </div>
      </div>
      {/* Price/Unit Range */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-1">
          Price/Unit Range <span className="text-muted-foreground">(֏)</span>
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            className="w-full md:w-24 flex-1 h-11 px-3 py-2 rounded-lg border border-input bg-gray-50 text-base focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition disabled:opacity-50"
            value={fieldValue(priceRange[0])}
            min={0}
            onChange={(e) =>
              handleRangeChange(
                0,
                e.target.value,
                priceRange,
                onPriceRangeChange,
              )
            }
          />
          <span className="text-lg text-muted-foreground font-medium mx-1">
            –
          </span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            className="w-full md:w-24 flex-1 h-11 px-3 py-2 rounded-lg border border-input bg-gray-50 text-base focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition disabled:opacity-50"
            value={fieldValue(priceRange[1])}
            min={0}
            onChange={(e) =>
              handleRangeChange(
                1,
                e.target.value,
                priceRange,
                onPriceRangeChange,
              )
            }
          />
        </div>
      </div>
      {/* Total Sales Range */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-1">
          Total Sales Range <span className="text-muted-foreground">(֏)</span>
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            className="w-full md:w-24 flex-1 h-11 px-3 py-2 rounded-lg border border-input bg-gray-50 text-base focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition disabled:opacity-50"
            value={fieldValue(totalSalesRange[0])}
            min={0}
            onChange={(e) =>
              handleRangeChange(
                0,
                e.target.value,
                totalSalesRange,
                onTotalSalesRangeChange,
              )
            }
          />
          <span className="text-lg text-muted-foreground font-medium mx-1">
            –
          </span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            className="w-full md:w-24 flex-1 h-11 px-3 py-2 rounded-lg border border-input bg-gray-50 text-base focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition disabled:opacity-50"
            value={fieldValue(totalSalesRange[1])}
            min={0}
            onChange={(e) =>
              handleRangeChange(
                1,
                e.target.value,
                totalSalesRange,
                onTotalSalesRangeChange,
              )
            }
          />
        </div>
      </div>
    </section>
  );
} 