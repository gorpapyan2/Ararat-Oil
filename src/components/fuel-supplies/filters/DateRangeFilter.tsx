import { CalendarIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
} from "@/components/ui/dropdown-menu";

interface DateRangeFilterProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function DateRangeFilter({ date, onDateChange }: DateRangeFilterProps) {
  const today = new Date();

  const presets = [
    { name: "Today", value: today },
    { name: "Yesterday", value: subDays(today, 1) },
    { name: "This Week", value: startOfWeek(today) },
    { name: "Last Week", value: startOfWeek(subDays(today, 7)) },
    { name: "This Month", value: startOfMonth(today) },
    { name: "Last Month", value: startOfMonth(subDays(today, 30)) },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        Delivery Date
      </label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full h-9 justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 px-2">
              <CalendarIcon className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {presets.map((preset) => (
              <DropdownMenuItem
                key={preset.name}
                onClick={() => onDateChange(preset.value)}
                className="flex items-center justify-between"
              >
                <span>{preset.name}</span>
                {date &&
                  format(date, "yyyy-MM-dd") ===
                    format(preset.value, "yyyy-MM-dd") && (
                    <Check className="h-4 w-4" />
                  )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={() => onDateChange(undefined)}>
              Clear date
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
