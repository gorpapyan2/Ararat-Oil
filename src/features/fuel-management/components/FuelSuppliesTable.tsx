import React, { useMemo, useRef } from 'react';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/primitives/badge';
import { StandardizedDataTable, StandardizedDataTableColumn } from '@/shared/components/unified/StandardizedDataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu';
import { Edit, Eye, MoreHorizontal, Fuel, Trash2 } from 'lucide-react';
import { cn } from '@/shared/utils';

// Use the same interface as FuelSuppliesMetrics
export interface SupplyListItem {
  id: string;
  supplier: string;
  fuelType: string;
  quantity: number;
  pricePerLiter: number;
  totalCost: number;
  deliveryDate: string;
  status: 'received' | 'pending' | 'verified';
}

interface FuelSuppliesTableProps {
  data: SupplyListItem[];
  isLoading: boolean;
  onView: (supply: SupplyListItem) => void;
  onEdit: (supply: SupplyListItem) => void;
  onDelete?: (supply: SupplyListItem) => void;
}

// Use React.memo to prevent unnecessary re-renders
export const FuelSuppliesTable = React.memo<FuelSuppliesTableProps>(({
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  // Track render count in development
  const renderCount = useRef(0);
  
  // Only log in development environment with reduced verbosity
  if (import.meta.env.DEV) {
    renderCount.current++;
    console.log(`[FuelSuppliesTable] Render #${renderCount.current} with ${data?.length || 0} items`);
    
    if (import.meta.env.VITE_DEBUG_RENDER === 'true') {
      console.log('Component stack:', new Error().stack?.split('\n').slice(2, 6).join('\n'));
    }
  }

  const columns: StandardizedDataTableColumn<SupplyListItem>[] = useMemo(() => [
    {
      accessorKey: 'supplier',
      header: 'SUPPLIER',
      cell: (value: unknown, row: SupplyListItem) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {row.supplier?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="font-medium text-foreground">{row.supplier}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'fuelType',
      header: 'FUEL TYPE',
      cell: (value: unknown, row: SupplyListItem) => (
        <div className="flex items-center gap-2">
          <Fuel className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.fuelType}</span>
        </div>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'QUANTITY',
      cell: (value: unknown, row: SupplyListItem) => (
        <div className="text-right">
          <div className="font-medium">{(row.quantity || 0).toLocaleString()} L</div>
        </div>
      ),
    },
    {
      accessorKey: 'pricePerLiter',
      header: 'COST/LITER',
      cell: (value: unknown, row: SupplyListItem) => (
        <div className="text-right">
          <div className="font-medium">{(row.pricePerLiter || 0).toFixed(3)} ֏</div>
        </div>
      ),
    },
    {
      accessorKey: 'totalCost',
      header: 'TOTAL COST',
      cell: (value: unknown, row: SupplyListItem) => (
        <div className="text-right">
          <div className="font-bold">{(row.totalCost || 0).toLocaleString()} ֏</div>
        </div>
      ),
    },
    {
      accessorKey: 'deliveryDate',
      header: 'DELIVERY DATE',
      cell: (value: unknown, row: SupplyListItem) => (
        <div>
          <div className="font-medium">
            {new Date(row.deliveryDate).toLocaleDateString()}
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(row.deliveryDate).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'STATUS',
      cell: (value: unknown, row: SupplyListItem) => (
        <Badge 
          className={cn(
            "font-medium",
            row.status === 'received' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : row.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
          )}
        >
          {row.status === 'received' ? 'Received' : row.status === 'pending' ? 'Pending' : 'Verified'}
        </Badge>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'ACTIONS',
      cell: (value: unknown, row: SupplyListItem) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Supply
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete?.(row)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Supply
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [onView, onEdit, onDelete]);

  // Use memo to prevent unnecessary re-renders of the table component
  const memoizedData = useMemo(() => data, [data]);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">
            Supplies ({data.length})
          </h3>
          <div className="text-sm text-muted-foreground">
            Showing {data.length} supplies
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <StandardizedDataTable<SupplyListItem>
          data={memoizedData}
          columns={columns}
          loading={isLoading}
        />
      </div>
    </div>
  );
});
