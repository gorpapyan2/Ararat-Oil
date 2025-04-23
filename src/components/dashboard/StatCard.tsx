import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: string;
  change?: string | null;
  changeValue?: number;
  icon?: React.ReactNode;
  loading?: boolean;
}

export function StatCard({ title, value, change, changeValue, icon, loading }: StatCardProps) {
  const isPositive = changeValue && changeValue > 0;
  const isNegative = changeValue && changeValue < 0;
  
  return (
    <Card 
      className={cn(
        "rounded-lg h-full transition-all duration-200",
        "bg-card-gradient-light dark:bg-card-gradient-dark shadow-card hover:shadow-hover border border-stroke/10"
      )}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-muted">{title}</h3>
          {icon && (
            <div className="h-8 w-8 rounded-full bg-surface flex items-center justify-center shadow-card">
              {icon}
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="space-y-2">
            <div className="h-7 w-3/4 bg-base animate-pulse rounded-md"></div>
            <div className="h-4 w-1/2 bg-base animate-pulse rounded-md"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold mt-1 text-primary">{value}</div>
            
            {change && (
              <div className="mt-2 flex items-center text-xs">
                {isPositive && <ArrowUpRight className="h-3.5 w-3.5 text-green-500 mr-1" />}
                {isNegative && <ArrowDownRight className="h-3.5 w-3.5 text-red-500 mr-1" />}
                <Badge
                  variant={isPositive ? "success" : isNegative ? "destructive" : "outline"}
                  className={cn(
                    "text-xs font-normal py-0 h-5",
                    "shadow-card"
                  )}
                >
                  {change}
                </Badge>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
