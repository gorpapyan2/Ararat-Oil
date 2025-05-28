import { Input } from "@/core/components/ui/primitives/input";
import { Search } from "lucide-react";
import React from "react";
import { cn } from "@/shared/utils";

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  variant?: "simple" | "button";
}

/**
 * SearchBar component for searching content
 * Supports controlled and uncontrolled usage
 */
export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  className,
  variant = "simple",
}: SearchBarProps) {
  const [internalValue, setInternalValue] = React.useState(value || "");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  React.useEffect(() => {
    if (isControlled && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value, isControlled, internalValue]);

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(currentValue);
  };

  if (variant === "button") {
    return (
      <form onSubmit={handleSubmit} className={cn("flex w-full", className)}>
        <Input
          type="search"
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="flex h-10 w-full rounded-l-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background"
        />
        <button
          type="submit"
          className="h-10 rounded-r-md border border-l-0 border-input bg-gray-50 px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          Search
        </button>
      </form>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        size={16}
      />
      <Input
        type="text"
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 h-9 w-full border border-input bg-gray-50 rounded-md text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSearch?.(currentValue);
          }
        }}
      />
    </div>
  );
}
