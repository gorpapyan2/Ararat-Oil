import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const animatedButtonVariants = cva(
  "transition-all duration-300 group", 
  {
    variants: {
      animation: {
        scale: "hover:scale-105 active:scale-95",
        float: "hover:-translate-y-1 active:translate-y-0",
        glow: "hover:shadow-glow active:shadow-inner",
        rotate: "hover:rotate-1 active:rotate-0",
        bounce: "hover:animate-bounce",
        none: "",
      },
      shape: {
        rounded: "rounded-md",
        pill: "rounded-full",
        default: "",
      },
    },
    defaultVariants: {
      animation: "scale",
      shape: "default",
    },
  }
);

export interface AnimatedButtonProps 
  extends ButtonProps, 
    VariantProps<typeof animatedButtonVariants> {
  iconAnimation?: 
    | "pulse" 
    | "spin" 
    | "float" 
    | "none";
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, animation, shape, iconAnimation = "none", children, ...props }, ref) => {
    
    // Create the appropriate icon animation class
    const getIconAnimationClass = () => {
      switch (iconAnimation) {
        case "pulse": return "group-hover:animate-pulse-subtle";
        case "spin": return "group-hover:animate-spin transition-all duration-700";
        case "float": return "group-hover:animate-float transition-all";
        default: return "";
      }
    };

    // Process children to apply icon animation if needed
    const processedChildren = React.Children.map(children, child => {
      if (React.isValidElement(child) && 
          (child.type === 'svg' || 
           (typeof child.type === 'object' && 'displayName' in child.type && String(child.type.displayName).includes('Icon')))) {
        return React.cloneElement(child, {
          className: cn(child.props.className, getIconAnimationClass())
        });
      }
      return child;
    });

    return (
      <Button
        className={cn(animatedButtonVariants({ animation, shape }), className)}
        ref={ref}
        {...props}
      >
        {processedChildren}
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";
