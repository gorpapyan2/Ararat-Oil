
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchProfitLoss } from "@/services/financials";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ProfitLossChart() {
  const { data: profitLossData, isLoading } = useQuery({
    queryKey: ['profit-loss'],
    queryFn: fetchProfitLoss,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Profit/Loss Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={profitLossData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A7D129" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#A7D129" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.split('-')[1]}
              className="text-sm"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toLocaleString()}֏`}
              className="text-sm"
            />
            <Tooltip content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Period
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].payload.period}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Profit
                        </span>
                        <span className="font-bold">
                          {payload[0].value?.toLocaleString()}֏
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#A7D129"
            fill="url(#profit)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
  );
}
