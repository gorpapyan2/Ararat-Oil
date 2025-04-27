
import { useState } from "react";
import { Search, Command, X } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup as CmdGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdvancedSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

// Mock recent searches (could be stored in localStorage in a real app)
const recentSearches = [
  "diesel",
  "gazprom",
  "premium fuel",
  "january delivery",
];

export function AdvancedSearchInput({ value, onChange }: AdvancedSearchInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setInputValue(selectedValue);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  const clearSearch = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <div className="relative">
      <div className="relative flex w-full items-center">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search supplies..."
          className="pl-9 pr-8 h-9 w-full"
          onFocus={() => setOpen(true)}
        />
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {inputValue && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full rounded-r-md px-2 py-0 hover:bg-transparent"
            onClick={clearSearch}
          >
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search supplies..." value={inputValue} onValueChange={setInputValue} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {recentSearches && recentSearches.length > 0 && (
            <CmdGroup>
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
            </CmdGroup>
          )}
          <CmdGroup>
            <CommandItem onSelect={() => handleSelect("Provider: Gazprom")}>
              Provider: Gazprom
            </CommandItem>
            <CommandItem onSelect={() => handleSelect("Date: Last Month")}>
              Date: Last Month
            </CommandItem>
            <CommandItem onSelect={() => handleSelect("Tank: Main Storage")}>
              Tank: Main Storage
            </CommandItem>
          </CmdGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
