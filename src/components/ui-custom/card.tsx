import React from "react";
import { cn } from "@/lib/utils";
import {
  Card as ShadcnCard,
  CardHeader as ShadcnCardHeader,
  CardFooter as ShadcnCardFooter,
  CardTitle as ShadcnCardTitle,
  CardDescription as ShadcnCardDescription,
  CardContent as ShadcnCardContent,
} from "@/components/ui/card";

// Custom Card component with our design system's styling
const Card = React.forwardRef<
  React.ElementRef<typeof ShadcnCard>,
  React.ComponentPropsWithoutRef<typeof ShadcnCard> & {
    variant?: "default" | "outline" | "elevated" | "subtle";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-card border-border/40",
    outline: "bg-transparent border-border",
    elevated: "bg-card border-0 shadow-lg",
    subtle: "bg-muted/50 border-0", 
  };

  return (
    <ShadcnCard
      ref={ref}
      className={cn(
        // Update to match our design system
        "rounded-xl border shadow transition-all duration-200",
        "hover:shadow-md",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

// Custom CardHeader with our spacing
const CardHeader = React.forwardRef<
  React.ElementRef<typeof ShadcnCardHeader>,
  React.ComponentPropsWithoutRef<typeof ShadcnCardHeader>
>(({ className, ...props }, ref) => (
  <ShadcnCardHeader
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// Custom CardTitle using our font system
const CardTitle = React.forwardRef<
  React.ElementRef<typeof ShadcnCardTitle>,
  React.ComponentPropsWithoutRef<typeof ShadcnCardTitle> & {
    size?: "sm" | "md" | "lg";
  }
>(({ className, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <ShadcnCardTitle
      ref={ref}
      className={cn(
        "font-heading font-semibold leading-tight",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

// CardDescription with good contrast
const CardDescription = React.forwardRef<
  React.ElementRef<typeof ShadcnCardDescription>,
  React.ComponentPropsWithoutRef<typeof ShadcnCardDescription>
>(({ className, ...props }, ref) => (
  <ShadcnCardDescription
    ref={ref}
    className={cn("text-sm text-muted-foreground/90", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// CardContent with adjustable padding
const CardContent = React.forwardRef<
  React.ElementRef<typeof ShadcnCardContent>,
  React.ComponentPropsWithoutRef<typeof ShadcnCardContent> & {
    noPadding?: boolean;
  }
>(({ className, noPadding = false, ...props }, ref) => (
  <ShadcnCardContent
    ref={ref}
    className={cn(
      noPadding ? "p-0" : "p-6 pt-0",
      className
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

// CardFooter with spacing options
const CardFooter = React.forwardRef<
  React.ElementRef<typeof ShadcnCardFooter>,
  React.ComponentPropsWithoutRef<typeof ShadcnCardFooter> & {
    align?: "start" | "center" | "between" | "end";
  }
>(({ className, align = "center", ...props }, ref) => {
  const alignClasses = {
    start: "justify-start",
    center: "justify-center",
    between: "justify-between",
    end: "justify-end",
  };

  return (
    <ShadcnCardFooter
      ref={ref}
      className={cn(
        "flex items-center p-6 pt-2",
        alignClasses[align],
        className
      )}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

// Stats card for displaying metrics with title, value, change
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    direction: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  className,
}) => {
  const directionClasses = {
    up: "text-green-600 dark:text-green-400",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle size="sm">{title}</CardTitle>
          {icon && <div className="text-muted-foreground/60">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {change && (
          <div className={cn("mt-1 text-sm", directionClasses[change.direction])}>
            {change.direction === "up" && "↑ "}
            {change.direction === "down" && "↓ "}
            {change.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  StatsCard,
};
