import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/primitives/card";
import { FinanceManagerStandardized } from "@/features/finance/components/FinanceManagerStandardized";
import { ExpenseManagerStandardized } from "@/features/finance/components/ExpenseManagerStandardized";
import { ProfitLossManagerStandardized } from "@/features/finance/components/ProfitLossManagerStandardized";
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

export function FinancePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("finance");

  // Set up breadcrumbs
  const breadcrumbSegments = [
    { name: t("common.dashboard"), href: "/" },
    { name: t("finance.title"), href: "/finance", isCurrent: true }
  ];

  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: "Finance"
  });

  // Get translated page title and tab titles using the API translation helpers
  const pageTitle = t("finance.title") || getApiActionLabel(apiNamespaces.finances, 'list');
  const financeTabTitle = t("finance.tabs.finance") || "Finance";
  const expensesTabTitle = t("finance.tabs.expenses") || "Expenses";
  const profitLossTabTitle = t("finance.tabs.profitLoss") || "Profit & Loss";
  
  // Get translated section titles
  const financeOverviewTitle = t("finance.finance.title") || "Finance Overview";
  const expenseManagementTitle = t("finance.expenses.title") || "Expense Management";
  const profitLossTitle = t("finance.profitLoss.title") || "Profit & Loss Analysis";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {pageTitle}
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="finance">
            {financeTabTitle}
          </TabsTrigger>
          <TabsTrigger value="expenses">
            {expensesTabTitle}
          </TabsTrigger>
          <TabsTrigger value="profit-loss">
            {profitLossTabTitle}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="finance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{financeOverviewTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <FinanceManagerStandardized />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{expenseManagementTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseManagerStandardized expenses={[]} isLoading={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit-loss" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{profitLossTitle}</CardTitle>
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