/**
 * Calendar primitive component for date selection
 */
import React from 'react';
import { cn } from '@/utils/cn';
import { 
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
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
} from 'date-fns';

export interface CalendarProps {
  /** Mode of the calendar */
  mode?: 'single' | 'range' | 'multiple';
  /** Selected date or dates */
  selected?: Date | Date[] | { from: Date; to?: Date };
  /** Callback when a date is selected */
  onSelect?: (date: Date) => void;
  /** Initial focused date */
  initialFocus?: Date;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** CSS class name */
  className?: string;
}

export function Calendar({
  mode = 'single',
  selected,
  onSelect,
  initialFocus,
  minDate,
  maxDate,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    initialFocus || (selected instanceof Date ? selected : new Date())
  );

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToPreviousYear = () => setCurrentMonth(subYears(currentMonth, 1));
  const goToNextYear = () => setCurrentMonth(addYears(currentMonth, 1));
  
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
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Helper to check if a date is selected
  const isSelectedDate = (date: Date): boolean => {
    if (!selected) return false;
    
    if (selected instanceof Date) {
      return isSameDay(date, selected);
    }
    
    if (Array.isArray(selected)) {
      return selected.some(selectedDate => isSameDay(date, selectedDate));
    }
    
    const { from, to } = selected;
    if (!to) return isSameDay(date, from);
    
    const isAfterFrom = date >= from;
    const isBeforeTo = date <= to;
    return isAfterFrom && isBeforeTo;
  };
  
  return (
    <div className={cn("p-3 bg-white rounded-md shadow-md border", className)}>
      {/* Header with month/year navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-1">
          <button
            onClick={goToPreviousYear}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToPreviousMonth}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        
        <h2 className="font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <div className="flex space-x-1">
          <button
            onClick={goToNextMonth}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={goToNextYear}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Days of week header */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div 
            key={day} 
            className="text-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const isSelected = isSelectedDate(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isDisabled = 
            (minDate && day < minDate) || 
            (maxDate && day > maxDate);
          
          return (
            <button
              key={i}
              onClick={() => !isDisabled && onSelect?.(day)}
              disabled={isDisabled}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm",
                !isCurrentMonth && "text-gray-300",
                isToday(day) && !isSelected && "border border-primary",
                isSelected && "bg-primary text-white",
                isDisabled && "opacity-50 cursor-not-allowed",
                !isDisabled && !isSelected && "hover:bg-gray-100"
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
} 