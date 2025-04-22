
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { CashRegisterPanel } from "@/components/CashRegisterPanel";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardMetrics />
        <CashRegisterPanel />
      </div>
    </div>
  );
}
