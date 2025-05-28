import React from "react";
import { cn } from "@/shared/utils";
import { StatsCardProps } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";

/**
 * StatsCard component for displaying simple statistical information
 */
export const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  (
    {
      title,
      value,
      description,
      icon,
      change,
      footer,
      className,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    // Direction-based styling for change indicators
    const directionClasses = {
      up: "text-green-600 dark:text-green-400",
      down: "text-red-600 dark:text-red-400",
      neutral: "text-muted-foreground",
    };

    return (
      <Card
        ref={ref}
        className={cn("overflow-hidden", className)}
        isLoading={isLoading}
        {...props}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle size="sm">{title}</CardTitle>
            {icon && <div className="text-muted-foreground/60">{icon}</div>}
          </div>
          {description && (
            <CardDescription className="mt-1">{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          {change && (
            <div
              className={cn(
                "mt-1 text-sm",
                directionClasses[change.direction || "neutral"]
              )}
            >
              {change.direction === "up" && "↑ "}
              {change.direction === "down" && "↓ "}
              {change.value}
            </div>
          )}
        </CardContent>
        {footer && <CardFooter bordered>{footer}</CardFooter>}
      </Card>
    );
  }
);

StatsCard.displayName = "StatsCard";
