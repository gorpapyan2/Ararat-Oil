import * as React from "react";
import { cn } from "@/lib/utils";
import {
  CardPrimitive,
  CardHeaderPrimitive,
  CardFooterPrimitive,
  CardTitlePrimitive,
  CardDescriptionPrimitive,
  CardContentPrimitive,
  CardMediaPrimitive,
  CardActionsPrimitive,
} from "@/components/ui/primitives/card";

export interface CardProps extends React.ComponentPropsWithoutRef<typeof CardPrimitive> {
  /**
   * Visual style variant
   * @default "default"
   */
  variant?: "default" | "outline" | "elevated" | "subtle";
}

/**
 * Card component with visual styling
 */
const Card = React.forwardRef<
  React.ElementRef<typeof CardPrimitive>,
  CardProps
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-card border-border/40",
    outline: "bg-transparent border-border",
    elevated: "bg-card border-0 shadow-lg",
    subtle: "bg-muted/50 border-0",
  };

  return (
    <CardPrimitive
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        "hover:shadow-md hover:-translate-y-1 hover:border-primary dark:hover:border-primary",
        "transition-shadow transition-transform duration-200 ease-in-out",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 overflow-hidden",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

export interface CardHeaderProps extends React.ComponentPropsWithoutRef<typeof CardHeaderPrimitive> {}

const CardHeader = React.forwardRef<
  React.ElementRef<typeof CardHeaderPrimitive>,
  CardHeaderProps
>(({ className, ...props }, ref) => (
  <CardHeaderPrimitive
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6 border-b border-border", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.ComponentPropsWithoutRef<typeof CardTitlePrimitive> {
  /**
   * Size variant for the title
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
}

const CardTitle = React.forwardRef<
  React.ElementRef<typeof CardTitlePrimitive>,
  CardTitleProps
>(({ className, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <CardTitlePrimitive
      ref={ref}
      className={cn(
        "font-semibold leading-tight tracking-tight",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends React.ComponentPropsWithoutRef<typeof CardDescriptionPrimitive> {}

const CardDescription = React.forwardRef<
  React.ElementRef<typeof CardDescriptionPrimitive>,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <CardDescriptionPrimitive
    ref={ref}
    className={cn("text-sm sm:text-base text-muted-foreground leading-normal", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export interface CardContentProps extends React.ComponentPropsWithoutRef<typeof CardContentPrimitive> {
  /**
   * Remove default padding
   * @default false
   */
  noPadding?: boolean;
}

const CardContent = React.forwardRef<
  React.ElementRef<typeof CardContentPrimitive>,
  CardContentProps
>(({ className, noPadding = false, ...props }, ref) => (
  <CardContentPrimitive 
    ref={ref} 
    className={cn(noPadding ? "p-0" : "p-6", className)}
    {...props} 
  />
));
CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.ComponentPropsWithoutRef<typeof CardFooterPrimitive> {
  /**
   * Alignment of content within the footer
   * @default "between"
   */
  align?: "start" | "center" | "between" | "end";
}

const CardFooter = React.forwardRef<
  React.ElementRef<typeof CardFooterPrimitive>,
  CardFooterProps
>(({ className, align = "between", ...props }, ref) => {
  const alignClasses = {
    start: "justify-start",
    center: "justify-center",
    between: "justify-between",
    end: "justify-end",
  };

  return (
    <CardFooterPrimitive
      ref={ref}
      className={cn(
        "flex items-center p-6 border-t border-border", 
        alignClasses[align],
        className
      )}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export interface CardMediaProps extends React.ComponentPropsWithoutRef<typeof CardMediaPrimitive> {}

const CardMedia = React.forwardRef<
  React.ElementRef<typeof CardMediaPrimitive>,
  CardMediaProps
>(({ className, ...props }, ref) => (
  <CardMediaPrimitive 
    ref={ref} 
    className={cn("w-full overflow-hidden rounded-t-xl", className)} 
    {...props} 
  />
));
CardMedia.displayName = "CardMedia";

export interface CardActionsProps extends React.ComponentPropsWithoutRef<typeof CardActionsPrimitive> {}

const CardActions = React.forwardRef<
  React.ElementRef<typeof CardActionsPrimitive>,
  CardActionsProps
>(({ className, ...props }, ref) => (
  <CardActionsPrimitive 
    ref={ref} 
    className={cn("flex justify-end flex-wrap gap-2 p-4 border-t border-border", className)} 
    {...props} 
  />
));
CardActions.displayName = "CardActions";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardMedia,
  CardActions,
};
