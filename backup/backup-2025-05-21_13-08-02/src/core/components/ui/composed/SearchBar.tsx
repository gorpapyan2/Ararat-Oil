import { Input } from "@/core/components/ui/primitives/input";
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
  className,
}) => (
  <div className={`relative ${className || ""}`}>
    <Search
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
      size={16}
    />
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="pl-9 h-9 border border-input bg-gray-50 rounded-md text-sm"
    />
  </div>
);
