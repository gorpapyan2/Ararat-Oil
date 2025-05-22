import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { TransactionDialogStandardized } from "./TransactionDialogStandardized";
import { ExpenseManagerStandardized } from "./ExpenseManagerStandardized";
import { ProfitLossManagerStandardized } from "./ProfitLossManagerStandardized";
import { useFinance } from "../hooks/useFinance";
import type { Transaction } from "../types/finance.types";

export function FinanceManagerStandardized() {
  const { t } = useTranslation();
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const {
    transactions,
    isLoadingTransactions,
    expenses,
    isLoadingExpenses,
    profitLoss,
    isLoadingProfitLoss,
  } = useFinance();

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionDialogOpen(true);
  };

  const handleCreateTransaction = () => {
    setSelectedTransaction(null);
    setIsTransactionDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">
        {t("finance.title", "Finance Management")}
      </h1>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">
            {t("finance.transactions.title", "Transactions")}
          </TabsTrigger>
          <TabsTrigger value="expenses">
            {t("finance.expenses.title", "Expenses")}
          </TabsTrigger>
          <TabsTrigger value="profit-loss">
            {t("finance.profitLoss.title", "Profit & Loss")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {t("finance.transactions.title", "Transactions")}
            </h2>
            <button
              onClick={handleCreateTransaction}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {t("finance.transactions.create", "Create New")}
            </button>
          </div>

          {isLoadingTransactions ? (
            <div className="text-center py-4">
              {t("common.loading", "Loading...")}
            </div>
          ) : (
            <div className="grid gap-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleEditTransaction(transaction)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{transaction.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t("finance.transactions.paymentMethod", "Payment Method")}: {transaction.payment_method}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("finance.transactions.paymentStatus", "Payment Status")}: {transaction.payment_status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {t("finance.transactions.amount", "Amount")}: {transaction.amount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseManagerStandardized
            expenses={expenses}
            isLoading={isLoadingExpenses}
          />
        </TabsContent>

        <TabsContent value="profit-loss">
          <ProfitLossManagerStandardized
            profitLoss={profitLoss}
            isLoading={isLoadingProfitLoss}
          />
        </TabsContent>
      </Tabs>

      <TransactionDialogStandardized
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
        transaction={selectedTransaction}
      />
    </div>
  );
} 