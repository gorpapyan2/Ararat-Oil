
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sale } from "@/types";
import { format } from "date-fns";

interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
}

export function SalesTable({ sales, isLoading }: SalesTableProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Fuel Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price/Unit</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{format(new Date(sale.date), "PP")}</TableCell>
              <TableCell className="capitalize">{sale.fuel_type.toLowerCase()}</TableCell>
              <TableCell>{sale.quantity}</TableCell>
              <TableCell>₱{sale.price_per_unit.toFixed(2)}</TableCell>
              <TableCell>₱{sale.total_sales.toFixed(2)}</TableCell>
              <TableCell className="capitalize">{sale.payment_status.toLowerCase()}</TableCell>
            </TableRow>
          ))}
          {sales.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No sales found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
