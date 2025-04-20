
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { FuelSupply } from "@/types";

interface FuelSuppliesTableProps {
  fuelSupplies: FuelSupply[];
  isLoading: boolean;
}

export function FuelSuppliesTable({ fuelSupplies, isLoading }: FuelSuppliesTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading records...</div>
      </div>
    );
  }

  if (!fuelSupplies?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-2">
        <p className="text-lg font-medium text-muted-foreground">No fuel supply records found</p>
        <p className="text-sm text-muted-foreground">Add a new record to get started</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-medium">Delivery Date</TableHead>
            <TableHead className="font-medium">Provider</TableHead>
            <TableHead className="font-medium">Tank</TableHead>
            <TableHead className="font-medium text-right">Quantity (Liters)</TableHead>
            <TableHead className="font-medium text-right">Price per Liter</TableHead>
            <TableHead className="font-medium text-right">Total Cost</TableHead>
            <TableHead className="font-medium">Employee</TableHead>
            <TableHead className="font-medium">Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fuelSupplies.map((supply) => (
            <TableRow key={supply.id} className="hover:bg-muted/50">
              <TableCell>{format(new Date(supply.delivery_date), 'PP')}</TableCell>
              <TableCell>{supply.provider?.name || 'N/A'}</TableCell>
              <TableCell>{supply.tank?.name || 'N/A'} ({supply.tank?.fuel_type || 'N/A'})</TableCell>
              <TableCell className="text-right">{supply.quantity_liters.toFixed(2)}</TableCell>
              <TableCell className="text-right">${supply.price_per_liter.toFixed(2)}</TableCell>
              <TableCell className="text-right">${supply.total_cost.toFixed(2)}</TableCell>
              <TableCell>{supply.employee?.name || 'N/A'}</TableCell>
              <TableCell>{supply.comments || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
