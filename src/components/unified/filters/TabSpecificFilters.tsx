import React from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RangeSliderFilter } from "@/components/fuel-supplies/filters/RangeSliderFilter";
import { DateRangePicker } from "@/components/fuel-supplies/filters/DateRangePicker";
import { CalendarIcon, X, ChevronDown, ChevronUp } from "lucide-react";

// Common filter shape interface
interface FiltersShape {
  // Common filters
  date?: Date;
  dateRange?: [Date | undefined, Date | undefined];
  
  // Fuel Supplies specific filters
  provider: string;
  tankId?: string;
  
  // Sales specific filters
  systemId?: string;
  salesFuelType?: string;
  employeeId?: string;
  
  // Expenses specific filters
  expenseCategory?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  
  // Range filters
  quantityRange: [number, number];
  priceRange: [number, number];
  totalRange: [number, number];
}

interface TabFiltersProps {
  activeTab: "fuel-supplies" | "sales" | "expenses";
  filters: FiltersShape;
  onFiltersChange: (updates: Partial<FiltersShape>) => void;
  providers: { id: string; name: string }[];
  categories?: { id: string; name: string }[];
  systems?: { id: string; name: string }[];
  expenseCategories?: { id: string; name: string }[];
  tanks?: { id: string; name: string; fuel_type: string; capacity: number; current_level: number }[];
}

