/**
 * Calendar primitive component for date selection
 */
import React from "react";
import { cn } from "@/utils/cn";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  addMonths,
  subMonths,
  addYears,
  subYears,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";

export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

export interface CalendarProps {
  /** Mode of the calendar */
  mode?: "single" | "range" | "multiple";
  /** Selected date or dates */
  selected?: Date | Date[] | DateRange | undefined;
  /** Callback when a date is selected */
  onSelect?: (date: Date | DateRange | undefined) => void;
  /** Number of months to display */
  numberOfMonths?: number;
  /** Initial focused date */
  initialFocus?: boolean | Date;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** CSS class name */
  className?: string;
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  initialFocus,
  minDate,
  maxDate,
  numberOfMonths = 1,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    selected instanceof Date
      ? selected
      : selected && !Array.isArray(selected) && selected.from
        ? selected.from
        : new Date()
  );

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToPreviousYear = () => setCurrentMonth(subYears(currentMonth, 1));
  const goToNextYear = () => setCurrentMonth(addYears(currentMonth, 1));

  // Handle date selection based on mode
  const handleDateSelect = (date: Date) => {
    if (!onSelect) return;

    if (mode === "single") {
      onSelect(date);
    } else if (mode === "multiple") {
      const datesArray = Array.isArray(selected) ? [...selected] : [];
      const dateIndex = datesArray.findIndex((d) => isSameDay(d, date));

      if (dateIndex >= 0) {
        datesArray.splice(dateIndex, 1);
      } else {
        datesArray.push(date);
      }

      // Handle type casting for multiple dates mode
      onSelect(datesArray[0] as Date);
    } else if (mode === "range") {
      // Handle range selection
      const currentRange = (selected as DateRange) || {
        from: undefined,
        to: undefined,
      };

      if (!currentRange.from) {
        onSelect({ from: date, to: undefined });
      } else if (!currentRange.to) {
        // If selecting a date before the start date, swap them
        if (date < currentRange.from) {
          onSelect({ from: date, to: currentRange.from });
        } else {
          onSelect({ from: currentRange.from, to: date });
        }
      } else {
        // Reset and start a new range
        onSelect({ from: date, to: undefined });
      }
    }
  };

  // Generate days for the current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // Day names for header
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper to check if a date is selected
  const isSelectedDate = (date: Date): boolean => {
    if (!selected) return false;

    if (selected instanceof Date) {
      return isSameDay(date, selected);
    }

    if (Array.isArray(selected)) {
      return selected.some((selectedDate) => isSameDay(date, selectedDate));
    }

    const { from, to } = selected as DateRange;
    if (!from) return false;
    if (!to) return isSameDay(date, from);

    const isAfterFrom = date >= from;
    const isBeforeTo = date <= to;
    return isAfterFrom && isBeforeTo;
  };

  const isRangeStart = (date: Date): boolean => {
    if (
      mode !== "range" ||
      !selected ||
      selected instanceof Date ||
      Array.isArray(selected)
    ) {
      return false;
    }

    const { from } = selected as DateRange;
    return from ? isSameDay(date, from) : false;
  };

  const isRangeEnd = (date: Date): boolean => {
    if (
      mode !== "range" ||
      !selected ||
      selected instanceof Date ||
      Array.isArray(selected)
    ) {
      return false;
    }

    const { from, to } = selected as DateRange;
    return from && to ? isSameDay(date, to) : false;
  };

  // Generate multiple months if requested
  const months = [];
  for (let i = 0; i < numberOfMonths; i++) {
    const monthToRender = addMonths(currentMonth, i);
    months.push(monthToRender);
  }

  return (
    <div className={cn("bg-10 rounded-md border", className)}>
      <div className="flex flex-col space-y-4">
        {months.map((month, monthIndex) => (
          <div key={monthIndex} className="p-3">
            {/* Header with month/year navigation */}
            <div className="flex items-center justify-between mb-4">
              {monthIndex === 0 && (
                <div className="flex space-x-1">
                  <button
                    onClick={goToPreviousYear}
                    className="p-1 rounded hover:bg-30/20"
                    type="button"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={goToPreviousMonth}
                    className="p-1 rounded hover:bg-30/20"
                    type="button"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
              )}

              <h2 className="font-medium">{format(month, "MMMM yyyy")}</h2>

              {monthIndex === numberOfMonths - 1 && (
                <div className="flex space-x-1">
                  <button
                    onClick={goToNextMonth}
                    className="p-1 rounded hover:bg-30/20"
                    type="button"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={goToNextYear}
                    className="p-1 rounded hover:bg-30/20"
                    type="button"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {eachDayOfInterval({
                start: startOfWeek(startOfMonth(month)),
                end: endOfWeek(endOfMonth(month)),
              }).map((day, i) => {
                const isSelected = isSelectedDate(day);
                const isCurrentMonth = isSameMonth(day, month);
                const isDisabled =
                  (minDate && day < minDate) || (maxDate && day > maxDate);
                const isStart = isRangeStart(day);
                const isEnd = isRangeEnd(day);

                return (
                  <button
                    key={i}
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled}
                    type="button"
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-sm",
                      !isCurrentMonth && "text-muted",
                      isToday(day) && !isSelected && "border border-primary",
                      isSelected && !isStart && !isEnd && "bg-primary/20",
                      (isStart || isEnd) && "bg-primary text-white",
                      isDisabled && "opacity-50 cursor-not-allowed",
                      !isDisabled && !isSelected && "hover:bg-30/20"
                    )}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
