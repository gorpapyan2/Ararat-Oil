import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/core/components/ui/button";
import { ExpenseDialogStandardized } from "./ExpenseDialogStandardized";
import { useFinance } from "../hooks/useFinance";
import type { Expense } from "../types/finance.types";

interface ExpenseManagerStandardizedProps {
  expenses: Expense[];
  isLoading: boolean;
}

export function ExpenseManagerStandardized({
  expenses,
  isLoading,
}: ExpenseManagerStandardizedProps) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedExpense(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {t("finance.expenses.title", "Expenses")}
        </h2>
        <Button onClick={handleCreate}>
          {t("finance.expenses.create", "Create New")}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          {t("common.loading", "Loading...")}
        </div>
      ) : (
        <div className="grid gap-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
              onClick={() => handleEdit(expense)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{expense.description}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("finance.expenses.category", "Category")}:{" "}
                    {expense.category}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("finance.expenses.date", "Date")}:{" "}
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {t("finance.expenses.amount", "Amount")}: {expense.amount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ExpenseDialogStandardized
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        expense={selectedExpense}
      />
    </div>
  );
}
