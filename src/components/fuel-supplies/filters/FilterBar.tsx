import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdvancedSearchInput } from "./AdvancedSearchInput";
import { DateRangeFilter } from "./DateRangeFilter";
import { ProviderFilter } from "./ProviderFilter";
import { RangeSliderFilter } from "./RangeSliderFilter";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FilterBarProps {
  filters: {
    search: string;
    date: Date | undefined;
    provider: string;
    type?: string;
    minQuantity: number;
    maxQuantity: number;
    minPrice: number;
    maxPrice: number;
    minTotal: number;
    maxTotal: number;
  };
  onFiltersChange: (updates: Partial<FilterBarProps["filters"]>) => void;
  providers: { id: string; name: string }[];
  isLoading?: boolean;
}

export function FilterBar({
  filters,
  onFiltersChange,
  providers,
  isLoading = false
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Filters</CardTitle>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle filters</span>
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
        <CardDescription>
          Filter fuel supplies by various criteria
        </CardDescription>
      </CardHeader>
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <CardContent className="pb-6 pt-2">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <AdvancedSearchInput
                    value={filters.search}
                    onChange={val => onFiltersChange({ search: val })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <DateRangeFilter
                    date={filters.date}
                    onDateChange={val => onFiltersChange({ date: val })}
                  />
                  <ProviderFilter
                    value={filters.provider}
                    onChange={val => onFiltersChange({ provider: val })}
                    providers={providers}
                    isLoading={isLoading}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid gap-6 md:grid-cols-3">
                <RangeSliderFilter
                  label="Quantity (Liters)"
                  min={0}
                  max={10000}
                  step={100}
                  value={[filters.minQuantity, filters.maxQuantity]}
                  onChange={([min, max]) => onFiltersChange({ minQuantity: min, maxQuantity: max })}
                  formatValue={(val) => `${val}`}
                />
                <RangeSliderFilter
                  label="Price per Liter (֏)"
                  min={0}
                  max={1000}
                  step={10}
                  value={[filters.minPrice, filters.maxPrice]}
                  onChange={([min, max]) => onFiltersChange({ minPrice: min, maxPrice: max })}
                  formatValue={(val) => `${val} ֏`}
                />
                <RangeSliderFilter
                  label="Total Cost (֏)"
                  min={0}
                  max={10000000}
                  step={100000}
                  value={[filters.minTotal, filters.maxTotal]}
                  onChange={([min, max]) => onFiltersChange({ minTotal: min, maxTotal: max })}
                  formatValue={(val) => `${val.toLocaleString()} ֏`}
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
