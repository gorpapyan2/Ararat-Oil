
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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

interface ProviderFilterProps {
  value: string;
  onChange: (value: string) => void;
  providers: { id: string; name: string }[];
}

export function ProviderFilter({ value, onChange, providers }: ProviderFilterProps) {
  const [open, setOpen] = React.useState(false);

  const selectedProvider = providers?.find((provider) => provider.id === value);
  
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">Provider</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-9 w-full justify-between"
          >
            {value && selectedProvider
              ? selectedProvider.name
              : "All providers"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search provider..." />
            <CommandEmpty>No provider found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="all-providers"
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
                All providers
              </CommandItem>
              {providers && providers.map((provider) => (
                <CommandItem
                  key={provider.id}
                  onSelect={() => {
                    onChange(provider.id);
                    setOpen(false);
                  }}
                  className="flex items-center"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === provider.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {provider.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
