import { CalendarIcon, Check } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { subDays, startOfWeek, startOfMonth, format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { StandardDatePicker } from "@/shared/components/common/datepicker";

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
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <StandardDatePicker
            value={date}
            onChange={onDateChange}
            label="Delivery Date"
            mode="single"
          />
        </div>

        <div className="self-end pb-[2px]">
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
    </div>
  );
}
