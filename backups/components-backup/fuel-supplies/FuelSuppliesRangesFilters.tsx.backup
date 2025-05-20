import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FuelSuppliesRangesFiltersProps {
  quantityRange: [number, number];
  onQuantityRangeChange: (range: [number, number]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  totalCostRange: [number, number];
  onTotalCostRangeChange: (range: [number, number]) => void;
}

export function FuelSuppliesRangesFilters({
  quantityRange,
  onQuantityRangeChange,
  priceRange,
  onPriceRangeChange,
  totalCostRange,
  onTotalCostRangeChange,
}: FuelSuppliesRangesFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label className="text-xs">Quantity Range (Liters)</Label>
        <Slider
          min={0}
          max={10000}
          step={100}
          value={[quantityRange[0], quantityRange[1]]}
          onValueChange={(value) =>
            onQuantityRangeChange(value as [number, number])
          }
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{quantityRange[0]}</span>
          <span>{quantityRange[1]}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Price Range (֏)</Label>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={[priceRange[0], priceRange[1]]}
          onValueChange={(value) =>
            onPriceRangeChange(value as [number, number])
          }
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{priceRange[0]} ֏</span>
          <span>{priceRange[1]} ֏</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Total Cost Range (֏)</Label>
        <Slider
          min={0}
          max={10000000}
          step={100000}
          value={[totalCostRange[0], totalCostRange[1]]}
          onValueChange={(value) =>
            onTotalCostRangeChange(value as [number, number])
          }
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{totalCostRange[0].toLocaleString()} ֏</span>
          <span>{totalCostRange[1].toLocaleString()} ֏</span>
        </div>
      </div>
    </div>
  );
}
