import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  presets?: {
    label: string;
    getDate: () => Date;
  }[];
}

export function DateRangeFilter({
  date,
  onDateChange,
  presets,
}: DateRangeFilterProps) {
  const [open, setOpen] = React.useState(false);

  const handlePresetClick = (getDate: () => Date) => {
    onDateChange(getDate());
    setOpen(false);
  };

  const handleClearDate = () => {
    onDateChange(undefined);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">Date</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-9 justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b border-border">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Select Date</h4>
              {date && (
                <Button variant="ghost" size="sm" onClick={handleClearDate}>
                  Clear
                </Button>
              )}
            </div>
            {presets && (
              <div className="flex gap-2 flex-wrap">
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetClick(preset.getDate)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
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
