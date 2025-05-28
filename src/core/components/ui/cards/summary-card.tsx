import React from "react";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/shared/utils";
import { SummaryCardProps } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardActions,
} from "./card";
import { Button } from "@/core/components/ui/button";

/**
 * SummaryCard component for summarizing multiple metrics or data points
 */
export const SummaryCard = React.forwardRef<HTMLDivElement, SummaryCardProps>(
  (
    {
      title,
      description,
      metrics,
      action,
      footer,
      children,
      className,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    // Color mapping for metric indicators
    const colorClasses = {
      default: "text-foreground",
      muted: "text-muted-foreground",
      success: "text-green-600 dark:text-green-400",
      warning: "text-amber-600 dark:text-amber-400",
      danger: "text-red-600 dark:text-red-400",
    };

    // Action handler
    const handleAction = (e: React.MouseEvent) => {
      if (action?.onClick) {
        e.preventDefault();
        action.onClick();
      }
    };

    return (
      <Card
        ref={ref}
        className={cn("overflow-hidden", className)}
        isLoading={isLoading}
        {...props}
      >
        <CardHeader className="pb-2">
          <CardTitle size="lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>

        <CardContent>
          {/* If we have metrics array, render them */}
          {metrics && metrics.length > 0 && (
            <div className="space-y-3">
              {metrics.map((metric, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {metric.label}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      colorClasses[metric.color || "default"]
                    )}
                  >
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* If we have children, render those instead */}
          {children}
        </CardContent>

        {/* Action button if provided */}
        {action && (
          <CardActions align="right">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAction}
              asChild={!!action.href}
            >
              {action.href ? (
                <a href={action.href}>
                  {action.label}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </a>
              ) : (
                <>
                  {action.label}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardActions>
        )}

        {/* Optional footer */}
        {footer && <CardFooter bordered>{footer}</CardFooter>}
      </Card>
    );
  }
);

SummaryCard.displayName = "SummaryCard";
