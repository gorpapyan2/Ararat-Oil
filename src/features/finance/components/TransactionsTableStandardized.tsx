import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Calendar, CreditCard, BadgeCheck } from "lucide-react";
import {
  StandardizedDataTable,
  FiltersShape,
  createBadgeCell,
  createDateCell,
  createCurrencyCell,
} from "@/shared/components/unified/StandardizedDataTable";
import { Badge } from "@/core/components/ui/primitives/badge";
import type { Transaction } from "../types/finance.types";

interface TransactionsTableStandardizedProps {
  transactions: Transaction[];
  isLoading: boolean;
  onViewDetails?: (transaction: Transaction) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  paymentMethods?: { id: string; name: string }[];
  statuses?: { id: string; name: string }[];
  onFiltersChange?: (filters: FiltersShape) => void;
  totalCount?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (column: string | null, direction: "asc" | "desc") => void;
}

export function TransactionsTableStandardized({
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
}: TransactionsTableStandardizedProps) {
  const { t } = useTranslation(["finance", "common"]);
  const [filters, setFilters] = useState<FiltersShape>({
    searchTerm: "",
    paymentMethod: "all",
    status: "all",
  });

  // Handle edit action
  const handleEdit = (id: string) => {
    if (onEdit) {
      onEdit(id);
    }
  };

  // Handle delete action
  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  // Handle row click for view details
  const handleRowClick = (row: Transaction) => {
    if (onViewDetails) {
      onViewDetails(row);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FiltersShape) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Define status badge variant based on status value
  const getStatusVariant = (status: string | undefined) => {
    if (!status) return "outline";

    const statusLower = status.toLowerCase();
    if (statusLower === "completed" || statusLower === "success") {
      return "success";
    } else if (statusLower === "pending") {
      return "warning";
    } else if (statusLower === "failed" || statusLower === "error") {
      return "destructive";
    }
    return "outline";
  };

  // Define columns for the StandardizedDataTable
  const columns = useMemo(
    () => [
      {
        header: t("finance:transactions.fields.date"),
        accessorKey: "created_at" as keyof Transaction,
        cell: (value: string) => createDateCell(value),
        enableSorting: true,
      },
      {
        header: t("finance:transactions.fields.amount"),
        accessorKey: "amount" as keyof Transaction,
        cell: (value: number) => createCurrencyCell(value),
        enableSorting: true,
      },
      {
        header: t("finance:transactions.fields.paymentMethod"),
        accessorKey: "payment_method" as keyof Transaction,
        cell: (value: string) => (
          <div className="flex items-center gap-2 py-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {value ? value.replace("_", " ").toUpperCase() : "N/A"}
            </span>
          </div>
        ),
        enableSorting: true,
      },
      {
        header: t("finance:transactions.fields.status"),
        accessorKey: "payment_status" as keyof Transaction,
        cell: (value: string) =>
          createBadgeCell(
            value ? value.toUpperCase() : "N/A",
            getStatusVariant(value)
          ),
        enableSorting: true,
      },
      {
        header: t("finance:transactions.fields.description"),
        accessorKey: "description" as keyof Transaction,
        cell: (value: string) => (
          <span className="truncate max-w-[200px]">{value || "N/A"}</span>
        ),
        enableSorting: true,
      },
    ],
    [t]
  );

  const isServerSide = Boolean(onPageChange && onSortChange);

  return (
    <StandardizedDataTable
      title={t("finance:transactions.title")}
      columns={columns}
      data={transactions}
      loading={isLoading}
      onEdit={onEdit ? handleEdit : undefined}
      onDelete={onDelete ? handleDelete : undefined}
      onRowClick={onViewDetails ? handleRowClick : undefined}
      filters={filters}
      onFilterChange={handleFilterChange}
      totalRows={totalCount}
      serverSide={isServerSide}
      onPageChange={onPageChange}
      onSortChange={onSortChange}
      exportOptions={{
        enabled: true,
        filename: "transactions-export",
        exportAll: true,
      }}
    />
  );
}
