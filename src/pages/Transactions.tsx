import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { TransactionsManagerStandardized } from "@/components/transactions/TransactionsManagerStandardized";
import { useTranslation } from "react-i18next";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

const Transactions = () => {
  const { t } = useTranslation();
  
  // Configure breadcrumb navigation
  const breadcrumbSegments = [
    { name: t("common.dashboard"), href: "/" },
    { name: t("transactions.title"), href: "/transactions", isCurrent: true }
  ];

  usePageBreadcrumbs({
    segments: [
      { name: "Dashboard", href: "/" },
      { name: "Transactions", href: "/transactions", isCurrent: true }
    ],
    title: "Transactions"
  });

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <Breadcrumb segments={breadcrumbSegments} />

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-medium">
            {t("transactions.management")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsManagerStandardized />
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
