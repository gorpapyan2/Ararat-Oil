
import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FillingSystemSelectProps {
  value: string;
  onChange: (value: string) => void;
  systems: { id: string; name: string }[];
  placeholder?: string;
  className?: string;
}

export function FillingSystemSelect({
  value,
  onChange,
  systems,
  placeholder = "All systems",
  className = ""
}: FillingSystemSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {systems.map((sys) => (
          <SelectItem key={sys.id} value={sys.id}>{sys.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
