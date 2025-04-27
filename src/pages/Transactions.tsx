import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TransactionsManager } from "@/components/transactions/TransactionsManager";
import { useTranslation } from "react-i18next";

const Transactions = () => {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{t("common.dashboard")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("transactions.title")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-medium">
            {t("transactions.management")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
