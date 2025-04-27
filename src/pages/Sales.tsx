import { SalesManager } from "@/components/sales/SalesManager";
import { PageLayout } from "@/layouts/PageLayout";
import { Receipt } from "lucide-react";

const Sales = () => {
  return (
    <PageLayout
      titleKey="sales.title"
      descriptionKey="sales.description"
      icon={Receipt}
    >
      <SalesManager />
    </PageLayout>
  );
};

export default Sales;
