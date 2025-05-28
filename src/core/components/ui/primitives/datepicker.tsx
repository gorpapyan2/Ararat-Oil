import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/shared/utils";
import { Button } from "@/core/components/ui/button";
import { Calendar } from "@/core/components/ui/primitives/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/primitives/popover";

export interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  date,
  onDateChange,
  disabled = false,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );

  React.useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateChange?.(date);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "PPP")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
