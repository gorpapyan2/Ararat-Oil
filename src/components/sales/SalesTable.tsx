
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
            <TableHead>Filling System</TableHead>
            <TableHead>Total Liters</TableHead>
            <TableHead>Price/Unit (AMD)</TableHead>
            <TableHead>Total Sales (AMD)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{format(new Date(sale.date), "PP")}</TableCell>
              <TableCell>{sale.filling_system_name}</TableCell>
              <TableCell>{sale.quantity.toFixed(2)}</TableCell>
              <TableCell>{sale.price_per_unit.toLocaleString()} AMD</TableCell>
              <TableCell>{sale.total_sales.toLocaleString()} AMD</TableCell>
            </TableRow>
          ))}
          {sales.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No sales found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
