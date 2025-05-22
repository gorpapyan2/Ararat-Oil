import * as React from "react";
import { cn } from "@/shared/utils";
import {
  CardBaseProps,
  CardHeaderProps,
  CardFooterProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardMediaProps,
  CardActionsProps
} from "./types";

const Card = React.forwardRef<
  HTMLDivElement,
  CardBaseProps
>(({
  className,
  variant = "default",
  size = "md",
  hover = false,
  interactive = false,
  disabled = false,
  radius = "md",
  isLoading = false,
  children,
  ...props
}, ref) => {
  // Base classes for card
  const baseClasses = "bg-card text-card-foreground";
  
  // Variant specific classes
  const variantClasses = {
    default: "border shadow-sm",
    outline: "border",
    ghost: "border-transparent",
    elevated: "border-none shadow-md"
  };
  
  // Size specific classes
  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  };
  
  // Radius classes
  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-3xl"
  };
  
  // Interactive state classes
  const interactiveClasses = interactive
    ? "transition-all duration-200 hover:shadow-md cursor-pointer " + 
      (hover ? "hover:scale-[1.02] active:scale-[0.98]" : "")
    : "";
  
  // Disabled state classes
  const disabledClasses = disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "";
  
  // Loading state classes
  const loadingClasses = isLoading ? "animate-pulse pointer-events-none" : "";
  
  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        radiusClasses[radius],
        interactiveClasses,
        disabledClasses,
        loadingClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  CardHeaderProps
>(({
  className,
  padded = true,
  bordered = false,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5",
        padded && "px-6 pt-6",
        bordered && "border-b pb-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  CardTitleProps
>(({
  className,
  size = "default",
  as: Comp = "h3",
  children,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: "text-base font-medium",
    default: "text-lg font-semibold",
    lg: "text-xl font-semibold",
    xl: "text-2xl font-semibold"
  };

  return (
    <Comp
      ref={ref}
      className={cn(
        "leading-none tracking-tight",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({
  className,
  size = "default",
  children,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base"
  };

  return (
    <p
      ref={ref}
      className={cn(
        "text-muted-foreground",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
});
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  CardContentProps
>(({
  className,
  padded = true,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        padded && "px-6 py-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  CardFooterProps
>(({
  className,
  padded = true,
  bordered = false,
  align = "left",
  children,
  ...props
}, ref) => {
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        alignClasses[align],
        padded && "px-6 pb-6",
        bordered && "border-t pt-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
CardFooter.displayName = "CardFooter";

const CardMedia = React.forwardRef<
  HTMLDivElement,
  CardMediaProps
>(({
  className,
  position = "top",
  aspectRatio = "16:9",
  children,
  ...props
}, ref) => {
  const aspectRatioClasses = {
    "1:1": "aspect-square",
    "16:9": "aspect-video",
    "4:3": "aspect-4/3",
    "3:2": "aspect-3/2",
    "2:1": "aspect-2/1"
  };

  const positionClasses = {
    top: "-mx-6 -mt-6 mb-4 rounded-t-md overflow-hidden",
    bottom: "-mx-6 -mb-6 mt-4 rounded-b-md overflow-hidden"
  };

  return (
    <div
      ref={ref}
      className={cn(
        aspectRatioClasses[aspectRatio],
        positionClasses[position],
        "relative",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
CardMedia.displayName = "CardMedia";

const CardActions = React.forwardRef<
  HTMLDivElement,
  CardActionsProps
>(({
  className,
  padded = true,
  align = "right",
  children,
  ...props
}, ref) => {
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2",
        alignClasses[align],
        padded && "px-6 pb-6 pt-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
CardActions.displayName = "CardActions";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardMedia,
  CardActions
}; 