import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from '@/core/components/ui/composed/calendar';
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/primitives/input";
import { Label } from "@/core/components/ui/primitives/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/primitives/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/primitives/select";
import { CalendarIcon, Search, X } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

interface DateRange {
  from: Date;
  to: Date;
}

interface FinanceFiltersStandardizedProps {
  onFilterChange: (filters: FinanceFilters) => void;
  className?: string;
}

export interface FinanceFilters {
  dateRange: DateRange;
  searchQuery?: string;
  transactionType?: string;
  categoryId?: string;
}

export function FinanceFiltersStandardized({ onFilterChange, className }: FinanceFiltersStandardizedProps) {
  const { t } = useTranslation();
  const today = new Date();

  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(today, 30),
    to: today,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionType, setTransactionType] = useState<string>('all');
  const [categoryId, setCategoryId] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (range.from && range.to) {
      applyFilters({
        ...filters,
        dateRange: range
      });
      setIsCalendarOpen(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filters: FinanceFilters = {
    dateRange,
    searchQuery: searchQuery || undefined,
    transactionType: transactionType !== 'all' ? transactionType : undefined,
    categoryId: categoryId || undefined,
  };

  const applyFilters = (filters: FinanceFilters) => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    const resetData: FinanceFilters = {
      dateRange: {
        from: subDays(today, 30),
        to: today,
      }
    };
    
    setDateRange(resetData.dateRange);
    setSearchQuery('');
    setTransactionType('all');
    setCategoryId('');
    
    applyFilters(resetData);
  };

  const applyPresetDateRange = (preset: 'week' | 'month' | 'quarter' | 'custom') => {
    let from = dateRange.from;
    let to = dateRange.to;

    switch (preset) {
      case 'week':
        from = startOfWeek(today);
        to = endOfWeek(today);
        break;
      case 'month':
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case 'quarter':
        from = subDays(today, 90);
        to = today;
        break;
      case 'custom':
        // Keep current values
        break;
    }

    const newRange = { from, to };
    setDateRange(newRange);
    applyFilters({
      ...filters,
      dateRange: newRange
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>{t('finance.date_range')}</Label>
          <div className="flex items-center">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from && dateRange.to ? (
                    <>
                      {format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')}
                    </>
                  ) : (
                    <span>{t('finance.select_date_range')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applyPresetDateRange('week')}
                    >
                      {t('finance.this_week')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applyPresetDateRange('month')}
                    >
                      {t('finance.this_month')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applyPresetDateRange('quarter')}
                    >
                      {t('finance.last_90_days')}
                    </Button>
                  </div>
                </div>
                <Calendar
                  mode="range"
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => handleDateRangeChange(range as DateRange)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('finance.search')}</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('finance.search_transactions')}
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilters(filters);
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('finance.transaction_type')}</Label>
          <Select
            value={transactionType}
            onValueChange={(value) => {
              setTransactionType(value);
              applyFilters({
                ...filters,
                transactionType: value !== 'all' ? value : undefined
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('finance.all_transactions')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('finance.all_transactions')}</SelectItem>
              <SelectItem value="income">{t('finance.income')}</SelectItem>
              <SelectItem value="expense">{t('finance.expenses')}</SelectItem>
              <SelectItem value="transfer">{t('finance.transfers')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('finance.category')}</Label>
          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value);
              applyFilters({
                ...filters,
                categoryId: value || undefined
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('finance.all_categories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('finance.all_categories')}</SelectItem>
              <SelectItem value="fuel">{t('finance.fuel')}</SelectItem>
              <SelectItem value="maintenance">{t('finance.maintenance')}</SelectItem>
              <SelectItem value="salary">{t('finance.salary')}</SelectItem>
              <SelectItem value="supplies">{t('finance.supplies')}</SelectItem>
              <SelectItem value="utilities">{t('finance.utilities')}</SelectItem>
              <SelectItem value="other">{t('finance.other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="flex items-center"
        >
          <X className="mr-1 h-4 w-4" />
          {t('finance.reset_filters')}
        </Button>
        <Button 
          size="sm" 
          onClick={() => applyFilters(filters)}
        >
          {t('finance.apply_filters')}
        </Button>
      </div>
    </div>
  );
} 