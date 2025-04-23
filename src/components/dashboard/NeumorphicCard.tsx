import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NeumorphicCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  infoTooltip?: string;
  className?: string;
  headerAction?: ReactNode;
  loading?: boolean;
}

export function NeumorphicCard({
  title,
  description,
  children,
  infoTooltip,
  className,
  headerAction,
  loading
}: NeumorphicCardProps) {
  return (
    <Card 
      className={cn(
        "rounded-lg h-full transition-all duration-200",
        "bg-card-gradient-light dark:bg-card-gradient-dark shadow-card hover:shadow-hover border border-stroke/10",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold text-primary">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm text-muted">
                {description}
              </CardDescription>
            )}
          </div>
          <div className="flex gap-2">
            {infoTooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shadow-neumorphic-sm">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="max-w-xs">{infoTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {headerAction}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="space-y-4 w-full px-4">
              <div className="h-5 w-full bg-gray-200 animate-pulse rounded-md"></div>
              <div className="h-[250px] w-full bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
