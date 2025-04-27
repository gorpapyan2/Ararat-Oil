import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { RevenueInsights } from "@/components/dashboard/RevenueInsights";
import { FuelDistributionChart } from "@/components/dashboard/FuelDistributionChart";
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
      <section aria-label={t("dashboard.keyMetrics")} className="mb-6">
        <DashboardMetrics />
      </section>

      <section aria-label={t("dashboard.chartsAndInsights")} className="mb-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-2 lg:col-span-2">
            <ProfitLossChart />
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <RevenueInsights />
          </div>
        </div>
      </section>

      <section aria-label={t("dashboard.additionalInsights")} className="mb-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-1 lg:col-span-1">
            <FuelDistributionChart />
          </div>
          <div className="md:col-span-1 lg:col-span-3">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 h-full">
              {/* These will be implemented later as separate components */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-center items-center"
                >
                  <div className="font-semibold">Quick Access {i}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
