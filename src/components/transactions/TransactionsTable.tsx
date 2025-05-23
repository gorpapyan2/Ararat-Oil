import { useMemo, useState } from "react";
import { Transaction } from "@/types";
import { format } from "date-fns";
import {
  Calendar,
  CreditCard,
  BadgeCheck,
} from "lucide-react";
import { StandardizedDataTable, FiltersShape } from "@/components/unified/StandardizedDataTable";
import { Badge } from "@/components/ui/badge";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onViewDetails?: (transaction: Transaction) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  paymentMethods?: { id: string; name: string }[];
  statuses?: { id: string; name: string }[];
  onFiltersChange?: (filters: any) => void;
  totalCount?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (column: string | null, direction: 'asc' | 'desc') => void;
}

export function TransactionsTable({
  transactions,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete,
  paymentMethods = [
    { id: "cash", name: "Cash" },
    { id: "credit_card", name: "Credit Card" },
    { id: "bank_transfer", name: "Bank Transfer" },
    { id: "mobile_payment", name: "Mobile Payment" },
  ],
  statuses = [
    { id: "completed", name: "Completed" },
    { id: "pending", name: "Pending" },
    { id: "failed", name: "Failed" },
  ],
  onFiltersChange = () => {},
  totalCount = 0,
  onPageChange,
  onSortChange,
}: TransactionsTableProps) {
  const [filters, setFilters] = useState<FiltersShape>({
    searchTerm: "",
    paymentMethod: "all",
    status: "all",
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: FiltersShape) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Define columns for the StandardizedDataTable
  const columns = useMemo(() => [
    {
      accessorKey: "created_at" as keyof Transaction,
      header: "Date",
      cell: (value: any, row: Transaction) => (
        <div className="flex items-center gap-2 py-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {value && typeof value === "string"
              ? format(new Date(value), "PPP")
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "amount" as keyof Transaction,
      header: "Amount",
      cell: (value: any, row: Transaction) => {
        const formattedAmount = value !== undefined && value !== null
          ? Number(value).toLocaleString()
          : "0";

        return (
          <div className="text-right font-medium tabular-nums">
            <span className="font-semibold text-primary">
              {formattedAmount} ֏
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "payment_method" as keyof Transaction,
      header: "Payment Method",
      cell: (value: any, row: Transaction) => (
        <div className="flex items-center gap-2 py-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {value ? value.replace("_", " ").toUpperCase() : "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "payment_status" as keyof Transaction,
      header: "Status",
      cell: (value: any, row: Transaction) => {
        let badgeVariant = "outline";
        if (value) {
          if (
            value.toLowerCase() === "completed" ||
            value.toLowerCase() === "success"
          ) {
            badgeVariant = "success";
          } else if (value.toLowerCase() === "pending") {
            badgeVariant = "warning";
          } else if (
            value.toLowerCase() === "failed" ||
            value.toLowerCase() === "error"
          ) {
            badgeVariant = "destructive";
          }
        }

        return (
          <div className="flex items-center gap-2 py-2">
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
            <Badge variant={badgeVariant as any}>
              {value ? value.toUpperCase() : "N/A"}
            </Badge>
          </div>
        );
      },
    },
  ], []);

  const isServerSide = Boolean(onPageChange && onSortChange);

  return (
    <StandardizedDataTable
      title="Transactions"
      columns={columns}
      data={transactions}
      loading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
      onRowClick={onViewDetails}
      filters={filters}
      onFilterChange={handleFilterChange}
      totalRows={totalCount}
      serverSide={isServerSide}
      onPageChange={onPageChange}
      onSortChange={onSortChange}
      exportOptions={{
        enabled: true,
        filename: 'transactions-export',
        exportAll: true
      }}
    />
  );
}
