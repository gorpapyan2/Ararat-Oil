
import * as React from "react";
import { FillingSystemSelect } from "./FillingSystemSelect";

interface SalesSystemSelectProps {
  value: string;
  onChange: (id: string) => void;
  systems: { id: string; name: string }[];
}

export function SalesSystemSelect({ value, onChange, systems }: SalesSystemSelectProps) {
  return (
    <FillingSystemSelect
      value={value}
      onChange={onChange}
      systems={systems}
      placeholder="All systems"
      className="w-full"
    />
  );
}
