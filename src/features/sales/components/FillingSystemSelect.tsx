import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  systems = [],
  placeholder = "All systems",
  className = "",
}: FillingSystemSelectProps) {
  // Ensure systems is always an array
  const systemsList = Array.isArray(systems) ? systems : [];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        Filling System
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={`h-9 px-3 py-2 w-full rounded-md border border-input bg-background text-sm ${className}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All systems</SelectItem>
          {systemsList.map((sys) => (
            <SelectItem key={sys.id} value={sys.id}>
              {sys.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 