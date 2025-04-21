
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import React from "react";

interface SalesDatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}
export function SalesDatePicker({ date, onDateChange }: SalesDatePickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">Date</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full h-9 px-3 py-2 justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
            {date ? format(date, "PPP") : <span>Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
