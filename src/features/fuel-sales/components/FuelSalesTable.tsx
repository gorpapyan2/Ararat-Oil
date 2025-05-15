import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { FuelSalesStatusUpdate } from "./FuelSalesStatusUpdate";
import type { FuelSale } from "../types/fuel-sales.types";

interface FuelSalesTableProps {
  sales: FuelSale[];
  isLoading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FuelSalesTable({
  sales,
  isLoading = false,
  onEdit,
  onDelete,
}: FuelSalesTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('fuel.sales.date')}</TableHead>
          <TableHead>{t('fuel.sales.customer')}</TableHead>
          <TableHead>{t('fuel.sales.quantity')}</TableHead>
          <TableHead>{t('fuel.sales.price')}</TableHead>
          <TableHead>{t('fuel.sales.total')}</TableHead>
          <TableHead>{t('fuel.sales.status')}</TableHead>
          <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
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
            <TableCell>${sale.total_amount.toFixed(2)}</TableCell>
            <TableCell>
              <FuelSalesStatusUpdate sale={sale} />
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(sale.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(sale.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 