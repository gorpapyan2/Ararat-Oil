import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/components/ui/primitives/table';
import { Button } from '@/core/components/ui/primitives/button';
import { Input } from '@/core/components/ui/primitives/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/core/components/ui/primitives/dropdown-menu';
import { Badge } from '@/core/components/ui/primitives/badge';
import { Calendar, ChevronDown, Download, Filter } from 'lucide-react';
import { DateRangePicker } from '@/core/components/ui/composed/date-range-picker';
import { useSuppliesFilters } from '../store/useSuppliesFilters';
import { FuelSupply } from '../types';
import { exportToCsv, exportToPdf } from '../utils/export';
import { motion } from 'framer-motion';

interface SuppliesTableProps {
  supplies: FuelSupply[];
  isLoading?: boolean;
  tanks: any[];
  providers: any[];
}

export function SuppliesTable({
  supplies,
  isLoading,
  tanks,
  providers,
}: SuppliesTableProps) {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const filters = useSuppliesFilters();

  const columns: ColumnDef<FuelSupply>[] = [
    {
      accessorKey: 'delivery_date',
      header: t('supplies.deliveryDate', 'Delivery Date'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(row.getValue('delivery_date')), 'PP')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'provider',
      header: t('supplies.provider', 'Provider'),
      cell: ({ row }) => {
        const provider = row.original.provider;
        return provider?.name || t('common.unknown');
      },
    },
    {
      accessorKey: 'tank',
      header: t('supplies.tank', 'Tank'),
      cell: ({ row }) => {
        const tank = row.original.tank;
        return (
          <div className="flex items-center gap-2">
            <Badge variant={getFuelTypeVariant(tank?.fuel_type)}>
              {tank?.fuel_type || t('common.unknown')}
            </Badge>
            <span>{tank?.name || t('common.unknown')}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'quantity_liters',
      header: t('supplies.quantity', 'Quantity'),
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.getValue('quantity_liters').toLocaleString()} L
        </div>
      ),
    },
    {
      accessorKey: 'price_per_liter',
      header: t('supplies.pricePerLiter', 'Price/L'),
      cell: ({ row }) => (
        <div className="text-right font-medium">
          ${row.getValue('price_per_liter').toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'total_cost',
      header: t('supplies.totalCost', 'Total Cost'),
      cell: ({ row }) => (
        <div className="text-right font-medium">
          ${row.getValue('total_cost').toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'payment_status',
      header: t('supplies.paymentStatus', 'Status'),
      cell: ({ row }) => {
        const status = row.getValue('payment_status') as string;
        return (
          <Badge variant={getPaymentStatusVariant(status)}>
            {status || t('common.pending')}
          </Badge>
        );
      },
    },
  ];

  const table = useReactTable({
    data: supplies,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleExportCsv = () => {
    exportToCsv(supplies, 'fuel-supplies');
  };

  const handleExportPdf = () => {
    exportToPdf(supplies, 'fuel-supplies');
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder={t('supplies.searchPlaceholder', 'Search supplies...')}
            value={(table.getColumn('provider')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('provider')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DateRangePicker
            value={filters.dateRange}
            onChange={filters.setDateRange}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {t('common.columns', 'Columns')}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPdf}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('supplies.noResults', 'No results.')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t('common.previous', 'Previous')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t('common.next', 'Next')}
        </Button>
      </div>
    </motion.div>
  );
}

function getFuelTypeVariant(type?: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (type?.toLowerCase()) {
    case 'diesel':
      return 'secondary';
    case 'petrol':
      return 'destructive';
    case 'gas':
      return 'default';
    default:
      return 'outline';
  }
}

function getPaymentStatusVariant(status?: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status?.toLowerCase()) {
    case 'paid':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'overdue':
      return 'destructive';
    default:
      return 'outline';
  }
} 