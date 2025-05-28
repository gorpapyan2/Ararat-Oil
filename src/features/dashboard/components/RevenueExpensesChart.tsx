import React from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface RevenueExpensesData {
  period: string;
  revenue: number;
  expenses: number;
}

export function RevenueExpensesChart() {
  const { t } = useTranslation();

  // Mock data - replace with actual data from API
  const data: RevenueExpensesData[] = [
    { period: "Jan", revenue: 6400, expenses: 2400 },
    { period: "Feb", revenue: 4398, expenses: 1398 },
    { period: "Mar", revenue: 11800, expenses: 9800 },
    { period: "Apr", revenue: 6688, expenses: 3908 },
    { period: "May", revenue: 6690, expenses: 4800 },
    { period: "Jun", revenue: 6190, expenses: 3800 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.revenueExpenses")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name={t("dashboard.revenue")}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={2}
              name={t("dashboard.expenses")}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 