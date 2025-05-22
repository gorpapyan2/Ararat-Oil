import React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Calendar } from '@/core/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/core/components/ui/popover';
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/core/components/ui/dropdown-menu';
import { Label } from '@/core/components/ui/label';
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/utils";
import { DateRange } from "@/core/components/ui/primitives/calendar";

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
  className,
}: DateRangePickerProps) {
  const { t } = useTranslation();
  const [startDate, endDate] = dateRange;
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const today = new Date();

  const presets = [
    {
      name: t("common.today"),
      value: [today, today] as [Date, Date],
    },
    {
      name: t("common.yesterday"),
      value: [subDays(today, 1), subDays(today, 1)] as [Date, Date],
    },
    {
      name: t("common.thisWeek"),
      value: [startOfWeek(today, { weekStartsOn: 1 }), today] as [Date, Date],
    },
    {
      name: t("common.lastWeek"),
      value: [
        startOfWeek(subDays(today, 7), { weekStartsOn: 1 }),
        endOfWeek(subDays(today, 7), { weekStartsOn: 1 }),
      ] as [Date, Date],
    },
    {
      name: t("common.thisMonth"),
      value: [startOfMonth(today), today] as [Date, Date],
    },
    {
      name: t("common.lastMonth"),
      value: [
        startOfMonth(subDays(today, 30)),
        endOfMonth(subDays(today, 30)),
      ] as [Date, Date],
    },
    {
      name: t("common.last30Days"),
      value: [subDays(today, 30), today] as [Date, Date],
    },
    {
      name: t("common.last90Days"),
      value: [subDays(today, 90), today] as [Date, Date],
    },
  ];

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

  // Convert the current date range to a format the Calendar component expects
  const calendarValue: DateRange = {
    from: startDate || undefined,
    to: endDate || undefined,
  };

  // Handle the calendar selection
  const handleCalendarSelect = (value: DateRange | undefined) => {
    if (!value) return;
    
    onDateRangeChange([value.from, value.to]);
    if (value.from && value.to) {
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="flex gap-2">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-50/20 border-50/20 hover:bg-80/20 transition-colors",
                !startDate && !endDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              {startDate || endDate
                ? formatDateRange()
                : t("common.selectDateRange")}
            </Button>
          </PopoverTrigger> 
          <PopoverContent
            className="w-auto p-0 border border-40/20 shadow-md"
            align="start"
          >
            <Calendar
              mode="range"
              selected={calendarValue}
              onSelect={handleCalendarSelect as (value: DateRange | undefined) => void}
              initialFocus={true}
              numberOfMonths={2}
              className="p-3"
            />
            <div className="flex items-center justify-between p-3 border-t border-30/20 bg-30/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDateRange}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("common.clear")}
              </Button>
              <Button
                size="sm"
                onClick={() => setIsCalendarOpen(false)}
                className="bg-90/20 hover:bg-primary transition-colors"
              >
                {t("common.apply")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="px-2 bg-50/20 border-50/20 hover:bg-80/20 transition-colors"
            >
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border border-40/20 shadow-md"
          >
            {presets.map((preset) => (
              <DropdownMenuItem
                key={preset.name}
                onClick={() => {
                  onDateRangeChange(preset.value);
                  setIsCalendarOpen(false);
                }}
                className="flex items-center gap-2 hover:bg-10/20 transition-colors"
              >
                {preset.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-30/20" />
            <DropdownMenuItem
              onClick={clearDateRange}
              className="text-muted-foreground hover:text-foreground hover:bg-10/20 transition-colors"
            >
              {t("common.clearDateRange")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
