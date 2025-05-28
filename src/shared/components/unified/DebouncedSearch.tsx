import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/core/components/ui/primitives/input";
import { Button } from "@/core/components/ui/button";

export interface DebouncedSearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Called when the search value changes (after debounce) */
  onSearch?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Initial search value */
  value?: string;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Custom clear icon */
  clearIcon?: React.ReactNode;
  /** Whether the clear button should be visible */
  clearable?: boolean;
  /** Custom classes to apply to the container */
  containerClassName?: string;
  /** Additional input props */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** Label for screen readers */
  screenReaderLabel?: string;
}

/**
 * DebouncedSearch component
 *
 * A search input that debounces user input to avoid excessive callbacks
 * Particularly useful for search fields that trigger API calls
 */
export function DebouncedSearch({
  debounceMs = 300,
  onSearch,
  placeholder = "Search...",
  value: initialValue = "",
  icon = <Search className="h-4 w-4" />,
  clearIcon = <X className="h-4 w-4" />,
  clearable = true,
  containerClassName = "",
  inputProps,
  screenReaderLabel = "Search",
  ...rest
}: DebouncedSearchProps) {
  // Controlled input value
  const [value, setValue] = useState(initialValue);

  // Refs for debouncing
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Sync with external value prop changes
  useEffect(() => {
    if (initialValue !== undefined && initialValue !== value) {
      setValue(initialValue);
      if (onSearch) {
        onSearch(initialValue);
      }
    }
  }, [initialValue, onSearch, value]);

  // Handle input changes with debounce
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      // Cancel any pending debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        if (onSearch) {
          onSearch(newValue);
        }
      }, debounceMs);
    },
    [debounceMs, onSearch]
  );

  // Handle clear button click
  const handleClear = useCallback(() => {
    setValue("");
    if (onSearch) {
      onSearch("");
    }
  }, [onSearch]);

  return (
    <div className={`relative ${containerClassName}`}>
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
        {icon}
      </div>

      {/* Screen reader text */}
      <label htmlFor="debounced-search-input" className="sr-only">
        {screenReaderLabel}
      </label>

      <Input
        id="debounced-search-input"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-8 pr-8"
        role="searchbox"
        aria-label={screenReaderLabel}
        {...inputProps}
        {...rest}
      />

      {clearable && value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
          onClick={handleClear}
          aria-label="Clear search"
        >
          {clearIcon}
        </Button>
      )}
    </div>
  );
}