export function TabSpecificFilters({
  activeTab,
  filters,
  onFiltersChange,
  providers,
  categories,
  systems,
  expenseCategories,
  tanks = [],
  expanded = true,
}: TabFiltersProps & { expanded?: boolean }) {
  const { t } = useTranslation();

  // Helper function to count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    // Common filters
    if (filters.date) count++;
    if (filters.dateRange && (filters.dateRange[0] || filters.dateRange[1])) count++;
    // Tab-specific filters
    if (activeTab === "fuel-supplies") {
      if (filters.provider && filters.provider !== "all") count++;
      if (filters.tankId && filters.tankId !== "all") count++;
    } else if (activeTab === "sales") {
      if (filters.systemId && filters.systemId !== "all") count++;
    } else if (activeTab === "expenses") {
      if (filters.expenseCategory && filters.expenseCategory !== "all") count++;
      if (filters.paymentMethod && filters.paymentMethod !== "all") count++;
      if (filters.paymentStatus && filters.paymentStatus !== "all") count++;
    }
    // Range filters
    if (filters.quantityRange[0] > 0 || filters.quantityRange[1] < (activeTab === "expenses" ? 1000000 : 10000)) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    if (filters.totalRange[0] > 0 || filters.totalRange[1] < 10000000) count++;
    return count;
  };

  // Helper function to reset all filters
  const resetFilters = () => {
    const clearedFilters: Partial<FiltersShape> = {
      date: undefined,
      dateRange: [undefined, undefined],
      provider: "all",
      tankId: "all",
      systemId: "all",
      salesFuelType: "all",
      employeeId: "all",
      expenseCategory: "all",
      paymentMethod: "all",
      paymentStatus: "all",
      quantityRange: [0, activeTab === "expenses" ? 1000000 : 10000],
      priceRange: [0, 10000],
      totalRange: [0, 10000000],
    };
    onFiltersChange(clearedFilters);
  };

  // Render tab-specific filters
  const renderFuelSuppliesFilters = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 sm:flex-row">
        <DateRangePicker
          dateRange={filters.dateRange || [undefined, undefined]}
          onDateRangeChange={(dateRange) => onFiltersChange({ dateRange })}
          label={t("fuelSupplies.periodFilter")}
          className="w-full"
        />
      </div>
      
      <Separator className="my-2 opacity-50" />
      
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Provider filter */}
        <div className="w-full flex flex-col gap-2">
          <Label className="text-sm font-medium text-muted-foreground">{t("fuelSupplies.provider")}</Label>
          <Select
            value={filters.provider}
            onValueChange={(value) => onFiltersChange({ provider: value })}
          >
            <SelectTrigger className="w-full bg-background/50 border-border/50 hover:bg-background/80 transition-colors">
              <SelectValue placeholder={t("common.selectAnOption")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.allProviders")}</SelectItem>
              {providers.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Tank filter */}
        <div className="w-full flex flex-col gap-2">
          <Label className="text-sm font-medium text-muted-foreground">{t("fuelSupplies.tank")}</Label>
          <Select
            value={filters.tankId || "all"}
            onValueChange={(value) => onFiltersChange({ tankId: value })}
          >
            <SelectTrigger className="w-full bg-background/50 border-border/50 hover:bg-background/80 transition-colors">
              <SelectValue placeholder={t("common.selectAnOption")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.allTanks")}</SelectItem>
              {tanks.map((tank) => (
                <SelectItem key={tank.id} value={tank.id}>
                  {tank.name} ({tank.fuel_type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full lg:col-span-3 grid gap-5 sm:grid-cols-2">
          {/* Price and Total Cost filters remain unchanged */}
          <RangeSliderFilter
            label={t("fuelSupplies.pricePerLiter")}
            min={0}
            max={10000}
            step={100}
            value={filters.priceRange}
            onChange={(value) => onFiltersChange({ priceRange: value })}
            formatValue={(val) => `${val} ֏`}
          />
          <RangeSliderFilter
            label={t("fuelSupplies.totalCost")}
            min={0}
            max={10000000}
            step={100000}
            value={filters.totalRange}
            onChange={(value) => onFiltersChange({ totalRange: value })}
            formatValue={(val) => `${val.toLocaleString()} ֏`}
          />
        </div>
      </div>
    </div>
  );

  const renderSalesFilters = () => (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="w-full flex flex-col gap-1.5">
          <Label>{t("common.date")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !filters.date && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? format(filters.date, "PPP") : t("common.selectAnOption")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.date}
                onSelect={(date) => onFiltersChange({ date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid gap-4">
        {/* Filling System filter */}
        <div className="w-full flex flex-col gap-1.5">
          <Label>{t("sales.fillingSystem")}</Label>
          <Select
            value={filters.systemId}
            onValueChange={(value) => onFiltersChange({ systemId: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.selectAnOption")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Systems</SelectItem>
              {systems && systems.map((system) => (
                <SelectItem key={system.id} value={system.id}>
                  {system.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="grid gap-6 md:grid-cols-3">
        <RangeSliderFilter
          label={t("sales.unitPrice")}
          min={0}
          max={10000}
          step={100}
          value={filters.priceRange}
          onChange={(value) => onFiltersChange({ priceRange: value })}
          formatValue={(val) => `${val} ֏`}
        />
        <RangeSliderFilter
          label={t("common.total")}
          min={0}
          max={10000000}
          step={100000}
          value={filters.totalRange}
          onChange={(value) => onFiltersChange({ totalRange: value })}
          formatValue={(val) => `${val.toLocaleString()} ֏`}
        />
      </div>
    </div>
  );

  const renderExpensesFilters = () => (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="w-full flex flex-col gap-1.5">
          <Label>{t("common.date")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !filters.date && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? format(filters.date, "PPP") : t("common.selectAnOption")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.date}
                onSelect={(date) => onFiltersChange({ date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Category filter */}
        <div className="w-full flex flex-col gap-1.5">
          <Label>{t("expenses.expenseCategory")}</Label>
          <Select
            value={filters.expenseCategory}
            onValueChange={(value) => onFiltersChange({ expenseCategory: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.selectAnOption")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {expenseCategories && expenseCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Payment Method filter */}
        <div className="w-full flex flex-col gap-1.5">
          <Label>{t("expenses.paymentMethod")}</Label>
          <Select
            value={filters.paymentMethod}
            onValueChange={(value) => onFiltersChange({ paymentMethod: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.selectAnOption")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Payment Status filter */}
        <div className="w-full flex flex-col gap-1.5">
          <Label>{t("expenses.paymentStatus")}</Label>
          <Select
            value={filters.paymentStatus}
            onValueChange={(value) => onFiltersChange({ paymentStatus: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.selectAnOption")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="grid gap-6 md:grid-cols-3">
        <RangeSliderFilter
          label={t("expenses.amount")}
          min={0}
          max={1000000}
          step={10000}
          value={filters.quantityRange}
          onChange={(value) => onFiltersChange({ quantityRange: value })}
          formatValue={(val) => `${val.toLocaleString()} ֏`}
        />
      </div>
    </div>
  );

  // Render active filter chips
  const renderActiveFilterChips = () => {
    const activeFiltersCount = getActiveFiltersCount();
    
    if (activeFiltersCount === 0) {
      return null;
    }
    
    return (
      <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border/30">
        {filters.date && (
          <Badge variant="secondary" className="px-3 py-1.5 h-auto rounded-md bg-primary/10 hover:bg-primary/20 transition-colors">
            {t("common.date")}: {format(filters.date, "PP")}
            <Button
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1.5 opacity-70 hover:opacity-100"
              onClick={() => onFiltersChange({ date: undefined })}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear date filter</span>
            </Button>
          </Badge>
        )}
        
        {filters.dateRange && (filters.dateRange[0] || filters.dateRange[1]) && (
          <Badge variant="secondary" className="px-3 py-1.5 h-auto rounded-md bg-primary/10 hover:bg-primary/20 transition-colors">
            {t("common.period")}: {filters.dateRange[0] ? format(filters.dateRange[0], "PP") : '?'} - {filters.dateRange[1] ? format(filters.dateRange[1], "PP") : '?'}
            <Button
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1.5 opacity-70 hover:opacity-100"
              onClick={() => onFiltersChange({ dateRange: [undefined, undefined] })}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear date range filter</span>
            </Button>
          </Badge>
        )}
        
        {/* Tab-specific filter chips */}
        {activeTab === "fuel-supplies" && filters.provider && filters.provider !== "all" && (
          <Badge variant="secondary" className="px-3 py-1.5 h-auto rounded-md bg-primary/10 hover:bg-primary/20 transition-colors">
            {t("fuelSupplies.provider")}: {providers.find(p => p.id === filters.provider)?.name}
            <Button
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1.5 opacity-70 hover:opacity-100"
              onClick={() => onFiltersChange({ provider: "all" })}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear provider filter</span>
            </Button>
          </Badge>
        )}
        
        {activeTab === "fuel-supplies" && filters.tankId && filters.tankId !== "all" && (
          <Badge variant="secondary" className="px-3 py-1.5 h-auto rounded-md bg-primary/10 hover:bg-primary/20 transition-colors">
            {t("fuelSupplies.tank")}: {tanks.find(t => t.id === filters.tankId)?.name}
            <Button
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1.5 opacity-70 hover:opacity-100"
              onClick={() => onFiltersChange({ tankId: "all" })}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear tank filter</span>
            </Button>
          </Badge>
        )}
        
        {activeFiltersCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters}
            className="ml-auto"
          >
            {t("unifiedData.clearFilters")}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card className="mb-6 overflow-hidden border border-border/40 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        {expanded && (
          <>
            {/* Force sales tab if providers is empty and systems is populated */}
            {providers.length === 0 && systems && systems.length > 0 ? (
              renderSalesFilters()
            ) : (
              <>
                {activeTab === "fuel-supplies" && renderFuelSuppliesFilters()}
                {activeTab === "sales" && renderSalesFilters()}
                {activeTab === "expenses" && renderExpensesFilters()}
              </>
            )}
            {renderActiveFilterChips()}
          </>
        )}
      </CardContent>
    </Card>
  );
}