import { SearchBar } from "@/components/ui/SearchBar";
import React from "react";

interface SalesSearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export function SalesSearchBar({ value, onChange }: SalesSearchBarProps) {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Search sales by system, fuel type, or date..."
      className="h-9 w-full"
    />
  );
}
