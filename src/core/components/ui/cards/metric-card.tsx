import React from "react";
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from "lucide-react";
import { cn } from "@/shared/utils";
import { MetricCardProps } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";

/**
 * MetricCard component for displaying numerical data with optional trends
 */
export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      title,
      value,
      description,
      icon,
      trend,
      footer,
      onClick,
      className,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    // Determine if we're showing a trend and its direction
    const showTrend = trend !== undefined;
    const trendDirection =
      trend?.direction ||
      (typeof trend?.value === "number" && trend?.value > 0
        ? "up"
        : typeof trend?.value === "number" && trend?.value < 0
          ? "down"
          : "neutral");

    // Trend direction styling
    const directionClasses = {
      up: "text-green-600 dark:text-green-400",
      down: "text-red-600 dark:text-red-400",
      neutral: "text-muted-foreground",
    };

    return (
      <Card
        ref={ref}
        className={cn("overflow-hidden", className)}
        interactive={!!onClick}
        hover={!!onClick}
        isLoading={isLoading}
        onClick={onClick}
        {...props}
      >
        <CardHeader className="pb-2 flex justify-between items-start">
          <div>
            <CardTitle size="sm" className="line-clamp-1">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="line-clamp-2 mt-1">
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

        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-24 bg-muted rounded animate-pulse" />
            ) : (
              value
            )}
          </div>

          {showTrend && (
            <div
              className={cn(
                "flex items-center mt-1 text-sm font-medium",
                directionClasses[trendDirection]
              )}
            >
              {trendDirection === "up" && (
                <ArrowUpIcon className="w-4 h-4 mr-1" />
              )}
              {trendDirection === "down" && (
                <ArrowDownIcon className="w-4 h-4 mr-1" />
              )}
              {trendDirection === "neutral" && (
                <ArrowRightIcon className="w-4 h-4 mr-1" />
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

        {footer && (
          <CardFooter bordered className="pt-2">
            {footer}
          </CardFooter>
        )}
      </Card>
    );
  }
);

MetricCard.displayName = "MetricCard";
