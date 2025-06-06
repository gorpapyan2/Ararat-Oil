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

    // Enhanced trend direction styling with natural colors
    const directionClasses = {
      up: "text-status-operational",
      down: "text-status-critical", 
      neutral: "text-muted-foreground",
    };

    const directionBackgrounds = {
      up: "bg-status-operational/10",
      down: "bg-status-critical/10",
      neutral: "bg-muted/10",
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "group relative overflow-hidden transition-all duration-300",
          "bg-white hover:bg-gradient-natural-light",
          "border border-border hover:border-accent/20",
          "hover:shadow-lg hover:scale-[1.02]",
          className
        )}
        interactive={!!onClick}
        hover={!!onClick}
        isLoading={isLoading}
        onClick={onClick}
        {...props}
      >
        {/* Subtle accent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="relative pb-2 flex justify-between items-start">
          <div className="flex-1">
            <CardTitle size="sm" className="line-clamp-1 text-foreground group-hover:text-primary transition-colors duration-300">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="line-clamp-2 mt-1 text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                {description}
              </CardDescription>
            )}
          </div>
          {icon && (
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300",
              "bg-gradient-natural-light group-hover:bg-gradient-accent",
              "text-primary group-hover:text-accent-foreground"
            )}>
              {icon}
            </div>
          )}
        </CardHeader>

        <CardContent className="relative">
          <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {isLoading ? (
              <div className="h-8 w-24 bg-gradient-natural-light rounded animate-pulse" />
            ) : (
              value
            )}
          </div>

          {showTrend && (
            <div
              className={cn(
                "flex items-center mt-2 text-sm font-medium px-2 py-1 rounded-md transition-all duration-300",
                directionClasses[trendDirection],
                directionBackgrounds[trendDirection]
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
          <CardFooter bordered className="relative pt-2 border-t border-border group-hover:border-accent/20 transition-colors duration-300">
            {footer}
          </CardFooter>
        )}

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    );
  }
);

MetricCard.displayName = "MetricCard";
