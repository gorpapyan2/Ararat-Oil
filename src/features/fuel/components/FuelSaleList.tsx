import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/primitives/table";
import { Badge } from "@/core/components/ui/primitives/badge";
import type { FuelSale } from "../types/fuel.types";

interface FuelSaleListProps {
  sales: FuelSale[];
}

export function FuelSaleList({ sales }: FuelSaleListProps) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("fuel.sale.date")}</TableHead>
          <TableHead>{t("fuel.sale.customer")}</TableHead>
          <TableHead>{t("fuel.sale.quantity")}</TableHead>
          <TableHead>{t("fuel.sale.price")}</TableHead>
          <TableHead>{t("fuel.sale.status")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>
              {new Date(sale.sale_date).toLocaleDateString()}
            </TableCell>
            <TableCell>{sale.customer_name}</TableCell>
            <TableCell>{sale.quantity_liters}L</TableCell>
            <TableCell>${sale.price_per_liter.toFixed(2)}</TableCell>
            <TableCell>
              <Badge
                variant={
                  sale.payment_status === "completed" ? "default" : "secondary"
                }
              >
                {t(`fuel.sale.status.${sale.payment_status}`)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
