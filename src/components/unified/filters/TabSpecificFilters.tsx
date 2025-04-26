import React from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Search, CalendarIcon, X } from "lucide-react";

// Common filter shape interface
interface FiltersShape {
  // Common filters
  search: string;
  date?: Date;
  dateRange?: [Date | undefined, Date | undefined];
  
  // Fuel Supplies specific filters
  provider: string;
  tankId?: string;
  fuelType?: string;
  
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
}

export function TabSpecificFilters({
  activeTab,
  filters,
  onFiltersChange,
  providers,
  categories,
  systems,
  expenseCategories
}: TabFiltersProps) {
  const { t } = useTranslation();
  
  // Helper function to count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    
    // Common filters
    if (filters.search) count++;
    if (filters.date) count++;
    
    // Tab-specific filters
    if (activeTab === "fuel-supplies") {
      if (filters.provider && filters.provider !== "all") count++;
      if (filters.fuelType && filters.fuelType !== "all") count++;
      if (filters.tankId && filters.tankId !== "all") count++;
    } else if (activeTab === "sales") {
      if (filters.systemId && filters.systemId !== "all") count++;
      if (filters.salesFuelType && filters.salesFuelType !== "all") count++;
      if (filters.employeeId && filters.employeeId !== "all") count++;
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
      search: "",
      date: undefined,
      dateRange: [undefined, undefined],
      provider: "all",
      tankId: "all",
      fuelType: "all",
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

  // Render common search component
  const renderSearch = () => (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder={t("unifiedData.searchPlaceholder")}
        value={filters.search}
        onChange={(e) => onFiltersChange({ search: e.target.value })}
        className="pl-8 h-10"
      />
      {filters.search && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-10 w-10"
          onClick={() => onFiltersChange({ search: "" })}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );

  // Render date filter component
  const renderDateFilter = () => (
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
  );

  // Render tab-specific filters
  const renderFuelSuppliesFilters = () => (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        {renderSearch()}
        {renderDateFilter()}
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Provider filter */}
        <div className="w-full flex flex-col gap-1.5">
          <Label>{t("fuelSupplies.provider")}</Label>
          <Select
            value={filters.provider}
            onValueChange={(value) => onFiltersChange({ provider: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.selectAnOption")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Fuel Type filter */}
        <div className="w-full flex flex-col gap-1.5">
          <Label>{t("common.fuelType")}</Label>
          <Select
            value={filters.fuelType}
            onValueChange={(value) => onFiltersChange({ fuelType: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.selectAnOption")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fuel Types</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="grid gap-6 md:grid-cols-3">
        <RangeSliderFilter
          label={t("fuelSupplies.quantityLiters")}
          min={0}
          max={10000}
          step={100}
          value={filters.quantityRange}
          onChange={(value) => onFiltersChange({ quantityRange: value })}
          formatValue={(val) => `${val} L`}
        />
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
  );

  const renderSalesFilters = () => (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        {renderSearch()}
        {renderDateFilter()}
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              {systems?.map((system) => (
                <SelectItem key={system.id} value={system.id}>
                  {system.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Fuel Type filter */}
        <div className="w-full flex flex-col gap-1.5">
          <Label>{t("common.fuelType")}</Label>
          <Select
            value={filters.salesFuelType}
            onValueChange={(value) => onFiltersChange({ salesFuelType: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("common.selectAnOption")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fuel Types</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="grid gap-6 md:grid-cols-3">
        <RangeSliderFilter
          label={t("sales.litersDispensed")}
          min={0}
          max={10000}
          step={100}
          value={filters.quantityRange}
          onChange={(value) => onFiltersChange({ quantityRange: value })}
          formatValue={(val) => `${val} L`}
        />
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
        {renderSearch()}
        {renderDateFilter()}
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
              {expenseCategories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
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
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Payment Status filter */}
        <div className="w-full flex flex-col gap-1.5">
          <Label>Payment Status</Label>
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
      <div className="flex flex-wrap gap-2 mt-4">
        {filters.search && (
          <Badge variant="secondary" className="px-3 py-1 h-auto">
            {t("common.search")}: {filters.search}
            <Button
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1"
              onClick={() => onFiltersChange({ search: "" })}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear search filter</span>
            </Button>
          </Badge>
        )}
        
        {filters.date && (
          <Badge variant="secondary" className="px-3 py-1 h-auto">
            {t("common.date")}: {format(filters.date, "PP")}
            <Button
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1"
              onClick={() => onFiltersChange({ date: undefined })}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear date filter</span>
            </Button>
          </Badge>
        )}
        
        {/* More filter chips based on active tab */}
        {activeTab === "fuel-supplies" && filters.provider && filters.provider !== "all" && (
          <Badge variant="secondary" className="px-3 py-1 h-auto">
            {t("fuelSupplies.provider")}: {providers.find(p => p.id === filters.provider)?.name}
            <Button
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 ml-1"
              onClick={() => onFiltersChange({ provider: "all" })}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear provider filter</span>
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
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        {activeTab === "fuel-supplies" && renderFuelSuppliesFilters()}
        {activeTab === "sales" && renderSalesFilters()}
        {activeTab === "expenses" && renderExpensesFilters()}
        {renderActiveFilterChips()}
      </CardContent>
    </Card>
  );
} 