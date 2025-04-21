
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types";
import { format } from "date-fns";
import { Edit, MoreHorizontal, Trash2, Eye } from "lucide-react";

interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
  onEdit?: (sale: Sale) => void;
  onDelete?: (id: string) => void;
  onView?: (sale: Sale) => void;
}

export function SalesTable({ sales, isLoading, onEdit, onDelete, onView }: SalesTableProps) {
  if (isLoading) {
    return <div className="flex justify-center p-4">Loading sales data...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Filling System</TableHead>
            <TableHead className="text-right">Total Liters</TableHead>
            <TableHead className="text-right">Price/Unit (֏)</TableHead>
            <TableHead className="text-right">Total Sales (֏)</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{format(new Date(sale.date), "PP")}</TableCell>
              <TableCell>{sale.filling_system_name}</TableCell>
              <TableCell className="text-right">{sale.quantity.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                {sale.price_per_unit.toLocaleString()} ֏
              </TableCell>
              <TableCell className="text-right">
                {sale.total_sales.toLocaleString()} ֏
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView?.(sale)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(sale)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit sale
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => onDelete?.(sale.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete sale
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {sales.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No sales found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
