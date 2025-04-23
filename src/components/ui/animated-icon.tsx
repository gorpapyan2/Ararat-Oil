import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const animatedIconVariants = cva(
  "transition-all duration-300", 
  {
    variants: {
      animation: {
        pulse: "group-hover:animate-pulse-subtle",
        spin: "group-hover:animate-spin",
        float: "group-hover:animate-float",
        bounce: "group-hover:animate-bounce",
        rotate: "group-hover:rotate-180",
        none: "",
      },
      containerStyle: {
        rounded: "flex items-center justify-center rounded-full",
        circle: "flex items-center justify-center rounded-full aspect-square",
        default: "flex items-center justify-center",
        none: "",
      },
      color: {
        accent: "text-accent",
        primary: "text-primary",
        error: "text-error",
        brand: "text-brand",
        muted: "text-muted-foreground",
        default: "",
      },
      gradient: {
        accent: "bg-gradient-to-br from-green-50 to-accent/10 dark:from-green-900/20 dark:to-accent/20",
        error: "bg-gradient-to-br from-red-50 to-error/10 dark:from-red-900/20 dark:to-error/20",
        primary: "bg-gradient-to-br from-indigo-50 to-primary/10 dark:from-indigo-900/20 dark:to-primary/20",
        brand: "bg-gradient-to-br from-olive-50 to-brand/10 dark:from-olive-900/20 dark:to-brand/20",
        blue: "bg-gradient-to-br from-blue-50 to-blue-500/10 dark:from-blue-900/20 dark:to-blue-500/20",
        surface: "bg-surface/10",
        none: "",
      },
      size: {
        xs: "h-6 w-6 p-1",
        sm: "h-8 w-8 p-1.5",
        md: "h-10 w-10 p-2",
        lg: "h-12 w-12 p-2.5",
        xl: "h-16 w-16 p-3",
        custom: "",
      },
    },
    defaultVariants: {
      animation: "pulse",
      containerStyle: "circle",
      color: "default",
      gradient: "none",
      size: "md",
    },
  }
);

export interface AnimatedIconProps 
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof animatedIconVariants> {
  icon: React.ReactElement;
  iconClassName?: string;
  animate?: boolean;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  className,
  icon,
  iconClassName,
  animation,
  containerStyle,
  color,
  gradient,
  size,
  animate = true,
  ...props
}) => {
  // Clone the icon element to apply our custom styles
  const styledIcon = React.cloneElement(icon, {
    className: cn(
      "transition-all duration-300",
      animate && animation !== "none" ? (
        animation === "pulse" ? "group-hover:animate-pulse-subtle" : 
        animation === "spin" ? "group-hover:animate-spin" : 
        animation === "float" ? "group-hover:animate-float" : 
        animation === "bounce" ? "group-hover:animate-bounce" :
        animation === "rotate" ? "group-hover:rotate-180" : ""
      ) : "",
      color === "accent" ? "text-accent" : 
      color === "primary" ? "text-primary" : 
      color === "error" ? "text-error" : 
      color === "brand" ? "text-brand" : 
      color === "muted" ? "text-muted-foreground" : "",
      size === "xs" ? "h-3 w-3" : 
      size === "sm" ? "h-4 w-4" : 
      size === "md" ? "h-5 w-5" : 
      size === "lg" ? "h-6 w-6" : 
      size === "xl" ? "h-8 w-8" : "",
      iconClassName
    )
  });


  return (
    <div
      className={cn(
        "group",
        animatedIconVariants({ animation, containerStyle, color, gradient, size }),
        className
      )}
      {...props}
    >
      {styledIcon}
    </div>
  );
};

AnimatedIcon.displayName = "AnimatedIcon";
