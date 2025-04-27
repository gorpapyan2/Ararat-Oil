import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useMediaQuery } from "@/hooks/use-media-query";

// Sample data - this would come from your API
const data = [
  { name: "Gasoline", value: 45 },
  { name: "Diesel", value: 30 },
  { name: "Premium", value: 15 },
  { name: "Natural Gas", value: 10 },
];

// Colors for the pie chart segments
const COLORS = ["#3AA655", "#F6C90E", "#3E7CB1", "#F17300"];

export function FuelDistributionChart() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl md:text-2xl font-bold">
          {t("dashboard.fuelDistribution")}
        </CardTitle>
        <CardDescription>
          {t("dashboard.fuelDistributionDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] md:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  isMobile
                    ? `${(percent * 100).toFixed(0)}%`
                    : `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={isMobile ? 80 : 100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend
                layout={isMobile ? "horizontal" : "vertical"}
                verticalAlign={isMobile ? "bottom" : "middle"}
                align={isMobile ? "center" : "right"}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
