import * as React from "react";
import { Check, ChevronsUpDown, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface FillingSystemFilterProps {
  value: string;
  onChange: (value: string) => void;
  systems: { id: string; name: string }[];
  isLoading?: boolean;
}

export function FillingSystemFilter({ 
  value = "all", 
  onChange, 
  systems = [],
  isLoading = false 
}: FillingSystemFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Ensure systems is always defined and an array
  const systemsList = Array.isArray(systems) ? systems : [];
  const selectedSystem = systemsList.find((system) => system.id === value);
  
  // Filter systems based on search
  const filteredSystems = React.useMemo(() => {
    if (!search) return systemsList;
    const lowerSearch = search.toLowerCase();
    return systemsList.filter(sys => 
      sys.name.toLowerCase().includes(lowerSearch)
    );
  }, [systemsList, search]);
  
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
        <PopoverContent 
          className="w-full p-2 bg-background border shadow-lg shadow-primary/5 z-50"
          sideOffset={4}
        >
          <div className="flex flex-col space-y-2">
            <Input
              placeholder="Search system..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
            
            <div className="max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="py-6 text-center text-sm">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  <p className="mt-2 text-muted-foreground">Loading systems...</p>
                </div>
              ) : filteredSystems.length === 0 && search ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No systems found.
                </div>
              ) : (
                <div className="space-y-1">
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                      value === "all" ? "bg-accent text-accent-foreground" : ""
                    )}
                    onClick={() => {
                      onChange("all");
                      setSearch("");
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === "all" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    All systems
                  </div>
                  
                  {filteredSystems.map((system) => (
                    <div
                      key={system.id}
                      className={cn(
                        "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                        value === system.id ? "bg-accent text-accent-foreground" : ""
                      )}
                      onClick={() => {
                        onChange(system.id);
                        setSearch("");
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === system.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {system.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
