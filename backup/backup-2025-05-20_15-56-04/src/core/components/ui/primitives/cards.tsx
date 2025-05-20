import React from "react";
import { cn } from "@/shared/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/primitives/card";
import { Button } from "@/core/components/ui/primitives/button";
import { ArrowRightIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

/**
 * Simple stat card for displaying metrics
 */
export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    direction: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  className,
}) => {
  const directionClasses = {
    up: "text-green-600 dark:text-green-400",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle size="sm">{title}</CardTitle>
          {icon && <div className="text-muted-foreground/60">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {change && (
          <div
            className={cn("mt-1 text-sm", directionClasses[change.direction])}
          >
            {change.direction === "up" && "↑ "}
            {change.direction === "down" && "↓ "}
            {change.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Metric card with trend data and loading state
 */
export interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    positive?: boolean;
    label?: string;
  };
  loading?: boolean;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  loading = false,
  footer,
  className,
  onClick,
}) => {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300",
        onClick && "cursor-pointer hover:shadow-md hover:scale-[1.01]",
        loading && "animate-pulse",
        className,
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 flex justify-between items-start">
        <div>
          <CardTitle size="sm" className="line-clamp-1">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="line-clamp-1 mt-1">
              {description}
            </CardDescription>
          )}
        </div>
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-2">
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="h-8 w-24 bg-muted rounded animate-pulse" />
          ) : (
            value
          )}
        </div>

        {trend && (
          <div
            className={cn(
              "flex items-center mt-1 text-sm font-medium",
              trend.positive
                ? "text-green-600 dark:text-green-500"
                : "text-red-600 dark:text-red-500",
            )}
          >
            {trend.positive ? (
              <TrendingUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDownIcon className="w-4 h-4 mr-1" />
            )}
            <span>{trend.value}</span>
            {trend.label && (
              <span className="text-muted-foreground ml-1">
                ({trend.label})
              </span>
            )}
          </div>
        )}
      </CardContent>

      {footer && <CardFooter className="pt-2">{footer}</CardFooter>}
    </Card>
  );
};

/**
 * Action card with colored status
 */
export interface ActionCardProps {
  title: string;
  description?: string;
  status?: "success" | "warning" | "error" | "info" | "muted";
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  status = "muted",
  actionLabel = "View details",
  onAction,
  icon,
  className,
}) => {
  // Status indicator colors
  const statusColors = {
    success: "bg-green-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    muted: "bg-muted-foreground",
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {status && (
              <div
                className={cn(
                  "w-2 h-2 rounded-full mr-2",
                  statusColors[status],
                )}
              />
            )}
            <CardTitle size="sm">{title}</CardTitle>
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        {description && (
          <CardDescription className="mt-1 text-sm line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      {onAction && (
        <CardFooter>
          <Button
            variant="ghost"
            className="p-0 h-auto text-sm font-medium"
            onClick={onAction}
          >
            {actionLabel}
            <ArrowRightIcon className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

/**
 * Summary card for dashboard overview sections
 */
export interface SummaryCardProps {
  title: string;
  metrics: Array<{
    label: string;
    value: string | number;
    color?: "default" | "muted" | "success" | "warning" | "danger";
  }>;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  metrics,
  action,
  className,
}) => {
  const colorVariants = {
    default: "text-foreground",
    muted: "text-muted-foreground",
    success: "text-green-600 dark:text-green-500",
    warning: "text-amber-600 dark:text-amber-500",
    danger: "text-red-600 dark:text-red-500",
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle size="sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          {metrics.map((metric, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {metric.label}
              </span>
              <span
                className={cn(
                  "font-medium",
                  metric.color
                    ? colorVariants[metric.color]
                    : colorVariants.default,
                )}
              >
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      {action && (
        <CardFooter align="end">
          <Button
            variant="ghost"
            size="sm"
            onClick={action.onClick}
            className="h-8 text-xs"
          >
            {action.label}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

/**
 * Grid of metric cards
 */
export interface CardGridProps {
  metrics: Array<MetricCardProps>;
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({ 
  metrics, 
  className = "" 
}) => {
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
}; 