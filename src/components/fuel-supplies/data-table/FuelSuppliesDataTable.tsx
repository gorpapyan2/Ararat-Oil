
import { FuelSupply } from "@/types";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { getFuelSuppliesColumns } from "./FuelSuppliesColumns";

interface FuelSuppliesDataTableProps {
  data: FuelSupply[];
  isLoading: boolean;
  onEdit: (supply: FuelSupply) => void;
  onDelete: (supply: FuelSupply) => void;
}

export function FuelSuppliesDataTable({ data, isLoading, onEdit, onDelete }: FuelSuppliesDataTableProps) {
  const columns = getFuelSuppliesColumns(onEdit, onDelete);
  
  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="provider.name"
      searchPlaceholder="Search by provider..."
      isLoading={isLoading}
      showColumnToggle={true}
    />
  );
}
