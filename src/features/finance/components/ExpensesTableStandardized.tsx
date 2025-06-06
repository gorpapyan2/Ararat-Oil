import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreditCard, FileText } from 'lucide-react';
import {
  StandardizedDataTable,
  FiltersShape,
  createBadgeCell,
  createDateCell,
  createCurrencyCell,
} from "@/shared/components/unified/StandardizedDataTable";
import { Badge } from "@/core/components/ui/primitives/badge";
import type { Expense } from "../types/finance.types";

interface ExpensesTableStandardizedProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  categories?: { id: string; name: string }[];
  paymentMethods?: { id: string; name: string }[];
  onFiltersChange?: (filters: FiltersShape) => void;
  totalCount?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (column: string | null, direction: "asc" | "desc") => void;
}

export function ExpensesTableStandardized({
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
}: ExpensesTableStandardizedProps) {
  const { t } = useTranslation(["finance", "common"]);
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

  // Define status badge variant based on status value
  const getPaymentStatusVariant = (status: string | undefined) => {
    if (!status) return "outline";

    const statusLower = status.toLowerCase();
    if (statusLower === "paid" || statusLower === "completed") {
      return "success";
    } else if (statusLower === "pending") {
      return "warning";
    } else if (statusLower === "cancelled" || statusLower === "failed") {
      return "destructive";
    }
    return "outline";
  };

  // Define columns for the StandardizedDataTable
  const columns = useMemo(
    () => [
      {
        header: t("finance:expenses.fields.date"),
        accessorKey: "date" as keyof Expense,
        cell: (value: string) => createDateCell(value),
        enableSorting: true,
      },
      {
        header: t("finance:expenses.fields.category"),
        accessorKey: "category" as keyof Expense,
        cell: (value: string) => (
          <Badge variant="outline" className="capitalize">
            {value || t("common:other")}
          </Badge>
        ),
        enableSorting: true,
      },
      {
        header: t("finance:expenses.fields.description"),
        accessorKey: "description" as keyof Expense,
        cell: (value: string) => value || "-",
        enableSorting: true,
      },
      {
        header: t("finance:expenses.fields.amount"),
        accessorKey: "amount" as keyof Expense,
        cell: (value: number) => createCurrencyCell(value),
        enableSorting: true,
      },
      {
        header: t("finance:expenses.fields.paymentMethod"),
        accessorKey: "payment_method" as keyof Expense,
        cell: (value: string) => (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span>{value || "-"}</span>
          </div>
        ),
        enableSorting: true,
      },
      {
        header: t("finance:expenses.fields.paymentStatus"),
        accessorKey: "payment_status" as keyof Expense,
        cell: (value: string) =>
          createBadgeCell(
            value ? value.toUpperCase() : "N/A",
            getPaymentStatusVariant(value)
          ),
        enableSorting: true,
      },
      {
        header: t("finance:expenses.fields.invoiceNumber"),
        accessorKey: "invoice_number" as keyof Expense,
        cell: (value: string) => (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{value || "-"}</span>
          </div>
        ),
        enableSorting: true,
      },
      {
        header: t("finance:expenses.fields.notes"),
        accessorKey: "notes" as keyof Expense,
        cell: (value: string) => value || "-",
        enableSorting: true,
      },
    ],
    [t]
  );

  const isServerSide = Boolean(onPageChange && onSortChange);

  return (
    <StandardizedDataTable
      title={t("finance:expenses.title")}
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
        filename: "expenses-export",
        exportAll: true,
      }}
    />
  );
}
