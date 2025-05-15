import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { FuelSupply } from "../types/fuel-supplies.types";

interface FuelSuppliesTableProps {
  fuelSupplies: FuelSupply[];
  isLoading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FuelSuppliesTable({
  fuelSupplies,
  isLoading = false,
  onEdit,
  onDelete,
}: FuelSuppliesTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('fuel.supplies.date')}</TableHead>
          <TableHead>{t('fuel.supplies.provider')}</TableHead>
          <TableHead>{t('fuel.supplies.quantity')}</TableHead>
          <TableHead>{t('fuel.supplies.price')}</TableHead>
          <TableHead>{t('fuel.supplies.total')}</TableHead>
          <TableHead>{t('fuel.supplies.status')}</TableHead>
          <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fuelSupplies.map((supply) => (
          <TableRow key={supply.id}>
            <TableCell>
              {new Date(supply.delivery_date).toLocaleDateString()}
            </TableCell>
            <TableCell>{supply.provider_id}</TableCell>
            <TableCell>{supply.quantity_liters}L</TableCell>
            <TableCell>${supply.price_per_liter.toFixed(2)}</TableCell>
            <TableCell>${supply.total_cost.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={supply.payment_status === 'completed' ? 'default' : 'secondary'}>
                {t(`fuel.supplies.status.${supply.payment_status}`)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(supply.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(supply.id)}
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