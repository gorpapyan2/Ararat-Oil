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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ProfitLossData {
  period: string;
  profit: number;
  loss: number;
}

export function ProfitLossChart() {
  const { t } = useTranslation();

  // Mock data - replace with actual data from API
  const data: ProfitLossData[] = [
    { period: "Jan", profit: 4000, loss: 2400 },
    { period: "Feb", profit: 3000, loss: 1398 },
    { period: "Mar", profit: 2000, loss: 9800 },
    { period: "Apr", profit: 2780, loss: 3908 },
    { period: "May", profit: 1890, loss: 4800 },
    { period: "Jun", profit: 2390, loss: 3800 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.profitLoss")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="profit" fill="#10b981" name={t("dashboard.profit")} />
            <Bar dataKey="loss" fill="#ef4444" name={t("dashboard.loss")} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 