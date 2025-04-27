import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/services/transactions";
import { TransactionsTable } from "./TransactionsTable";
import { TransactionsHeader } from "./TransactionsHeader";
import { TransactionsDialogs } from "./TransactionsDialogs";
import { Transaction } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function TransactionsManager() {
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<Date | undefined>(undefined);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ['transactions', search, paymentMethod, dateRange],
    queryFn: async () => {
      const allTransactions = await fetchTransactions();
      return allTransactions.filter(transaction => 
        (search ? transaction.id.includes(search) : true) &&
        (paymentMethod ? transaction.payment_method === paymentMethod : true) &&
        (dateRange ? new Date(transaction.created_at || '') >= dateRange : true)
      );
    }
  });

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    toast({
      title: "Transaction Details",
      description: `Viewing details for transaction ${transaction.id}`,
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    toast({
      title: "Edit Transaction",
      description: `Editing transaction ${transaction.id}`,
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
      
      <TransactionsDialogs 
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
