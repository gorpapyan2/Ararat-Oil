
import * as React from "react";
import { Check, ChevronsUpDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FillingSystemFilterProps {
  value: string;
  onChange: (value: string) => void;
  systems: { id: string; name: string }[];
}

export function FillingSystemFilter({ value, onChange, systems = [] }: FillingSystemFilterProps) {
  const [open, setOpen] = React.useState(false);

  // Ensure systems is always defined and an array
  const systemsList = Array.isArray(systems) ? systems : [];
  const selectedSystem = systemsList.find((system) => system.id === value);
  
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">Filling System</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-9 w-full justify-between"
          >
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              {value && selectedSystem
                ? selectedSystem.name
                : "All systems"}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search system..." />
            <CommandEmpty>No system found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="all-systems"
                onSelect={() => {
                  onChange("all");
                  setOpen(false);
                }}
                className="flex items-center"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                All systems
              </CommandItem>
              {systemsList.map((system) => (
                <CommandItem
                  key={system.id}
                  onSelect={() => {
                    onChange(system.id);
                    setOpen(false);
                  }}
                  className="flex items-center"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === system.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {system.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
