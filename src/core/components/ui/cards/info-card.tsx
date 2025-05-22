import React from "react";
import { Info, CheckCircle, AlertTriangle, AlertCircle, HelpCircle } from "lucide-react";
import { cn } from "@/shared/utils";
import { InfoCardProps } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardActions,
} from "./card";

/**
 * InfoCard component for displaying informational content with specific styling based on type
 */
export const InfoCard = React.forwardRef<HTMLDivElement, InfoCardProps>(
  (
    {
      title,
      description,
      icon,
      type = "default",
      actions,
      children,
      className,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    // Type-based styling
    const typeClasses = {
      default: "bg-card border",
      info: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300",
      success: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-900 dark:text-green-300",
      warning: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300",
      error: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-900 dark:text-red-300",
    };

    // Default icons if none provided
    const defaultIcons = {
      default: <HelpCircle className="h-5 w-5" />,
      info: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      success: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
      warning: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      error: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
    };

    // Decide which icon to display
    const displayIcon = icon || defaultIcons[type];

    return (
      <Card
        ref={ref}
        className={cn(
          "overflow-hidden",
          typeClasses[type],
          className
        )}
        variant="ghost"
        isLoading={isLoading}
        {...props}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start">
            {displayIcon && (
              <div className="mr-3 mt-0.5 flex-shrink-0">
                {displayIcon}
              </div>
            )}
            <div>
              <CardTitle size="sm">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-1">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        
        {children && (
          <CardContent padded className="pl-11">
            {children}
          </CardContent>
        )}
        
        {actions && (
          <CardActions align="right" className="pl-11">
            {actions}
          </CardActions>
        )}
      </Card>
    );
  }
);

InfoCard.displayName = "InfoCard"; 