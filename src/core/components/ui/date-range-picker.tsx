import React, { useState } from 'react';
import { Calendar } from './primitives/calendar';
import { CalendarDays } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './primitives/popover';
import { cn } from '@/shared/utils';

interface DateRange {
  from: Date;
  to: Date;
}

interface DatePickerWithRangeProps {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
  className?: string;
}

const formatDate = (date: Date | undefined) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({
  date,
  onDateChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    onDateChange?.(selectedDate);
  };

  const setQuickRange = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    
    const newRange = { from, to };
    handleDateSelect(newRange);
    setIsOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {formatDate(date.from)} - {formatDate(date.to)}
                </>
              ) : (
                formatDate(date.from)
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuickRange(7)}
              >
                Last 7 days
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuickRange(30)}
              >
                Last 30 days
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuickRange(365)}
              >
                Last year
              </Button>
            </div>
          </div>
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Export both names for compatibility
export const DateRangePicker = DatePickerWithRange;
