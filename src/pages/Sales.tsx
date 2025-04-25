import { SalesManager } from "@/components/sales/SalesManager";
import { PageLayout } from "@/layouts/PageLayout";
import { Receipt } from "lucide-react";

const Sales = () => {
  return (
    <PageLayout
      title="Sales"
      description="View and manage fuel sales records"
      icon={Receipt}
    >
      <SalesManager />
    </PageLayout>
  );
};

export default Sales;
