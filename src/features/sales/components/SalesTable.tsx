import { useEffect } from 'react';
import { Sale } from '../types';
import { SalesTableStandardized } from './SalesTableStandardized';

/**
 * @deprecated Use SalesTableStandardized instead.
 */
interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
  onEdit?: (sale: Sale) => void;
  onDelete?: (id: string) => void;
  onView?: (sale: Sale) => void;
  onGenerateReceipt?: (sale: Sale) => void;
}

/**
 * SalesTable component for displaying sales data
 * 
 * @deprecated This component is deprecated. Please use SalesTableStandardized instead.
 */
export function SalesTable(props: SalesTableProps) {
  // Log deprecation warning
  useEffect(() => {
    console.warn(
      'SalesTable is deprecated and will be removed in a future version. ' +
      'Please use SalesTableStandardized from @/features/sales/components/SalesTableStandardized instead.'
    );
  }, []);

  // Forward all props to the standardized implementation
  return <SalesTableStandardized {...props} />;
} 