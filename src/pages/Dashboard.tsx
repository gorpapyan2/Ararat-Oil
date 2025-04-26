import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { PageLayout } from "@/layouts/PageLayout";
import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  return (
    <PageLayout
      titleKey="dashboard.title"
      descriptionKey="dashboard.description"
      icon={LayoutDashboard}
    >
      <section aria-label="Key metrics" className="mb-6">
        <DashboardMetrics />
      </section>
      
      <section aria-label="Charts and insights" className="mb-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <div className="md:col-span-4 lg:col-span-2 xl:col-span-2">
            <ProfitLossChart />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
