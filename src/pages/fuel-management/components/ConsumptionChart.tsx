import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConsumptionChartProps {
  data: Array<{
    date: string;
    quantity: number;
    cost: number;
  }>;
}

export default function ConsumptionChart({ data }: ConsumptionChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
        <Line type="monotone" dataKey="cost" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
} 