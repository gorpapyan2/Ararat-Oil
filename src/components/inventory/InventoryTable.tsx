
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import type { DailyInventoryRecord } from "@/types";

interface InventoryTableProps {
  records: DailyInventoryRecord[];
  isLoading: boolean;
}

export function InventoryTable({ records, isLoading }: InventoryTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading records...</div>
      </div>
    );
  }

  if (!records?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-2">
        <p className="text-lg font-medium text-muted-foreground">No records found</p>
        <p className="text-sm text-muted-foreground">Add a new record to get started</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-medium">Tank</TableHead>
            <TableHead className="font-medium">Provider</TableHead>
            <TableHead className="font-medium text-right">Opening Stock</TableHead>
            <TableHead className="font-medium text-right">Received</TableHead>
            <TableHead className="font-medium text-right">Sold</TableHead>
            <TableHead className="font-medium text-right">Closing Stock</TableHead>
            <TableHead className="font-medium text-right">Unit Price</TableHead>
            <TableHead className="font-medium text-right">Total Price</TableHead>
            <TableHead className="font-medium">Last Refill</TableHead>
            <TableHead className="font-medium">Employee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="hover:bg-muted/50">
              <TableCell>{record.tank?.name || 'N/A'}</TableCell>
              <TableCell>{record.provider?.name || 'N/A'}</TableCell>
              <TableCell className="text-right">{record.opening_stock}</TableCell>
              <TableCell className="text-right">{record.received}</TableCell>
              <TableCell className="text-right">{record.sold}</TableCell>
              <TableCell className="text-right">{record.closing_stock}</TableCell>
              <TableCell className="text-right">${record.unit_price.toFixed(2)}</TableCell>
              <TableCell className="text-right">${record.total_price.toFixed(2)}</TableCell>
              <TableCell>{record.last_refill_date ? format(new Date(record.last_refill_date), 'PP') : 'N/A'}</TableCell>
              <TableCell>{record.employee?.name || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
