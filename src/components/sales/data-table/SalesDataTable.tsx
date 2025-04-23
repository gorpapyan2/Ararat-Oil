
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/DataTable";

interface SalesDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
}

export function SalesDataTable<TData, TValue>({
  columns,
  data,
  searchColumn = "filling_system_name",
  searchPlaceholder = "Filter by filling system...",
  isLoading = false,
}: SalesDataTableProps<TData, TValue>) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn={searchColumn}
      searchPlaceholder={searchPlaceholder}
      isLoading={isLoading}
      showColumnToggle={true}
    />
  );
}
