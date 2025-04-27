import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMediaQuery } from "@/hooks/use-media-query";

// Sample data - this would normally come from your API
const data = [
  { name: "Jan", revenue: 1200000, expenses: 800000 },
  { name: "Feb", revenue: 1500000, expenses: 900000 },
  { name: "Mar", revenue: 1300000, expenses: 750000 },
  { name: "Apr", revenue: 1600000, expenses: 820000 },
  { name: "May", revenue: 1800000, expenses: 880000 },
  { name: "Jun", revenue: 2000000, expenses: 940000 },
];

export function RevenueInsights() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl md:text-2xl font-bold">
          {t("dashboard.revenueInsights")}
        </CardTitle>
        <CardDescription>
          {t("dashboard.revenueInsightsDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] md:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 20,
                left: isMobile ? 0 : 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickMargin={10}
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                width={isMobile ? 40 : 60}
              />
              <Tooltip
                formatter={(value) => `${Number(value).toLocaleString()}֏`}
                labelStyle={{ fontWeight: "bold" }}
                contentStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend iconSize={isMobile ? 8 : 10} />
              <Bar
                name={t("dashboard.revenue")}
                dataKey="revenue"
                fill="#3AA655"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name={t("dashboard.expenses")}
                dataKey="expenses"
                fill="#F6C90E"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
