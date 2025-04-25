import { useState } from "react";
import { Filter, ChevronDown, ChevronUp, X, SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { AdvancedSearchInput } from "./AdvancedSearchInput";
import { DateRangeFilter } from "./DateRangeFilter";
import { ProviderFilter } from "./ProviderFilter";
import { RangeSliderFilter } from "./RangeSliderFilter";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Count active filters
  useState(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.date) count++;
    if (filters.provider) count++;
    if (filters.minQuantity > 0 || filters.maxQuantity < 10000) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 1000) count++;
    if (filters.minTotal > 0 || filters.maxTotal < 10000000) count++;
    setActiveFiltersCount(count);
  });
  
  const handleTempFilterChange = (updates: Partial<typeof filters>) => {
    setTempFilters(prev => ({ ...prev, ...updates }));
  };
  
  const applyFilters = () => {
    onFiltersChange(tempFilters);
    setIsOpen(false);
  };
  
  const resetFilters = () => {
    const resetValues = {
      search: "",
      date: undefined,
      provider: "",
      type: undefined,
      minQuantity: 0,
      maxQuantity: 10000,
      minPrice: 0,
      maxPrice: 1000,
      minTotal: 0,
      maxTotal: 10000000,
    };
    setTempFilters(resetValues);
    onFiltersChange(resetValues);
  };

  // Only render Desktop UI for larger screens
  const renderDesktopFilters = () => (
    <Card className="w-full hidden md:block">
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

  // Mobile UI with sheet and accordion
  const renderMobileFilters = () => (
    <div className="w-full md:hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search supplies..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="pr-8 h-10"
          />
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="relative h-10 w-10 shrink-0"
              aria-label="Advanced filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  variant="destructive"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] sm:h-[75vh] sm:max-w-none rounded-t-xl">
            <SheetHeader className="text-left">
              <SheetTitle>Advanced Filters</SheetTitle>
              <SheetDescription>
                Filter and sort your fuel supplies data
              </SheetDescription>
            </SheetHeader>
            
            <Tabs defaultValue="filters" className="mt-4">
              <TabsList className="w-full">
                <TabsTrigger value="filters" className="flex-1">Filters</TabsTrigger>
                <TabsTrigger value="ranges" className="flex-1">Ranges</TabsTrigger>
              </TabsList>
              <TabsContent value="filters" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <Input
                      placeholder="Search all fields..."
                      value={tempFilters.search}
                      onChange={(e) => handleTempFilterChange({ search: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Delivery Date</label>
                    <DateRangeFilter
                      date={tempFilters.date}
                      onDateChange={val => handleTempFilterChange({ date: val })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Provider</label>
                    <ProviderFilter
                      value={tempFilters.provider}
                      onChange={val => handleTempFilterChange({ provider: val })}
                      providers={providers}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="ranges" className="mt-4">
                <div className="space-y-6">
                  <RangeSliderFilter
                    label="Quantity (Liters)"
                    min={0}
                    max={10000}
                    step={100}
                    value={[tempFilters.minQuantity, tempFilters.maxQuantity]}
                    onChange={([min, max]) => handleTempFilterChange({ minQuantity: min, maxQuantity: max })}
                    formatValue={(val) => `${val}`}
                  />
                  
                  <RangeSliderFilter
                    label="Price per Liter (֏)"
                    min={0}
                    max={1000}
                    step={10}
                    value={[tempFilters.minPrice, tempFilters.maxPrice]}
                    onChange={([min, max]) => handleTempFilterChange({ minPrice: min, maxPrice: max })}
                    formatValue={(val) => `${val} ֏`}
                  />
                  
                  <RangeSliderFilter
                    label="Total Cost (֏)"
                    min={0}
                    max={10000000}
                    step={100000}
                    value={[tempFilters.minTotal, tempFilters.maxTotal]}
                    onChange={([min, max]) => handleTempFilterChange({ minTotal: min, maxTotal: max })}
                    formatValue={(val) => `${val.toLocaleString()} ֏`}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <SheetFooter className="flex-row gap-2 sm:gap-4 mt-4">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={resetFilters}
              >
                Reset
              </Button>
              <SheetClose asChild>
                <Button 
                  className="flex-1" 
                  onClick={applyFilters}
                >
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Active filters badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.search.length > 12 ? filters.search.slice(0, 10) + '...' : filters.search}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onFiltersChange({ search: "" })}
              />
            </Badge>
          )}
          
          {filters.date && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {filters.date.toLocaleDateString()}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onFiltersChange({ date: undefined })}
              />
            </Badge>
          )}
          
          {filters.provider && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Provider: {providers.find(p => p.id === filters.provider)?.name || 'Unknown'}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onFiltersChange({ provider: "" })}
              />
            </Badge>
          )}
          
          {(filters.minQuantity > 0 || filters.maxQuantity < 10000) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Quantity: {filters.minQuantity}-{filters.maxQuantity}L
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onFiltersChange({ minQuantity: 0, maxQuantity: 10000 })}
              />
            </Badge>
          )}
          
          {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: {filters.minPrice}-{filters.maxPrice}֏
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onFiltersChange({ minPrice: 0, maxPrice: 1000 })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {renderMobileFilters()}
      {renderDesktopFilters()}
    </>
  );
}
