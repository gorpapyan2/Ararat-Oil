import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { PageLayout } from "@/layouts/PageLayout";
import { LayoutDashboard } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();
  return (
    <PageLayout
      titleKey="dashboard.title"
      descriptionKey="dashboard.description"
      icon={LayoutDashboard}
    >
      <section aria-label={t('dashboard.keyMetrics')} className="mb-6">
        <DashboardMetrics />
      </section>
      
      <section aria-label={t('dashboard.chartsAndInsights')} className="mb-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <div className="md:col-span-4 lg:col-span-2 xl:col-span-2">
            <ProfitLossChart />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
