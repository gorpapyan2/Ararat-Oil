import React from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  TooltipProps
} from "recharts";
import { GradientCard } from "@/components/ui/gradient-card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ChartType = "area" | "line" | "bar";

interface GradientChartProps {
  data: any[];
  type?: ChartType;
  title?: string;
  description?: string;
  xAxisDataKey?: string;
  series: {
    dataKey: string;
    name?: string;
    color?: string;
    gradientFrom?: string;
    gradientTo?: string;
    strokeWidth?: number;
  }[];
  height?: number;
  width?: string | number;
  grid?: boolean;
  legend?: boolean;
  aspectRatio?: number;
  animate?: boolean;
  autoColors?: boolean;
  animated?: boolean;
  gradient?: "primary" | "accent" | "error" | "brand" | "subtle" | "none";
  border?: "accent" | "error" | "brand" | "primary" | "default" | "none";
  tooltipFormatter?: (value: number) => string;
  className?: string;
}

const defaultColors = [
  { main: "#A7D129", from: "#C5E14F", to: "#7C9D1E" }, // Green
  { main: "#616F39", from: "#798556", to: "#3D4925" }, // Olive
  { main: "#3E432E", from: "#556044", to: "#2D3022" }, // Dark Olive
  { main: "#4C72B0", from: "#6A8FC9", to: "#305694" }, // Blue
  { main: "#DB5461", from: "#EF7A85", to: "#C7383D" }, // Red
  { main: "#A45C9F", from: "#C178BB", to: "#874883" }, // Purple
  { main: "#FF9E43", from: "#FFC069", to: "#DD7B1F" }, // Orange
];

const CustomTooltip = ({ 
  active, 
  payload, 
  label,
  formatter
}: TooltipProps<number, string> & { formatter?: (value: number) => string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-xs mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-item-${index}`} className="flex items-center gap-2 my-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm text-foreground">
              <span className="font-medium">{entry.name || entry.dataKey}: </span>
              <span>{formatter ? formatter(entry.value as number) : entry.value}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const GradientChart: React.FC<GradientChartProps> = ({
  data,
  type = "area",
  title,
  description,
  xAxisDataKey = "name",
  series,
  height = 300,
  width = "100%",
  grid = true,
  legend = false,
  aspectRatio,
  autoColors = true,
  animated = true,
  gradient = "subtle",
  border = "default",
  tooltipFormatter,
  className,
}) => {
  // Assign colors to series if not provided
  const seriesWithColors = series.map((item, index) => {
    if (item.color) return item;
    const colorSet = defaultColors[index % defaultColors.length];
    return {
      ...item,
      color: colorSet.main,
      gradientFrom: item.gradientFrom || colorSet.from,
      gradientTo: item.gradientTo || colorSet.to,
    };
  });

  const renderChart = () => {
    const commonProps = {
      data,
      // Remove width from commonProps as it's handled by ResponsiveContainer
      height: height,
    };

    const gradientIds = seriesWithColors.map((s, i) => `color-${s.dataKey}-${i}`);

    switch (type) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            {grid && <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />}
            <XAxis 
              dataKey={xAxisDataKey} 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#888", opacity: 0.2 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#888", opacity: 0.2 }}
            />
            <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
            {legend && <Legend />}
            <defs>
              {seriesWithColors.map((s, i) => (
                <linearGradient key={i} id={gradientIds[i]} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.gradientFrom} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={s.gradientTo} stopOpacity={0.2} />
                </linearGradient>
              ))}
            </defs>
            {seriesWithColors.map((s, i) => (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                stroke={s.color}
                fill={`url(#${gradientIds[i]})`}
                strokeWidth={s.strokeWidth || 2}
                activeDot={{ r: 6, strokeWidth: 1, stroke: "#fff" }}
              />
            ))}
          </AreaChart>
        );
      
      case "line":
        return (
          <LineChart {...commonProps}>
            {grid && <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />}
            <XAxis 
              dataKey={xAxisDataKey} 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#888", opacity: 0.2 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#888", opacity: 0.2 }}
            />
            <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
            {legend && <Legend />}
            {seriesWithColors.map((s) => (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                stroke={s.color}
                strokeWidth={s.strokeWidth || 2}
                dot={{ fill: s.color, r: 4, strokeWidth: 1, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 1, stroke: "#fff" }}
              />
            ))}
          </LineChart>
        );
      
      case "bar":
        return (
          <BarChart {...commonProps}>
            {grid && <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />}
            <XAxis 
              dataKey={xAxisDataKey} 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#888", opacity: 0.2 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#888", opacity: 0.2 }}
            />
            <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
            {legend && <Legend />}
            <defs>
              {seriesWithColors.map((s, i) => (
                <linearGradient key={i} id={gradientIds[i]} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.gradientFrom} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={s.gradientTo} stopOpacity={0.2} />
                </linearGradient>
              ))}
            </defs>
            {seriesWithColors.map((s, i) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                fill={`url(#${gradientIds[i]})`}
                stroke={s.color}
                strokeWidth={1}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      default:
        return <div>Invalid chart type</div>;
    }
  };

  const chartContent = (
    <>
      {(title || description) && (
        <CardHeader className="pb-2">
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn("pt-0", !title && !description && "pt-6")}>
        <ResponsiveContainer width="100%" height={height} aspect={aspectRatio}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </>
  );

  // If animated, wrap content in motion.div
  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className={className}
      >
        <GradientCard 
          gradient={gradient} 
          border={border}
          animation="hover"
          className="overflow-hidden"
        >
          {chartContent}
        </GradientCard>
      </motion.div>
    );
  }

  // Otherwise return without animation
  return (
    <GradientCard 
      gradient={gradient} 
      border={border}
      animation="hover"
      className={cn("overflow-hidden", className)}
    >
      {chartContent}
    </GradientCard>
  );
};

export default GradientChart;
