import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/primitives/table";
import { Badge } from "@/core/components/ui/badge";
import type { FuelSupply } from "../types/fuel.types";

interface FuelSupplyListProps {
  supplies: FuelSupply[];
}

export function FuelSupplyList({ supplies }: FuelSupplyListProps) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("fuel.supply.date")}</TableHead>
          <TableHead>{t("fuel.supply.provider")}</TableHead>
          <TableHead>{t("fuel.supply.quantity")}</TableHead>
          <TableHead>{t("fuel.supply.price")}</TableHead>
          <TableHead>{t("fuel.supply.status")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supplies.map((supply) => (
          <TableRow key={supply.id}>
            <TableCell>
              {new Date(supply.delivery_date).toLocaleDateString()}
            </TableCell>
            <TableCell>{supply.provider_id}</TableCell>
            <TableCell>{supply.quantity_liters}L</TableCell>
            <TableCell>${supply.price_per_liter.toFixed(2)}</TableCell>
            <TableCell>
              <Badge
                variant={
                  supply.payment_status === "completed"
                    ? "default"
                    : "secondary"
                }
              >
                {t(`fuel.supply.status.${supply.payment_status}`)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
