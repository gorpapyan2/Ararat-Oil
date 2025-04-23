import React from "react";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GradientCard } from "@/components/ui/gradient-card";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { LucideIcon } from "lucide-react";

export interface StatChangeProps {
  value: number;
  label?: string;
  format?: (value: number) => string;
  isPositive?: boolean | null;
  isNegative?: boolean | null;
}

export interface EnhancedStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  change?: StatChangeProps;
  loading?: boolean;
  gradient?: "primary" | "accent" | "error" | "brand" | "subtle" | "none";
  accentColor?: "primary" | "accent" | "error" | "brand" | "blue" | "none";
  iconColor?: "accent" | "primary" | "error" | "brand" | "muted" | "default";
  iconAnimation?: "pulse" | "spin" | "float" | "bounce" | "rotate" | "none";
  highlight?: boolean;
  formatter?: (value: number | string) => string;
  footer?: React.ReactNode;
  className?: string;
  index?: number;
}

export const EnhancedStatCard: React.FC<EnhancedStatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  loading = false,
  gradient = "primary",
  accentColor = "primary",
  iconColor = "primary",
  iconAnimation = "pulse",
  highlight = false,
  formatter = (value) => typeof value === 'number' ? value.toLocaleString() : value,
  footer,
  className,
  index = 0,
}) => {
  // Determine border color based on accentColor
  const borderColor = 
    accentColor === "accent" ? "border-l-accent" :
    accentColor === "error" ? "border-l-error" :
    accentColor === "brand" ? "border-l-brand" :
    accentColor === "blue" ? "border-l-blue-500" :
    accentColor === "none" ? "border-l-transparent" :
    "border-l-primary";

  // Determine icon background gradient
  const iconGradient = 
    accentColor === "accent" ? "accent" :
    accentColor === "error" ? "error" :
    accentColor === "brand" ? "brand" :
    accentColor === "blue" ? "blue" :
    "primary";

  // Determine change badge variant
  const getBadgeVariant = () => {
    if (!change) return "outline";
    
    if (change.isPositive !== undefined) {
      return change.isPositive ? "success" : "destructive";
    } else if (change.isNegative !== undefined) {
      return change.isNegative ? "destructive" : "success";
    } else {
      return change.value > 0 ? "success" : change.value < 0 ? "destructive" : "outline";
    }
  };

  // Format change value
  const formatChangeValue = () => {
    if (!change) return "";
    
    const prefix = change.value > 0 ? "+" : "";
    if (change.format) {
      return `${prefix}${change.format(change.value)}`;
    }
    return `${prefix}${change.value.toLocaleString()}${change.label || "%"}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        type: "spring", 
        stiffness: 100, 
        delay: index * 0.1 
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group"
    >
      <GradientCard 
        gradient={gradient}
        animation="hover"
        className={cn(
          "overflow-hidden border-l-4", 
          borderColor,
          highlight && "ring-1 ring-accent/30 dark:ring-accent/20",
          className
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground dark:text-foreground">{title}</CardTitle>
          <AnimatedIcon 
            icon={<Icon />} 
            animation={iconAnimation}
            color={iconColor}
            gradient={iconGradient}
            size="sm"
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold relative overflow-hidden group-hover:text-accent dark:group-hover:text-accent transition-colors duration-300 text-foreground dark:text-foreground">
                {formatter(value)}
              </div>
              {change && (
                <div className="flex items-center mt-2 transition-all duration-300 group-hover:translate-x-1">
                  <Badge variant={getBadgeVariant()} className="text-xs font-normal">
                    {formatChangeValue()} {change.label ? null : (change.value > 0 ? "increase" : "decrease")}
                  </Badge>
                </div>
              )}
            </>
          )}
        </CardContent>
        {footer && (
          <CardFooter className="pt-0">
            {footer}
          </CardFooter>
        )}
      </GradientCard>
    </motion.div>
  );
};

export default EnhancedStatCard;
