import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TransactionDialogStandardized } from "@/components/finance/TransactionDialogStandardized";
import { fetchTransactions, deleteTransaction } from "@/services/transactions";
import { Transaction } from "@/types";

export function FinanceManagerStandardized() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Fetch transactions
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  // Delete transaction mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success(t("finance.transactions.deleteSuccess", "Transaction deleted successfully"));
    },
    onError: (error) => {
      toast.error(t("finance.transactions.deleteError", "Failed to delete transaction"));
      console.error("Error deleting transaction:", error);
    },
  });

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      transaction.description?.toLowerCase().includes(searchLower) ||
      transaction.payment_method?.toLowerCase().includes(searchLower) ||
      transaction.payment_status.toLowerCase().includes(searchLower)
    );
  });

  // Handle transaction actions
  const handleEdit = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm(t("finance.transactions.confirmDelete", "Are you sure you want to delete this transaction?"))) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation, t]);

  const handleCreate = useCallback(() => {
    setSelectedTransaction(null);
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedTransaction(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("finance.transactions.search", "Search transactions...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t("finance.transactions.add", "Add Transaction")}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("finance.transactions.date", "Date")}</TableHead>
              <TableHead>{t("finance.transactions.description", "Description")}</TableHead>
              <TableHead>{t("finance.transactions.amount", "Amount")}</TableHead>
              <TableHead>{t("finance.transactions.paymentMethod", "Payment Method")}</TableHead>
              <TableHead>{t("finance.transactions.status", "Status")}</TableHead>
              <TableHead className="text-right">{t("common.actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {t("common.loading", "Loading...")}
                </TableCell>
              </TableRow>
            ) : filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {t("finance.transactions.noTransactions", "No transactions found")}
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.created_at || ""), "PP")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.amount.toFixed(2)} ֏</TableCell>
                  <TableCell>{transaction.payment_method}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.payment_status === "completed"
                          ? "success"
                          : transaction.payment_status === "pending"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {transaction.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(transaction)}
                    >
                      {t("common.edit", "Edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      {t("common.delete", "Delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TransactionDialogStandardized
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        transaction={selectedTransaction}
      />
    </div>
  );
} 