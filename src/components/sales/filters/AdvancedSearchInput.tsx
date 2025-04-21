
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";

interface AdvancedSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  recentSearches?: string[];
}

export function AdvancedSearchInput({
  value,
  onChange,
  placeholder = "Search sales...",
  recentSearches = [],
}: AdvancedSearchInputProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setInputValue(selectedValue);
    setOpen(false);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 px-9 text-left relative"
          onClick={() => setOpen(true)}
        >
          {value || placeholder}
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 h-5 select-none rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 text-muted-foreground">
            <span className="mr-1">⌘</span>K
          </kbd>
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search supplies..." value={inputValue} onValueChange={setInputValue} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {recentSearches && recentSearches.length > 0 && (
            <CommandGroup heading="Recent Searches">
              {recentSearches.map((search) => (
                <CommandItem
                  key={search}
                  onSelect={() => handleSelect(search)}
                  className="flex items-center"
                >
                  <Command className="mr-2 h-4 w-4" />
                  {search}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => handleSelect("System: Pump 1")}>
              System: Pump 1
            </CommandItem>
            <CommandItem onSelect={() => handleSelect("Fuel: Petrol")}>
              Fuel: Petrol
            </CommandItem>
            <CommandItem onSelect={() => handleSelect("Fuel: Diesel")}>
              Fuel: Diesel
            </CommandItem>
            <CommandItem onSelect={() => handleSelect("Date: Today")}>
              Date: Today
            </CommandItem>
            <CommandItem onSelect={() => handleSelect("Date: This Week")}>
              Date: This Week
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
