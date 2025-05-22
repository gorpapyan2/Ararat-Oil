import { StandardDatePicker } from "@/shared/components/common/datepicker";
import React from "react";

interface SalesDatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function SalesDatePicker({ date, onDateChange }: SalesDatePickerProps) {
  return (
    <StandardDatePicker
      value={date}
      onChange={onDateChange}
      label="Date"
      mode="single"
      className="w-full"
    />
  );
} 