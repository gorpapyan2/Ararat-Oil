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
    <section className="bg-background/80 rounded-xl border border-border shadow-sm p-4 mb-3">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="md:col-span-2 lg:col-span-2 flex flex-col justify-end">
          <SalesSearchBar value={search} onChange={onSearchChange} />
        </div>
        <div className="flex flex-col justify-end">
          <SalesDatePicker date={date} onDateChange={onDateChange} />
        </div>
        <div className="flex flex-col justify-end">
          <SalesSystemSelect
            value={systemId}
            onChange={onSystemChange}
            systems={systems}
          />
        </div>
      </div>
    </section>
  );
}
