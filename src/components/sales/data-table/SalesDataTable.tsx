
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { EnhancedDataTable } from "@/components/ui/enhanced-data-table";

interface SalesDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  title?: string;
  description?: string;
  enhanced?: boolean;
  gradientStyle?: "primary" | "accent" | "brand" | "error" | "subtle" | "none";
  borderStyle?: "accent" | "error" | "brand" | "primary" | "default" | "none";
}

export function SalesDataTable<TData, TValue>({
  columns,
  data,
  searchColumn = "filling_system_name",
  searchPlaceholder = "Filter by filling system...",
  isLoading = false,
  title,
  description,
  enhanced = true,
  gradientStyle = "subtle",
  borderStyle = "default",
}: SalesDataTableProps<TData, TValue>) {
  // If enhanced is true, use our new EnhancedDataTable component
  if (enhanced) {
    // Define filterable columns for the enhanced table
    const filterableColumns = columns.map(col => {
      const colDef = col as any;
      return {
        id: colDef.accessorKey || '',
        title: colDef.header || ''
      };
    }).filter(col => col.id && col.title);

    return (
      <EnhancedDataTable
        columns={columns}
        data={data}
        title={title || "Sales Data"}
        description={description || "View and manage all sales transactions."}
        searchColumn={searchColumn}
        filterableColumns={filterableColumns}
        gradientStyle={gradientStyle}
        borderStyle={borderStyle}
        rounded={true}
        animated={true}
      />
    );
  }
  
  // Otherwise use the original DataTable
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
