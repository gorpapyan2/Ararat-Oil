import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/shared/utils"
import { Button } from "@/core/components/ui/button"
import { Calendar } from "@/core/components/ui/primitives/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/primitives/popover"

export interface DateRangePickerProps {
  dateRange?: { from: Date; to?: Date }
  onDateRangeChange?: (dateRange: { from: Date; to?: Date } | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  disabled = false,
  placeholder = "Select date range",
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<{ from: Date; to?: Date } | undefined>(dateRange)

  React.useEffect(() => {
    setDate(dateRange)
  }, [dateRange])

  const handleSelect = (selectedDate: Date) => {
    setDate(prev => {
      if (!prev) {
        return { from: selectedDate }
      }
      
      if (prev.from && !prev.to && selectedDate >= prev.from) {
        const newRange = { from: prev.from, to: selectedDate }
        onDateRangeChange?.(newRange)
        return newRange
      }
      
      const newRange = { from: selectedDate }
      onDateRangeChange?.(newRange)
      return newRange
    })
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 