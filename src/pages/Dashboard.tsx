
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4">
        <DashboardMetrics />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <ProfitLossChart />
        </div>
      </div>
    </div>
  );
}
