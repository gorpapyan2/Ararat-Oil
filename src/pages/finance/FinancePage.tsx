import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinanceManagerStandardized } from "@/features/finance/components/FinanceManagerStandardized";
import { ExpenseManagerStandardized } from "@/features/finance/components/ExpenseManagerStandardized";
import { ProfitLossManagerStandardized } from "@/features/finance/components/ProfitLossManagerStandardized";

export function FinancePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("finance");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("finance.title", "Finance Management")}
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="finance">
            {t("finance.tabs.finance", "Finance")}
          </TabsTrigger>
          <TabsTrigger value="expenses">
            {t("finance.tabs.expenses", "Expenses")}
          </TabsTrigger>
          <TabsTrigger value="profit-loss">
            {t("finance.tabs.profitLoss", "Profit & Loss")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="finance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("finance.finance.title", "Finance Overview")}</CardTitle>
            </CardHeader>
            <CardContent>
              <FinanceManagerStandardized />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("finance.expenses.title", "Expense Management")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseManagerStandardized expenses={[]} isLoading={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit-loss" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("finance.profitLoss.title", "Profit & Loss Analysis")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfitLossManagerStandardized profitLoss={[]} isLoading={false} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 