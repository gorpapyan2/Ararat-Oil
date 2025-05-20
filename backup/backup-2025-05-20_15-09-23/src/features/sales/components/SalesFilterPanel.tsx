import { FC } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Button } from '@/core/components/ui/button';
import { SalesFilters } from "./SalesFilters";
import { SalesRangesFilters } from "./SalesRangesFilters";
import { useSalesFilters } from "../hooks/useSalesFilters";
import { SalesFilters as SalesFiltersType } from "../types";

interface SalesFilterPanelProps {
  onClose?: () => void;
  onFiltersChange?: (filters: SalesFiltersType) => void;
}

export const SalesFilterPanel: FC<SalesFilterPanelProps> = ({ 
  onClose,
  onFiltersChange 
}) => {
  const { t } = useTranslation();
  const { 
    filters, 
    updateFilters, 
    resetFilters,
    filterOptions 
  } = useSalesFilters();

  // Pass filter changes to parent if provided
  const handleFiltersChange = (newFilters: Partial<SalesFiltersType>) => {
    updateFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {t("sales.filters.title", "Filters")}
        </h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">{t("common.close")}</span>
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <SalesFilters 
          search={filters.searchTerm || ''}
          onSearchChange={(value: string) => handleFiltersChange({ searchTerm: value })}
          date={filters.dateRange?.from}
          onDateChange={(date: Date | undefined) => handleFiltersChange({ 
            dateRange: date ? { from: date } : undefined 
          })}
          systemId={filters.fillingSystem || 'all'}
          onSystemChange={(id: string) => handleFiltersChange({ fillingSystem: id })}
          systems={[{ id: 'all', name: t('common.all') }]} // This should be populated with actual systems
        />
        
        <SalesRangesFilters 
          litersRange={[
            filters.minQuantity || 0, 
            filters.maxQuantity || 0
          ]}
          onLitersRangeChange={([min, max]) => handleFiltersChange({ 
            minQuantity: min || undefined, 
            maxQuantity: max || undefined 
          })}
          priceRange={[
            filters.minAmount || 0, 
            filters.maxAmount || 0
          ]}
          onPriceRangeChange={([min, max]) => handleFiltersChange({ 
            minAmount: min || undefined, 
            maxAmount: max || undefined 
          })}
          totalSalesRange={[0, 0]} // This is deprecated but still required by component
          onTotalSalesRangeChange={() => {}} // No-op as we don't use this anymore
        />

        <div className="flex justify-end pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters}
          >
            {t("common.reset", "Reset")}
          </Button>
        </div>
      </div>
    </div>
  );
}; 