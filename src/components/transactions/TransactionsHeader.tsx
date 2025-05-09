import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { PaymentMethod } from "@/types";
import { useTranslation } from "react-i18next";

interface TransactionsHeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  paymentMethod: string | null;
  onPaymentMethodChange: (method: string | null) => void;
  dateRange: Date | undefined;
  onDateRangeChange: (date: Date | undefined) => void;
  onFiltersChange?: (filters: any) => void;
}

export function TransactionsHeader({
  search,
  onSearchChange,
  paymentMethod,
  onPaymentMethodChange,
  dateRange,
  onDateRangeChange,
  onFiltersChange,
}: TransactionsHeaderProps) {
  const { t } = useTranslation();
  const paymentMethods: PaymentMethod[] = [
    "cash",
    "card",
    "bank_transfer",
    "mobile_payment",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input
        placeholder={t("transactions.searchPlaceholder")}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full"
      />

      <Select
        value={paymentMethod || ""}
        onValueChange={(val) => onPaymentMethodChange(val || null)}
      >
        <SelectTrigger>
          <SelectValue placeholder={t("transactions.paymentMethodPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {paymentMethods.map((method) => (
            <SelectItem key={method} value={method}>
              {t(`common.paymentMethods.${method}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange ? format(dateRange, "PPP") : t("common.selectDate")}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={dateRange}
            onSelect={onDateRangeChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
