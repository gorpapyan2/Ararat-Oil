import * as React from 'react';
import { ArrowRight, ArrowUp, ArrowDown, Info } from 'lucide-react';

import { cn } from '@/shared/utils';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/core/components/ui/primitives/card';
import { Button } from '@/core/components/ui/primitives/button';

/**
 * Cards component
 * 
 * @placeholder This is a placeholder component that needs proper implementation
 */
export function Cards({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn('composed-cards', className)}
      {...props}
    >
      {children || (
        <div className="p-4 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
          Cards (Placeholder)
        </div>
      )}
    </div>
  );
}

/**
 * MetricCard component for displaying key metrics with optional trends
 */
export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  trend?: number;
  description?: string;
  footer?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  trend,
  description,
  footer,
  className,
  ...props
}: MetricCardProps) {
  const showTrend = trend !== undefined;
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {showTrend && (
            <div className={cn(
              "flex items-center text-sm font-medium",
              isPositive ? "text-green-500" : null,
              isNegative ? "text-red-500" : null,
            )}>
              {isPositive && <ArrowUp className="mr-1 h-4 w-4" />}
              {isNegative && <ArrowDown className="mr-1 h-4 w-4" />}
              {trend}%
            </div>
          )}
        </div>
      </CardContent>
      {footer && <CardFooter className="pt-2 border-t">{footer}</CardFooter>}
    </Card>
  );
}

/**
 * ActionCard component for linking to other parts of the application
 */
export interface ActionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actionLabel: string;
  actionHref: string;
  icon?: React.ReactNode;
}

export function ActionCard({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
  className,
  ...props
}: ActionCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardFooter className="pt-2">
        <Button className="w-full justify-between" variant="outline" asChild>
          <a href={actionHref}>
            {actionLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * StatsCard component for displaying statistical information
 */
export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  footer,
  className,
  ...props
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
      {footer && <CardFooter className="pt-2 border-t">{footer}</CardFooter>}
    </Card>
  );
}

/**
 * SummaryCard component for summarizing information
 */
export interface SummaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function SummaryCard({
  title,
  description,
  children,
  footer,
  className,
  ...props
}: SummaryCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter className="pt-2 border-t">{footer}</CardFooter>}
    </Card>
  );
}
