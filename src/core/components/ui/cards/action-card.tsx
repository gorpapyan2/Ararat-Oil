import React from "react";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/shared/utils";
import { ActionCardProps } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardActions,
} from "./card";
import { Button } from "@/core/components/ui/button";

/**
 * ActionCard component for displaying actionable cards
 */
export const ActionCard = React.forwardRef<HTMLDivElement, ActionCardProps>(
  (
    {
      title,
      description,
      icon,
      status,
      actionLabel = "View details",
      onAction,
      actionHref,
      className,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    // Status indicator colors for the different states
    const statusColors = {
      success: "bg-green-500",
      warning: "bg-amber-500",
      error: "bg-red-500",
      info: "bg-blue-500",
      muted: "bg-muted-foreground",
    };

    // Action configuration
    const hasAction = !!(onAction || actionHref);

    // Handle click event
    const handleClick = (e: React.MouseEvent) => {
      if (onAction) {
        e.preventDefault();
        onAction();
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
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {status && (
                <div
                  className={cn(
                    "w-2 h-2 rounded-full mr-2",
                    statusColors[status]
                  )}
                  aria-hidden="true"
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

        {hasAction && (
          <CardActions>
            <Button
              variant="ghost"
              size="sm"
              className="px-0 h-auto text-sm font-medium"
              onClick={handleClick}
              asChild={!!actionHref}
            >
              {actionHref ? (
                <a href={actionHref}>
                  {actionLabel}
                  <ArrowRightIcon className="ml-1 h-3 w-3" />
                </a>
              ) : (
                <>
                  {actionLabel}
                  <ArrowRightIcon className="ml-1 h-3 w-3" />
                </>
              )}
            </Button>
          </CardActions>
        )}
      </Card>
    );
  }
);

ActionCard.displayName = "ActionCard";
