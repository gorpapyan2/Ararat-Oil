import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface FuelSuppliesProviderSelectProps {
  value: string;
  onChange: (value: string) => void;
  providers: { id: string; name: string }[];
}

export function FuelSuppliesProviderSelect({
  value,
  onChange,
  providers,
}: FuelSuppliesProviderSelectProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {t("common.providers")}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9">
          <SelectValue placeholder={t("common.allProviders")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("common.allProviders")}</SelectItem>
          {providers.map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              {provider.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
