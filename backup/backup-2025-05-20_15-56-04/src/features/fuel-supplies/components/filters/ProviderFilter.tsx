import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/core/components/ui/primitives/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/core/components/ui/popover';
import { cn } from "@/shared/utils";
import { Input } from "@/core/components/ui/primitives/input";
import { useTranslation } from "react-i18next";

interface ProviderFilterProps {
  value: string;
  onChange: (value: string) => void;
  providers: { id: string; name: string }[];
  isLoading?: boolean;
}

export function ProviderFilter({
  value = "all",
  onChange,
  providers = [],
  isLoading = false,
}: ProviderFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const { t } = useTranslation();

  // Ensure providers is always defined and an array
  const providersList = Array.isArray(providers) ? providers : [];
  const selectedProvider = providersList.find(
    (provider) => provider.id === value,
  );

  // Filter providers based on search
  const filteredProviders = React.useMemo(() => {
    if (!search) return providersList;
    const lowerSearch = search.toLowerCase();
    return providersList.filter((prov) =>
      prov.name.toLowerCase().includes(lowerSearch),
    );
  }, [providersList, search]);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {t("common.providers")}
      </label>
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
              : t("common.allProviders")}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-2 bg-background border shadow-lg shadow-primary/5 z-50"
          sideOffset={4}
        >
          <div className="flex flex-col space-y-2">
            <Input
              placeholder={t("fuelSupplies.searchProviderPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />

            <div className="max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="py-6 text-center text-sm">
                  <div className="h-4 w-4 animate-spin mx-auto border-2 border-primary/50 border-t-primary rounded-full" />
                  <p className="mt-2 text-muted-foreground">
                    {t("common.loading")}
                  </p>
                </div>
              ) : filteredProviders.length === 0 && search ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {t("common.noResults")}
                </div>
              ) : (
                <div className="space-y-1">
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                      value === "all" ? "bg-accent text-accent-foreground" : "",
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
                        value === "all" ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {t("common.allProviders")}
                  </div>

                  {filteredProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className={cn(
                        "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                        value === provider.id
                          ? "bg-accent text-accent-foreground"
                          : "",
                      )}
                      onClick={() => {
                        onChange(provider.id);
                        setSearch("");
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === provider.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {provider.name}
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
