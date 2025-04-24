
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { DateRangeFilter } from "./DateRangeFilter";
import { FillingSystemFilter } from "./FillingSystemFilter";
import { RangeSliderFilter } from "./RangeSliderFilter";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface SalesFilterBarProps {
  filters: {
    date: Date | undefined;
    systemId: string;
    litersRange: [number, number];
    priceRange: [number, number];
    totalSalesRange: [number, number];
  };
  onFiltersChange: (updates: Partial<SalesFilterBarProps["filters"]>) => void;
  systems: { id: string; name: string }[];
}

export function SalesFilterBar({
  filters,
  onFiltersChange,
  systems,
}: SalesFilterBarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="border shadow-sm bg-card/70 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Filters</h3>
        </div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
      
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateRangeFilter
                  date={filters.date}
                  onDateChange={(date) => onFiltersChange({ date })}
                />
                <FillingSystemFilter
                  value={filters.systemId}
                  onChange={(systemId) => onFiltersChange({ systemId })}
                  systems={systems}
                />
              </div>
              
              <Separator />
              
              <div className="grid gap-6 md:grid-cols-3">
                <RangeSliderFilter
                  label="Liters Range"
                  value={filters.litersRange}
                  onChange={(range) => onFiltersChange({ litersRange: range })}
                  min={0}
                  max={10000}
                  step={100}
                  formatValue={(val) => `${val}L`}
                />
                <RangeSliderFilter
                  label="Price Range"
                  value={filters.priceRange}
                  onChange={(range) => onFiltersChange({ priceRange: range })}
                  min={0}
                  max={2000}
                  step={10}
                  formatValue={(val) => `${val}֏`}
                />
                <RangeSliderFilter
                  label="Total Sales"
                  value={filters.totalSalesRange}
                  onChange={(range) => onFiltersChange({ totalSalesRange: range })}
                  min={0}
                  max={1000000}
                  step={1000}
                  formatValue={(val) => `${val.toLocaleString()}֏`}
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
