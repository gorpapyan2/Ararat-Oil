import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Rectangle,
} from 'recharts';
import { salesApi, expensesApi } from '@/core/api';
import { useTheme } from '@/hooks/useTheme';
import { subMonths, format } from 'date-fns';

export default function RevenueExpensesChart() {
  // Get sales data for last 6 months
  const salesQuery = useQuery({
    queryKey: ['sales-monthly'],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = subMonths(endDate, 6);
      const response = await salesApi.getAll({ 
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd')
      });
      return response.data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Get expenses data for last 6 months
  const expensesQuery = useQuery({
    queryKey: ['expenses-monthly'],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = subMonths(endDate, 6);
      const response = await expensesApi.getAll({ 
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd')
      });
      return response.data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const chartData = useMemo(() => {
    const months = Array.from({ length: 6 }).map((_, idx) => {
      const date = subMonths(new Date(), 5 - idx);
      return format(date, 'MMM yyyy');
    });

    const salesMap = salesQuery.data?.reduce((acc: Record<string, number>, sale) => {
      const month = format(new Date(sale.created_at), 'MMM yyyy');
      acc[month] = (acc[month] || 0) + sale.total_price;
      return acc;
    }, {}) || {};

    const expensesMap = expensesQuery.data?.reduce((acc: Record<string, number>, exp) => {
      const month = format(new Date(exp.created_at), 'MMM yyyy');
      acc[month] = (acc[month] || 0) + exp.amount;
      return acc;
    }, {}) || {};

    return months.map((month) => ({
      month,
      revenue: salesMap[month] || 0,
      expenses: expensesMap[month] || 0,
    }));
  }, [salesQuery.data, expensesQuery.data]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => new Intl.NumberFormat().format(Number(value))} />
        <Legend />
        <Bar type="monotone" dataKey="revenue" fill="#616F39" name="Revenue" />
        <Bar type="monotone" dataKey="expenses" fill="#A7D129" name="Expenses" />
      </BarChart>
    </ResponsiveContainer>
  );
}
