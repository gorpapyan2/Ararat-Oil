/**
 * @deprecated Use components from @/core/components/ui/cards instead.
 * This file is kept for backward compatibility and will be removed in a future release.
 * Please update your imports to use the new card component system.
 */

import { cn } from "@/shared/utils";
import * as React from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from "@/core/components/ui/card";

// Re-export card components
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
};

// @deprecated - Use MetricCard from @/core/components/ui/cards
export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trending?: string;
  trendingUp?: boolean;
}

// @deprecated - Use MetricCard from @/core/components/ui/cards
export const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, title, value, description, icon, trending, trendingUp, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn("flex flex-col", className)}
      {...props}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trending && (
          <p className={cn("text-xs", trendingUp ? "text-green-600" : "text-red-600")}>
            {trending}
          </p>
        )}
      </CardContent>
    </Card>
  )
);
StatsCard.displayName = "StatsCard";

// @deprecated - Use MetricCard from @/core/components/ui/cards
export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  metric: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  actions?: React.ReactNode;
}

// @deprecated - Use MetricCard from @/core/components/ui/cards
export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, title, metric, subtext, icon, trend, actions, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn("flex flex-col", className)}
      {...props}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold">{metric}</div>
        {subtext && (
          <p className="text-xs text-muted-foreground">{subtext}</p>
        )}
        {trend && (
          <p className={cn("text-xs", trend.positive ? "text-green-600" : "text-red-600")}>
            {trend.value}
          </p>
        )}
      </CardContent>
      {actions && (
        <CardFooter className="flex justify-end">
          {actions}
        </CardFooter>
      )}
    </Card>
  )
);
MetricCard.displayName = "MetricCard";

// @deprecated - Use ActionCard from @/core/components/ui/cards
export interface ActionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: "default" | "warning" | "error" | "success";
  action?: React.ReactNode;
}

// @deprecated - Use ActionCard from @/core/components/ui/cards
export const ActionCard = React.forwardRef<HTMLDivElement, ActionCardProps>(
  ({ className, title, description, icon, status, action, ...props }, ref) => {
    const statusColors = {
      default: "",
      warning: "border-orange-500",
      error: "border-red-500",
      success: "border-green-500",
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "flex flex-col",
          status && status !== "default" && `border-l-4 ${statusColors[status]}`,
          className
        )}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            {icon && <span>{icon}</span>}
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
        </CardHeader>
        {description && (
          <CardContent>
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardContent>
        )}
        {action && (
          <CardFooter className="flex justify-end">
            {action}
          </CardFooter>
        )}
      </Card>
    );
  }
);
ActionCard.displayName = "ActionCard";

// @deprecated - Use SummaryCard from @/core/components/ui/cards
export interface SummaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  items: Array<{
    label: string;
    value: string | number;
  }>;
  footer?: React.ReactNode;
}

// @deprecated - Use SummaryCard from @/core/components/ui/cards
export const SummaryCard = React.forwardRef<HTMLDivElement, SummaryCardProps>(
  ({ className, title, items, footer, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn("flex flex-col", className)}
      {...props}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between py-1">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-medium">{item.value}</span>
          </div>
        ))}
      </CardContent>
      {footer && (
        <CardFooter className="border-t pt-3">
          {footer}
        </CardFooter>
      )}
    </Card>
  )
);
SummaryCard.displayName = "SummaryCard"; 