import { FuelSuppliesSearchBar } from "./FuelSuppliesSearchBar";
import { FuelSuppliesDatePicker } from "./FuelSuppliesDatePicker";
import { FuelSuppliesProviderSelect } from "./FuelSuppliesProviderSelect";
import { FuelSuppliesRangesFilters } from "./FuelSuppliesRangesFilters";

interface FuelSuppliesFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  providerId: string;
  onProviderChange: (id: string) => void;
  providers: { id: string; name: string }[];
  quantityRange: [number, number];
  onQuantityRangeChange: (range: [number, number]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  totalCostRange: [number, number];
  onTotalCostRangeChange: (range: [number, number]) => void;
}

export function FuelSuppliesFilters({
  search,
  onSearchChange,
  date,
  onDateChange,
  providerId,
  onProviderChange,
  providers,
  quantityRange,
  onQuantityRangeChange,
  priceRange,
  onPriceRangeChange,
  totalCostRange,
  onTotalCostRangeChange,
}: FuelSuppliesFiltersProps) {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <FuelSuppliesSearchBar value={search} onChange={onSearchChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FuelSuppliesDatePicker date={date} onDateChange={onDateChange} />
          <FuelSuppliesProviderSelect
            value={providerId}
            onChange={onProviderChange}
            providers={providers}
          />
        </div>
      </div>
      <FuelSuppliesRangesFilters
        quantityRange={quantityRange}
        onQuantityRangeChange={onQuantityRangeChange}
        priceRange={priceRange}
        onPriceRangeChange={onPriceRangeChange}
        totalCostRange={totalCostRange}
        onTotalCostRangeChange={onTotalCostRangeChange}
      />
    </section>
  );
}
