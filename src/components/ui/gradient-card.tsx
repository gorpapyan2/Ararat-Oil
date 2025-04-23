import React from "react";
import { Card } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

const gradientCardVariants = cva(
  "transition-all duration-300 overflow-hidden", 
  {
    variants: {
      gradient: {
        primary: "bg-card-gradient-light dark:bg-card-gradient-dark",
        accent: "bg-accent-gradient-light dark:bg-accent-gradient-dark",
        error: "bg-error-gradient-light dark:bg-error-gradient-dark",
        brand: "bg-brand-gradient-light dark:bg-brand-gradient-dark",
        subtle: "bg-surface-gradient-light dark:bg-surface-gradient-dark",
        none: "bg-background",
      },
      animation: {
        hover: "hover:-translate-y-1 hover:shadow-hover",
        scale: "hover:scale-[1.02] hover:shadow-hover",
        glow: "hover:shadow-glow",
        none: "",
      },
      border: {
        accent: "border-l-4 border-l-accent",
        error: "border-l-4 border-l-error",
        brand: "border-l-4 border-l-brand",
        primary: "border-l-4 border-l-primary",
        default: "border border-border",
        none: "border-0",
      },
      shadow: {
        default: "shadow-card",
        heavy: "shadow-lg",
        floating: "shadow-xl",
        inner: "shadow-inner",
        none: "shadow-none",
      }
    },
    defaultVariants: {
      gradient: "primary",
      animation: "hover",
      border: "default",
      shadow: "default",
    },
  }
);

export interface GradientCardProps 
  extends Omit<CardProps, "ref">, 
    VariantProps<typeof gradientCardVariants> {
  animate?: boolean;
  delay?: number;
}

export const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ 
    className, 
    gradient, 
    animation, 
    border, 
    shadow,
    animate = false,
    delay = 0,
    children, 
    ...props 
  }, ref) => {
    const cardStyles = cn(
      gradientCardVariants({ gradient, animation, border, shadow }),
      className
    );

    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            type: "spring", 
            stiffness: 100, 
            delay: delay * 0.1 
          }}
          whileHover={animation === "none" ? undefined : { y: -5, transition: { duration: 0.2 } }}
          className="group"
        >
          <Card className={cardStyles} {...props}>
            {children}
          </Card>
        </motion.div>
      );
    }

    return (
      <Card className={cardStyles} ref={ref} {...props}>
        {children}
      </Card>
    );
  }
);

GradientCard.displayName = "GradientCard";
