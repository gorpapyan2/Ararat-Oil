import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: {
    name: string;
    href: string;
    isCurrent?: boolean;
  }[];
}

export function Breadcrumb({ segments, className, ...props }: BreadcrumbProps) {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb" {...props}>
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {segments.map((segment, index) => (
          <li key={segment.href} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
            )}
            {segment.isCurrent ? (
              <span
                className={cn(
                  "text-sm font-medium",
                  segment.isCurrent
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current="page"
              >
                {segment.name}
              </span>
            ) : (
              <Link
                to={segment.href}
                className={cn(
                  "text-sm font-medium",
                  segment.isCurrent
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
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
