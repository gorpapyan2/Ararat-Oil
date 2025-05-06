import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: {
    name: string;
    href: string;
    isCurrent?: boolean;
    icon?: React.ReactNode;
  }[];
}

export function Breadcrumb({ segments, className, ...props }: BreadcrumbProps) {
  // Show only the last 3 segments on small screens to prevent overflow
  const visibleSegments = segments.length > 3 
    ? [...segments.slice(0, 1), ...segments.slice(-2)] 
    : segments;
  
  const hasHiddenSegments = segments.length > 3;
  const hiddenSegments = hasHiddenSegments ? segments.slice(1, -2) : [];
  
  return (
    <nav 
      className={cn("flex", className)} 
      aria-label="Breadcrumb" 
      {...props}
    >
      <ol className="inline-flex items-center flex-nowrap overflow-x-auto max-w-full scrollbar-hide">
        {/* Always render the first segment (usually Home) */}
        {segments.length > 0 && (
          <li key={segments[0].href} className="inline-flex items-center shrink-0">
            <Link
              to={segments[0].href}
              className={cn(
                "text-sm font-medium flex items-center transition-colors duration-200",
                "text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-1"
              )}
              aria-label={segments[0].name}
            >
              {segments[0].icon || <Home className="h-4 w-4" />}
              <span className="sr-only md:not-sr-only md:ml-1">{segments[0].name}</span>
            </Link>
          </li>
        )}

        {/* Show ellipsis for hidden segments with tooltip */}
        {hasHiddenSegments && (
          <li className="inline-flex items-center shrink-0">
            <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <span className="text-sm font-medium text-muted-foreground px-1 cursor-default select-none">
                    ...
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="max-w-xs">
                  <div className="flex flex-col space-y-1 text-xs">
                    {hiddenSegments.map((segment) => (
                      <Link 
                        key={segment.href}
                        to={segment.href} 
                        className="hover:text-foreground text-muted-foreground py-0.5 px-2"
                      >
                        {segment.name}
                      </Link>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        )}

        {/* Show the visible segments after the first one */}
        {visibleSegments.slice(hasHiddenSegments ? 0 : 1).map((segment, index) => (
          <li key={segment.href} className="inline-flex items-center shrink-0">
            <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            {segment.isCurrent ? (
              <span
                className={cn(
                  "text-sm font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-none mx-1",
                  "text-foreground"
                )}
                aria-current="page"
                title={segment.name}
              >
                {segment.name}
              </span>
            ) : (
              <Link
                to={segment.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground hover:text-foreground truncate max-w-[100px] sm:max-w-[200px] md:max-w-none mx-1",
                  "transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
                title={segment.name}
              >
                {segment.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
