
import React from "react";
import { SalesSearchBar } from "./SalesSearchBar";
import { SalesDatePicker } from "./SalesDatePicker";
import { SalesSystemSelect } from "./SalesSystemSelect";

interface SalesFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  systemId: string;
  onSystemChange: (id: string) => void;
  systems: { id: string; name: string }[];
}

export function SalesFilters({
  search,
  onSearchChange,
  date,
  onDateChange,
  systemId,
  onSystemChange,
  systems,
}: SalesFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div className="md:col-span-3 lg:col-span-2">
        <SalesSearchBar value={search} onChange={onSearchChange} />
      </div>
      <SalesDatePicker date={date} onDateChange={onDateChange} />
      <SalesSystemSelect value={systemId} onChange={onSystemChange} systems={systems} />
    </div>
  );
}

