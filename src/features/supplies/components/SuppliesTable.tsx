import { useEffect } from 'react';
import { FuelSupply } from '../types';
import { SuppliesTableStandardized } from './SuppliesTableStandardized';

/**
 * @deprecated Use SuppliesTableStandardized instead
 */
interface SuppliesTableProps {
  supplies: FuelSupply[];
  isLoading?: boolean;
  tanks: any[];
  providers: any[];
}

/**
 * @deprecated Use SuppliesTableStandardized instead
 */
export function SuppliesTable({
  supplies,
  isLoading,
  tanks,
  providers,
}: SuppliesTableProps) {
  // Log deprecation warning
  useEffect(() => {
    console.warn(
      'SuppliesTable is deprecated and will be removed in a future version. ' +
      'Please use SuppliesTableStandardized instead.'
    );
  }, []);

  return (
    <SuppliesTableStandardized
      supplies={supplies}
      isLoading={isLoading}
      tanks={tanks}
      providers={providers}
    />
  );
} 