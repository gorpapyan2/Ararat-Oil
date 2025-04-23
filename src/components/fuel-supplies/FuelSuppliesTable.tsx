import { FuelSupply } from "@/types";
import { FuelSuppliesDataTable } from "./data-table/FuelSuppliesDataTable";

interface FuelSuppliesTableProps {
  fuelSupplies: FuelSupply[];
  isLoading: boolean;
  onEdit: (supply: FuelSupply) => void;
  onDelete: (supply: FuelSupply) => void;
}

export function FuelSuppliesTable({ fuelSupplies, isLoading, onEdit, onDelete }: FuelSuppliesTableProps) {
  return (
    <FuelSuppliesDataTable
      data={fuelSupplies}
      isLoading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
