import { useMemo, useState } from "react";
import { Expense } from "@/types";
import { format } from "date-fns";
import { StandardizedDataTable, FiltersShape } from "@/components/unified/StandardizedDataTable";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  DollarSign,
  CreditCard,
  FileText,
} from "lucide-react";

interface ExpensesTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  categories?: { id: string; name: string }[];
  paymentMethods?: { id: string; name: string }[];
  onFiltersChange?: (filters: any) => void;
  totalCount?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (column: string | null, direction: 'asc' | 'desc') => void;
}

export function ExpensesTable({
  expenses,
  isLoading,
  onEdit,
  onDelete,
  categories = [],
  paymentMethods = [],
  onFiltersChange = () => {},
  totalCount = 0,
  onPageChange,
  onSortChange,
}: ExpensesTableProps) {
  const [filters, setFilters] = useState<FiltersShape>({
    searchTerm: "",
    category: "all",
    paymentMethod: "all",
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: FiltersShape) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Define columns for the StandardizedDataTable
  const columns = useMemo(() => [
    {
      accessorKey: "date" as keyof Expense,
      header: "Date",
      cell: (value: any, row: Expense) => (
        <div className="flex items-center gap-2 py-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {value && typeof value === "string"
              ? format(new Date(value), "MMM dd, yyyy")
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "category" as keyof Expense,
      header: "Category",
      cell: (value: any) => (
        <Badge variant="outline" className="capitalize">
          {value || "Other"}
        </Badge>
      ),
    },
    {
      accessorKey: "description" as keyof Expense,
      header: "Description",
      cell: (value: any) => value || "-",
    },
    {
      accessorKey: "amount" as keyof Expense,
      header: "Amount (֏)",
      cell: (value: any) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {value ? Number(value).toLocaleString() : "0"} ֏
          </span>
        </div>
      ),
    },
    {
      accessorKey: "payment_method" as keyof Expense,
      header: "Payment Method",
      cell: (value: any) => (
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span>{value || "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "invoice_number" as keyof Expense,
      header: "Invoice #",
      cell: (value: any) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{value || "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "notes" as keyof Expense,
      header: "Notes",
      cell: (value: any) => value || "-",
    },
  ], []);

  const isServerSide = Boolean(onPageChange && onSortChange);

  return (
    <StandardizedDataTable
      title="Expenses"
      columns={columns}
      data={expenses}
      loading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
      filters={filters}
      onFilterChange={handleFilterChange}
      totalRows={totalCount}
      serverSide={isServerSide}
      onPageChange={onPageChange}
      onSortChange={onSortChange}
      exportOptions={{
        enabled: true,
        filename: 'expenses-export',
        exportAll: true
      }}
    />
  );
} 