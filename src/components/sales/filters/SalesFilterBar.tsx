import React, { createContext, useContext, useState, useTransition } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Filter as FilterIcon,
  X as ClearIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DateRangeFilter } from "./DateRangeFilter";
import { FillingSystemFilter } from "./FillingSystemFilter";
import { RangeSliderFilter } from "./RangeSliderFilter";
import { Separator } from "@/components/ui/separator";

// -----------------------------------------------------------------------------
// Context helper so children (chips) can clear filters without prop‑drill
// -----------------------------------------------------------------------------
interface FiltersShape {
  date?: Date;
  systemId: string;
  litersRange: [number, number];
  priceRange: [number, number];
  totalSalesRange: [number, number];
}

interface ContextValue {
  filters: FiltersShape;
  setPartial: (u: Partial<FiltersShape>) => void;
  systems: { id: string; name: string }[];
}

const FiltersCtx = createContext<ContextValue | null>(null);

const useFiltersCtx = () => {
  const ctx = useContext(FiltersCtx);
  if (!ctx) throw new Error("FiltersCtx missing");
  return ctx;
};

// -----------------------------------------------------------------------------
// Public wrapper
// -----------------------------------------------------------------------------
interface SalesFilterBarProps {
  onFiltersChange: (u: Partial<FiltersShape>) => void;
  systems: { id: string; name: string }[];
  filters: FiltersShape;
  isLoading?: boolean;
}

export function SalesFilterBar({ 
  onFiltersChange, 
  systems, 
  filters: initialFilters,
  isLoading = false 
}: SalesFilterBarProps) {
  const [filters, setFilters] = useState<FiltersShape>(initialFilters);
  const [isOpen, setIsOpen] = useState(true);
  const [, startTransition] = useTransition();

  const setPartial = (u: Partial<FiltersShape>) => {
    setFilters(f => ({ ...f, ...u }));
    // debounce heavy table refreshes via React‑18 transitions
    startTransition(() => onFiltersChange(u));
  };

  const hasActive = Object.entries(filters).some(([k, v]) => {
    if (k === "systemId") return v !== "all";
    if (Array.isArray(v)) return v[0] !== 0 || v[1] !== 0;
    return Boolean(v);
  });

  const clearAll = () => setPartial({
    date: undefined,
    systemId: "all",
    litersRange: [0, 0],
    priceRange: [0, 0],
    totalSalesRange: [0, 0],
  });

  return (
    <FiltersCtx.Provider value={{ filters, setPartial, systems }}>
      <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/10">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-medium">Sales Filters</h3>
          </div>
          {hasActive && (
            <Button size="sm" variant="ghost" onClick={clearAll} className="gap-1 text-xs">
              <ClearIcon className="h-3 w-3" /> Clear all
            </Button>
          )}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2 h-8 w-8">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        {/* chip summary */}
        {hasActive && <ActiveChips />}

        {/* body */}
        <Collapsible open={isOpen}>
          <CollapsibleContent>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <DateRangeFilter
                  date={filters.date}
                  onDateChange={date => setPartial({ date })}
                />
                <FillingSystemFilter
                  value={filters.systemId}
                  onChange={systemId => setPartial({ systemId })}
                  systems={systems}
                  isLoading={isLoading}
                />
              </div>
              <Separator className="opacity-50 mb-6" />
              <div className="grid md:grid-cols-3 gap-6">
                <RangeSliderFilter
                  label="Liters"
                  value={filters.litersRange}
                  onChange={litersRange => setPartial({ litersRange })}
                  min={0}
                  max={10000}
                  step={100}
                  formatValue={v => `${v} L`}
                />
                <RangeSliderFilter
                  label="Price / L"
                  value={filters.priceRange}
                  onChange={priceRange => setPartial({ priceRange })}
                  min={0}
                  max={2000}
                  step={10}
                  formatValue={v => `${v} ֏`}
                />
                <RangeSliderFilter
                  label="Total Sales"
                  value={filters.totalSalesRange}
                  onChange={totalSalesRange => setPartial({ totalSalesRange })}
                  min={0}
                  max={1000000}
                  step={1000}
                  formatValue={v => `${v.toLocaleString()} ֏`}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </FiltersCtx.Provider>
  );
}

// -----------------------------------------------------------------------------
// Active filter chips
// -----------------------------------------------------------------------------
function ActiveChips() {
  const { filters, setPartial, systems } = useFiltersCtx();
  
  const chips: { id: string; label: string; clear: () => void }[] = [];

  if (filters.date) chips.push({
    id: "date",
    label: format(filters.date, "PPP"),
    clear: () => setPartial({ date: undefined }),
  });
  
  if (filters.systemId !== "all") {
    // Find system name
    const selectedSystem = systems.find(s => s.id === filters.systemId);
    const systemName = selectedSystem?.name || filters.systemId;
    
    chips.push({
      id: "system",
      label: `System: ${systemName}`,
      clear: () => setPartial({ systemId: "all" }),
    });
  }

  const rangeChip = (range: [number, number], label: string, key: keyof FiltersShape) => {
    if (range[0] || range[1]) chips.push({
      id: key as string,
      label: `${label}: ${range[0]} — ${range[1]}`,
      clear: () => setPartial({ [key]: [0, 0] } as Partial<FiltersShape>),
    });
  };

  rangeChip(filters.litersRange, "L", "litersRange");
  rangeChip(filters.priceRange, "֏/L", "priceRange");
  rangeChip(filters.totalSalesRange, "Σ֏", "totalSalesRange");

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-border/10 bg-card/40">
      {chips.map(c => (
        <Badge key={c.id} variant="outline" className="gap-1 text-xs cursor-pointer" onClick={c.clear}>
          {c.label} <ClearIcon className="h-3 w-3" />
        </Badge>
      ))}
    </div>
  );
}
