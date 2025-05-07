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
import { ExpenseDialogStandardized } from "@/components/finance/ExpenseDialogStandardized";
import { fetchExpenses, deleteExpense } from "@/services/expenses";
import { Expense } from "@/types";

export function ExpenseManagerStandardized() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Fetch expenses
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });

  // Delete expense mutation
  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success(t("finance.expenses.deleteSuccess", "Expense deleted successfully"));
    },
    onError: (error) => {
      toast.error(t("finance.expenses.deleteError", "Failed to delete expense"));
      console.error("Error deleting expense:", error);
    },
  });

  // Filter expenses based on search query
  const filteredExpenses = expenses.filter((expense) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      expense.description.toLowerCase().includes(searchLower) ||
      expense.category.toLowerCase().includes(searchLower) ||
      expense.payment_status.toLowerCase().includes(searchLower)
    );
  });

  // Handle expense actions
  const handleEdit = useCallback((expense: Expense) => {
    setSelectedExpense(expense);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm(t("finance.expenses.confirmDelete", "Are you sure you want to delete this expense?"))) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation, t]);

  const handleCreate = useCallback(() => {
    setSelectedExpense(null);
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedExpense(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("finance.expenses.search", "Search expenses...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t("finance.expenses.add", "Add Expense")}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("finance.expenses.date", "Date")}</TableHead>
              <TableHead>{t("finance.expenses.description", "Description")}</TableHead>
              <TableHead>{t("finance.expenses.category", "Category")}</TableHead>
              <TableHead>{t("finance.expenses.amount", "Amount")}</TableHead>
              <TableHead>{t("finance.expenses.status", "Status")}</TableHead>
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
            ) : filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {t("finance.expenses.noExpenses", "No expenses found")}
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    {format(new Date(expense.date), "PP")}
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{expense.amount.toFixed(2)} ֏</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        expense.payment_status === "completed"
                          ? "success"
                          : expense.payment_status === "pending"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {expense.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(expense)}
                    >
                      {t("common.edit", "Edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
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

      <ExpenseDialogStandardized
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        expense={selectedExpense}
      />
    </div>
  );
} 