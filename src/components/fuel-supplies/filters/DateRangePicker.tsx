import React from "react";
import { CalendarIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  dateRange: [Date | undefined, Date | undefined];
  onDateRangeChange: (dateRange: [Date | undefined, Date | undefined]) => void;
  label?: string;
  className?: string;
}

export function DateRangePicker({ 
  dateRange, 
  onDateRangeChange, 
  label = "Date Range",
  className 
}: DateRangePickerProps) {
  const { t } = useTranslation();
  const [startDate, endDate] = dateRange;
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const today = new Date();
  
  const presets = [
    { 
      name: t("common.today"), 
      value: [today, today] as [Date, Date] 
    },
    { 
      name: t("common.yesterday"), 
      value: [subDays(today, 1), subDays(today, 1)] as [Date, Date] 
    },
    { 
      name: t("common.thisWeek"), 
      value: [startOfWeek(today, { weekStartsOn: 1 }), today] as [Date, Date] 
    },
    { 
      name: t("common.lastWeek"), 
      value: [
        startOfWeek(subDays(today, 7), { weekStartsOn: 1 }), 
        endOfWeek(subDays(today, 7), { weekStartsOn: 1 })
      ] as [Date, Date] 
    },
    { 
      name: t("common.thisMonth"), 
      value: [startOfMonth(today), today] as [Date, Date] 
    },
    { 
      name: t("common.lastMonth"), 
      value: [
        startOfMonth(subDays(today, 30)), 
        endOfMonth(subDays(today, 30))
      ] as [Date, Date] 
    },
    { 
      name: t("common.last30Days"), 
      value: [subDays(today, 30), today] as [Date, Date] 
    },
    { 
      name: t("common.last90Days"), 
      value: [subDays(today, 90), today] as [Date, Date] 
    },
  ];

  const handleSelect = (date: Date | undefined) => {
    if (!startDate || (startDate && endDate)) {
      // If no start date is selected or both dates are selected, set the start date
      onDateRangeChange([date, undefined]);
    } else {
      // If only start date is selected, set the end date
      // Ensure end date is not before start date
      if (date && startDate && date < startDate) {
        onDateRangeChange([date, startDate]);
      } else {
        onDateRangeChange([startDate, date]);
      }
      setIsCalendarOpen(false);
    }
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
    }
    if (startDate) {
      return `${format(startDate, "MMM d, yyyy")} - ?`;
    }
    return t("common.selectDateRange");
  };

  const clearDateRange = () => {
    onDateRangeChange([undefined, undefined]);
    setIsCalendarOpen(false);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{label}</Label>
      <div className="flex gap-2">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-[hsl(var(--background))]/50 border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--background))]/80 transition-colors",
                !startDate && !endDate && "text-[hsl(var(--muted-foreground))]"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              {startDate || endDate ? formatDateRange() : t("common.selectDateRange")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border border-[hsl(var(--border))]/40 shadow-md" align="start">
            <Calendar
              mode="range"
              selected={{
                from: startDate,
                to: endDate,
              }}
              onSelect={(range) => {
                onDateRangeChange([range?.from, range?.to]);
                if (range?.from && range?.to) {
                  setIsCalendarOpen(false);
                }
              }}
              initialFocus
              numberOfMonths={2}
              className="p-3"
            />
            <div className="flex items-center justify-between p-3 border-t border-[hsl(var(--border))]/30 bg-[hsl(var(--muted))]/30">
              <Button variant="ghost" size="sm" onClick={clearDateRange} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                {t("common.clear")}
              </Button>
              <Button size="sm" onClick={() => setIsCalendarOpen(false)} className="bg-[hsl(var(--primary))]/90 hover:bg-[hsl(var(--primary))] transition-colors">
                {t("common.apply")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="px-2 bg-[hsl(var(--background))]/50 border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--background))]/80 transition-colors">
              <CalendarIcon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border border-[hsl(var(--border))]/40 shadow-md">
            {presets.map((preset) => (
              <DropdownMenuItem
                key={preset.name}
                onClick={() => {
                  onDateRangeChange(preset.value);
                  setIsCalendarOpen(false);
                }}
                className="flex items-center gap-2 hover:bg-[hsl(var(--primary))]/10 transition-colors"
              >
                {preset.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-[hsl(var(--border))]/30" />
            <DropdownMenuItem 
              onClick={clearDateRange}
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--primary))]/10 transition-colors"
            >
              {t("common.clearDateRange")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
