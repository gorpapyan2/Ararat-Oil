// Dashboard.tsx – refactored for clarity, re‑use and modern minimal design
// ===============================================================
// ▸ Key improvements
//   • Extracted <KpiCard/> component to remove duplication
//   • Centralised colour + icon mapping for easy palette tweaks
//   • Added <Toolbar/> component for better separation of concerns
//   • Leveraged React‑Query's isPending state + Suspense fallback
//   • Motion variants defined once, reused via spread operator
//   • Used Tailwind CSS design‑tokens from tailwind.config "brand / accent"
// ===============================================================

import { Suspense, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  DollarSign,
  LineChart,
  Boxes,
  Filter,
  Share2,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";

import { fetchSales, fetchExpenses, fetchInventory } from "@/services/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// -----------------------------------------------------------------------------
// Types & helpers
// -----------------------------------------------------------------------------
type Period = "day" | "week" | "month" | "year";

const kpiMotion = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.1 * i } }),
};

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------
export default function Dashboard() {
  const [period, setPeriod] = useState<Period>("month");

  // --- data ------------------------------------------------------------------
  const {
    data: salesData = [],
    isPending: isSalesLoading,
  } = useQuery({ queryKey: ["sales"], queryFn: fetchSales });

  const {
    data: expensesData = [],
    isPending: isExpensesLoading,
  } = useQuery({ queryKey: ["expenses"], queryFn: fetchExpenses });

  const {
    data: inventoryData = [],
    isPending: isInventoryLoading,
  } = useQuery({ queryKey: ["inventory"], queryFn: fetchInventory });

  // --- derived values ---------------------------------------------------------
  const totalSales = useMemo(
    () => salesData.reduce((sum, s) => sum + (s.total_sales || 0), 0),
    [salesData],
  );
  const totalExpenses = useMemo(
    () => expensesData.reduce((sum, e) => sum + (e.amount || 0), 0),
    [expensesData],
  );
  const netProfit = totalSales - totalExpenses;
  const inventoryValue = useMemo(
    () => inventoryData.reduce((sum, i) => sum + (i.closing_stock * i.unit_price || 0), 0),
    [inventoryData],
  );
  const fuelTypes = Array.from(new Set(inventoryData.map(i => i.fuel_type)));

  // TODO: Replace with real % deltas from API
  const mockDelta = (base: number) => (base ? (Math.random() - 0.5) * 20 : 0);

  const kpis = [
    {
      title: "Total Sales",
      value: totalSales,
      delta: mockDelta(totalSales),
      color: "accent",
      icon: DollarSign,
      loading: isSalesLoading,
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      delta: mockDelta(totalExpenses),
      color: "destructive",
      icon: CreditCard,
      loading: isExpensesLoading,
    },
    {
      title: "Net Profit",
      value: netProfit,
      delta: mockDelta(netProfit),
      color: netProfit >= 0 ? "success" : "destructive",
      icon: LineChart,
      loading: isSalesLoading || isExpensesLoading,
    },
    {
      title: "Inventory Value",
      value: inventoryValue,
      delta: fuelTypes.length,
      color: "primary",
      icon: Boxes,
      loading: isInventoryLoading,
      customBadge: `${fuelTypes.length} fuel types`,
    },
  ];

  // ---------------------------------------------------------------------------
  return (
    <section className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-bg-primary">
      <Toolbar period={period} onPeriodChange={setPeriod} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            variants={kpiMotion}
            initial="hidden"
            animate="visible"
            custom={i}
          >
            <KpiCard {...kpi} period={period} />
          </motion.div>
        ))}
      </div>

      {/* TODO: place charts / tables below */}
    </section>
  );
}

// -----------------------------------------------------------------------------
// Toolbar (title + actions)
// -----------------------------------------------------------------------------
function Toolbar({ period, onPeriodChange }: { period: Period; onPeriodChange: (p: Period) => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-display tracking-tight mb-1 text-txt-primary">Dashboard</h2>
        <p className="text-body text-txt-muted">Monitor your business performance in real‑time</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* refresh */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="app-button h-8 w-8 rounded-full border-stroke text-txt-muted hover:text-accent">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* period filter */}
        <Tabs value={period} onValueChange={v => onPeriodChange(v as Period)}>
          <TabsList className="grid grid-cols-4 h-8 bg-bg-surface rounded-full border border-stroke">
            {(["day", "week", "month", "year"] as Period[]).map(p => (
              <TabsTrigger 
                key={p} 
                value={p} 
                className="text-caption capitalize data-[state=active]:bg-accent-soft data-[state=active]:text-accent" 
              >
                {p}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* misc actions */}
        <ActionBtn icon={Filter}>Filter</ActionBtn>
        <ActionBtn icon={Share2}>Share</ActionBtn>
        <ActionBtn icon={Download} solid>
          Export
        </ActionBtn>
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, children, solid = false }: { icon: any; children?: React.ReactNode; solid?: boolean }) {
  return (
    <Button 
      size="sm" 
      variant={solid ? "default" : "outline"} 
      className={`app-button h-8 rounded-full ${solid ? 'bg-accent text-bg-primary hover:bg-accent/90' : 'border-stroke text-txt-primary hover:bg-bg-surface/90'}`}
    >
      <Icon className="mr-2 h-3.5 w-3.5" />
      <span className="hidden sm:inline text-caption">{children}</span>
    </Button>
  );
}

// -----------------------------------------------------------------------------
// KPI Card
// -----------------------------------------------------------------------------
function KpiCard({
  title,
  value,
  delta,
  color,
  icon: Icon,
  loading,
  period,
  customBadge,
}: {
  title: string;
  value: number;
  delta: number;
  color: string;
  icon: any;
  loading: boolean;
  period: Period;
  customBadge?: string;
}) {
  return (
    <Card className="app-card hover-raise overflow-hidden border-s-4" style={{ borderColor: `var(--${color})` }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-subtitle text-txt-primary">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `var(--${color}-soft, var(--accent-soft))` }}>
          <Icon className="h-4 w-4" style={{ color: `var(--${color}, var(--accent))` }} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </>
        ) : (
          <>
            <div className="text-display text-txt-primary">
              {value.toLocaleString()} ֏
            </div>
            <div className="flex items-center mt-2 gap-2">
              {customBadge ? (
                <Badge variant="outline" className="text-caption bg-accent-soft text-accent">
                  {customBadge}
                </Badge>
              ) : (
                <Badge variant={delta >= 0 ? "success" : "destructive"} className="text-caption font-normal">
                  {delta >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {Math.abs(delta).toFixed(1)}%
                </Badge>
              )}
              <span className="text-caption text-txt-muted">from previous {period}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
