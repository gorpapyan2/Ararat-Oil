
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className
}) => (
  <div className={`flex items-center gap-2 bg-background border rounded px-3 py-2 shadow-sm ${className || ""}`}>
    <Search className="text-muted-foreground" size={18} />
    <Input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="border-0 focus-visible:ring-0 focus:outline-none shadow-none bg-transparent p-0 text-base"
    />
  </div>
);
