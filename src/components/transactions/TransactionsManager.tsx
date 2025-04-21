
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@/services/transactions";
import { TransactionsTable } from "./TransactionsTable";
import { TransactionsHeader } from "./TransactionsHeader";
import { TransactionsDialogs } from "./TransactionsDialogs";

export function TransactionsManager() {
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<Date | undefined>(undefined);

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

  return (
    <div className="space-y-6">
      <TransactionsHeader 
        search={search}
        onSearchChange={setSearch}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <TransactionsTable 
        transactions={transactions || []} 
        isLoading={isLoading}
      />
      
      <TransactionsDialogs />
    </div>
  );
}
