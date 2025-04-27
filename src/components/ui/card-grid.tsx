import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-muted-foreground",
  className,
}: MetricCardProps) {
  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className={`h-4 w-4 ${iconColor}`} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface CardGridProps {
  metrics: MetricCardProps[];
  className?: string;
}

export function CardGrid({ metrics, className = "" }: CardGridProps) {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Horizontally scrollable cards for mobile */}
      <div
        className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        aria-label="Metrics summary"
      >
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="min-w-[260px] w-[85vw] sm:w-[45vw] md:w-1/2 lg:w-1/4 flex-none snap-start"
          >
            <MetricCard {...metric} />
          </div>
        ))}
      </div>

      {/* Hidden grid for desktop layout, used for positioning */}
      <div
        className={`hidden lg:grid lg:grid-cols-${Math.min(metrics.length, 4)} gap-4 absolute inset-0 -z-10`}
      >
        {metrics.map((_, i) => (
          <div
            key={i}
            className="opacity-0 pointer-events-none"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Scroll indicators for mobile */}
      {metrics.length > 1 && (
        <div className="flex justify-center gap-1 mt-2 md:hidden">
          {metrics.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-300 scroll-indicator"
              aria-hidden="true"
            />
          ))}
        </div>
      )}
    </div>
  );
}
