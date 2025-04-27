import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchSales } from '@/services/sales';
import { fetchExpenses } from '@/services/expenses';
import { subMonths, format } from 'date-fns';

export function RevenueExpensesChart() {
  const { data: sales = [] } = useQuery({
    queryKey: ['sales'],
    queryFn: fetchSales,
    retry: 1,
  });
  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
    retry: 1,
  });

  const chartData = useMemo(() => {
    const months = Array.from({ length: 6 }).map((_, idx) => {
      const date = subMonths(new Date(), 5 - idx);
      return format(date, 'MMM yyyy');
    });

    const salesMap = sales.reduce((acc: Record<string, number>, sale) => {
      const month = format(new Date(sale.date), 'MMM yyyy');
      acc[month] = (acc[month] || 0) + sale.total_sales;
      return acc;
    }, {});

    const expensesMap = expenses.reduce((acc: Record<string, number>, exp) => {
      const month = format(new Date(exp.date), 'MMM yyyy');
      acc[month] = (acc[month] || 0) + exp.amount;
      return acc;
    }, {});

    return months.map((month) => ({
      month,
      revenue: salesMap[month] || 0,
      expenses: expensesMap[month] || 0,
    }));
  }, [sales, expenses]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => new Intl.NumberFormat().format(Number(value))} />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#616F39" name="Revenue" activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="expenses" stroke="#A7D129" name="Expenses" />
      </LineChart>
    </ResponsiveContainer>
  );
}
