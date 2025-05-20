import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/components/ui/primitives/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/core/components/ui/primitives/dropdown-menu';
import { Button } from '@/core/components/ui/primitives/button';
import { MoreHorizontal, Edit, Trash, FileText, Eye } from 'lucide-react';
import { Badge } from '@/core/components/ui/primitives/badge';
import { Skeleton } from '@/core/components/ui/primitives/skeleton';
import { useTranslation } from 'react-i18next';
import { Sale } from '../types';

interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
  onEdit?: (sale: Sale) => void;
  onDelete?: (id: string) => void;
  onView?: (sale: Sale) => void;
  onGenerateReceipt?: (sale: Sale) => void;
}

export function SalesTable({
  sales,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onGenerateReceipt,
}: SalesTableProps) {
  const { t } = useTranslation(['sales', 'common']);
  const [sortColumn, setSortColumn] = useState<keyof Sale>('saleDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: keyof Sale) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedSales = useMemo(() => {
    if (!sales) return [];
    
    return [...sales].sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];
      
      // Handle dates
      if (sortColumn === 'saleDate' || sortColumn === 'createdAt' || sortColumn === 'updatedAt') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const result = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? result : -result;
    });
  }, [sales, sortColumn, sortDirection]);

  const renderPaymentStatusBadge = (status: string) => {
    let variant:
      | 'default'
      | 'secondary'
      | 'destructive'
      | 'outline'
      | null
      | undefined = 'default';

    switch (status) {
      case 'paid':
        variant = 'default';
        break;
      case 'pending':
        variant = 'secondary';
        break;
      case 'cancelled':
        variant = 'destructive';
        break;
      default:
        variant = 'outline';
    }

    return (
      <Badge variant={variant}>
        {t(`sales:paymentStatuses.${status}`)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort('saleDate')}
            >
              {t('sales:fields.saleDate')}
              {sortColumn === 'saleDate' && (
                <span className="ml-2">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('fuelType')}>
              {t('sales:fields.fuelType')}
              {sortColumn === 'fuelType' && (
                <span className="ml-2">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('quantityLiters')}>
              {t('sales:fields.quantityLiters')}
              {sortColumn === 'quantityLiters' && (
                <span className="ml-2">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('unitPrice')}>
              {t('sales:fields.unitPrice')}
              {sortColumn === 'unitPrice' && (
                <span className="ml-2">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
              {t('sales:fields.amount')}
              {sortColumn === 'amount' && (
                <span className="ml-2">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('paymentStatus')}>
              {t('sales:fields.paymentStatus')}
              {sortColumn === 'paymentStatus' && (
                <span className="ml-2">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead className="text-right">{t('common:actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                {t('common:noDataAvailable')}
              </TableCell>
            </TableRow>
          ) : (
            sortedSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  {sale.saleDate ? format(new Date(sale.saleDate), 'PPP') : '-'}
                </TableCell>
                <TableCell>{t(`sales:fuelTypes.${sale.fuelType}`)}</TableCell>
                <TableCell>{sale.quantityLiters?.toFixed(2)}</TableCell>
                <TableCell>{sale.unitPrice?.toFixed(2)}</TableCell>
                <TableCell>{sale.amount?.toFixed(2)}</TableCell>
                <TableCell>
                  {renderPaymentStatusBadge(sale.paymentStatus)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">{t('common:openMenu')}</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t('common:actions')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(sale)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>{t('common:view')}</span>
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(sale)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>{t('common:edit')}</span>
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem onClick={() => onDelete(sale.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          <span>{t('common:delete')}</span>
                        </DropdownMenuItem>
                      )}
                      {onGenerateReceipt && (
                        <DropdownMenuItem onClick={() => onGenerateReceipt(sale)}>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>{t('sales:generateReceipt')}</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 