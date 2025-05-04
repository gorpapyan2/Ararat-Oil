import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/services/transactions";
import { TransactionsTable } from "./TransactionsTable";
import { TransactionsHeader } from "./TransactionsHeader";
import { TransactionsDialogsStandardized } from "./TransactionsDialogsStandardized";
import { Transaction } from "@/types";
import { useToast } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useDialog } from "@/hooks/useDialog";

export function TransactionsManagerStandardized() {
  // State
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<Date | undefined>(undefined);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Hooks
  const { toast } = useToast();
  const { t } = useTranslation();
  const detailsDialog = useDialog();

  // Data fetching
  const {
    data: transactions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["transactions", search, paymentMethod, dateRange],
    queryFn: async () => {
      const allTransactions = await fetchTransactions();
      return allTransactions.filter(
        (transaction) =>
          (search ? transaction.id.includes(search) : true) &&
          (paymentMethod
            ? transaction.payment_method === paymentMethod
            : true) &&
          (dateRange
            ? new Date(transaction.created_at || "") >= dateRange
            : true),
      );
    },
  });

  // Event handlers
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    detailsDialog.open();
    toast({
      title: t("transactions.detailsTitle"),
      description: t("transactions.detailsDescription", { id: transaction.id }),
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    detailsDialog.open();
    toast({
      title: t("transactions.editTitle"),
      description: t("transactions.editDescription", { id: transaction.id }),
    });
  };

  const handleFiltersChange = (filters: any) => {
    if (filters.search !== undefined) setSearch(filters.search);
    if (filters.provider !== undefined && filters.provider !== "all") {
      setPaymentMethod(filters.provider);
    } else if (filters.provider === "all") {
      setPaymentMethod(null);
    }
    if (filters.date !== undefined) {
      setDateRange(filters.date);
    }
  };

  return (
    <div className="space-y-6">
      <TransactionsHeader
        search={search}
        onSearchChange={setSearch}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onFiltersChange={handleFiltersChange}
      />

      <TransactionsTable
        transactions={transactions || []}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
      />

      <TransactionsDialogsStandardized
        transaction={selectedTransaction}
        open={detailsDialog.isOpen}
        onOpenChange={detailsDialog.onOpenChange}
      />
    </div>
  );
} 