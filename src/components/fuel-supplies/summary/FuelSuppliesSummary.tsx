import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { CardGrid, MetricCardProps } from "@/components/ui/composed/cards";
import { FuelSupply, FuelType } from "@/types";
import { format, subDays, subMonths, subWeeks, isAfter, parseISO } from "date-fns";
import { 
  TrendingUp, 
  DollarSign, 
  Droplet, 
  Calendar, 
  Fuel, 
  CircleDollarSign,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types for filters
type TimePeriod = "all" | "week" | "month" | "3months" | "6months" | "year";
type GroupingFilter = "fuelType" | "tank";

interface FuelSuppliesSummaryProps {
  supplies: FuelSupply[];
  loading?: boolean;
  className?: string;
  initialFilters?: {
    period?: TimePeriod;
    groupBy?: GroupingFilter;
  };
}

// Helper function to format numbers
const formatNumber = (num: number): string => {
  return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

export function FuelSuppliesSummary({ 
  supplies, 
  loading, 
  className,
  initialFilters 
}: FuelSuppliesSummaryProps) {
  const { t } = useTranslation();
  
  // State for filters
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(initialFilters?.period || "all");
  const [groupBy, setGroupBy] = useState<GroupingFilter>(initialFilters?.groupBy || "fuelType");
  
  // Filter supplies by time period
  const filteredSupplies = useMemo(() => {
    if (timePeriod === "all") return supplies;
    
    const now = new Date();
    let cutoffDate: Date;
    
    switch(timePeriod) {
      case "week":
        cutoffDate = subWeeks(now, 1);
        break;
      case "month":
        cutoffDate = subMonths(now, 1);
        break;
      case "3months":
        cutoffDate = subMonths(now, 3);
        break;
      case "6months":
        cutoffDate = subMonths(now, 6);
        break;
      case "year":
        cutoffDate = subMonths(now, 12);
        break;
      default:
        return supplies;
    }
    
    return supplies.filter(supply => {
      const supplyDate = parseISO(supply.delivery_date);
      return isAfter(supplyDate, cutoffDate);
    });
  }, [supplies, timePeriod]);
  
  const summary = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const totalQuantity = filteredSupplies.reduce(
      (sum, supply) => sum + supply.quantity_liters,
      0,
    );
    const totalCost = filteredSupplies.reduce(
      (sum, supply) => sum + supply.total_cost,
      0,
    );
    const currentMonthSupplies = filteredSupplies.filter((supply) => {
      const supplyDate = new Date(supply.delivery_date);
      return (
        supplyDate.getMonth() === currentMonth &&
        supplyDate.getFullYear() === currentYear
      );
    });
    const currentMonthQuantity = currentMonthSupplies.reduce(
      (sum, supply) => sum + supply.quantity_liters,
      0,
    );
    const currentMonthCost = currentMonthSupplies.reduce(
      (sum, supply) => sum + supply.total_cost,
      0,
    );

    // Get latest delivery date
    const latestDelivery =
      filteredSupplies.length > 0
        ? new Date(
            Math.max(
              ...filteredSupplies.map((s) => new Date(s.delivery_date).getTime()),
            ),
          )
        : null;

    // Group statistics by the selected grouping filter
    const groupedStats = filteredSupplies.reduce((acc, supply) => {
      // Determine the group key based on the selected grouping
      let groupKey: string;
      
      if (groupBy === "fuelType") {
        groupKey = supply.tank?.fuel_type || "unknown";
      } else { // groupBy === "tank"
        groupKey = supply.tank?.name || `tank_${supply.tank_id}` || "unknown";
      }
      
      if (!acc[groupKey]) {
        acc[groupKey] = {
          quantity: 0,
          cost: 0,
          count: 0,
          avgPrice: 0,
          fuelType: supply.tank?.fuel_type || "unknown",
          tankId: supply.tank_id,
          tankName: supply.tank?.name,
        };
      }
      
      acc[groupKey].quantity += supply.quantity_liters;
      acc[groupKey].cost += supply.total_cost;
      acc[groupKey].count += 1;
      
      return acc;
    }, {} as Record<string, { 
      quantity: number; 
      cost: number; 
      count: number; 
      avgPrice: number;
      fuelType: string;
      tankId: string;
      tankName?: string;
    }>);
    
    // Calculate average prices
    Object.keys(groupedStats).forEach(key => {
      if (groupedStats[key].quantity > 0) {
        groupedStats[key].avgPrice = groupedStats[key].cost / groupedStats[key].quantity;
      }
    });

    return {
      totalQuantity,
      totalCost,
      currentMonthQuantity,
      currentMonthCost,
      suppliesCount: filteredSupplies.length,
      latestDelivery,
      groupedStats,
      // Keep original fuel type stats for backward compatibility
      fuelTypeStats: groupBy === "fuelType" ? groupedStats : {},
    };
  }, [filteredSupplies, groupBy]);

  // Create metrics for the CardGrid component
  const metrics = useMemo<MetricCardProps[]>(() => {
    if (loading) {
      // Return loading placeholders
      return Array(3).fill({
        title: "Loading...",
        value: "Loading...",
        description: "Loading...",
        loading: true
      });
    }

    // Create time period label for description
    const periodLabel = timePeriod === "all" 
      ? t("common.allTime") 
      : timePeriod === "week" 
        ? t("common.lastWeek")
        : timePeriod === "month"
          ? t("common.lastMonth")
          : timePeriod === "3months"
            ? t("common.last90Days")
            : timePeriod === "6months"
              ? t("common.last6Months")
              : t("common.lastYear");

    return [
      {
        title: t("fuelSupplies.totalSupplies"),
        value: `${formatNumber(summary.totalQuantity)} ${t("common.liters")}`,
        description: t("fuelSupplies.totalCount", { count: summary.suppliesCount }),
        icon: <Fuel className="h-5 w-5" />,
      },
      {
        title: periodLabel,
        value: `${formatNumber(summary.suppliesCount)}`,
        description: t("fuelSupplies.supplies"),
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        title: t("common.totalCost"),
        value: `${formatNumber(summary.totalCost)} ֏`,
        description: `${t("fuelSupplies.avgPricePerLiter")}: ${formatNumber(summary.totalQuantity > 0 ? summary.totalCost / summary.totalQuantity : 0)} ֏`,
        icon: <CircleDollarSign className="h-5 w-5" />,
      },
    ];
  }, [loading, summary, t, timePeriod]);

  // Get color for fuel type
  const getFuelTypeColor = (fuelType: string): string => {
    switch (fuelType.toLowerCase()) {
      case 'petrol':
        return 'bg-green-500';
      case 'diesel':
        return 'bg-yellow-500';
      case 'cng':
        return 'bg-blue-500';
      case 'gas':
        return 'bg-purple-500';
      case 'kerosene':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get translated fuel type name
  const getFuelTypeName = (fuelType: string): string => {
    switch (fuelType.toLowerCase()) {
      case 'petrol':
        return t("common.petrol");
      case 'diesel':
        return t("common.diesel");
      case 'cng':
        return t("common.cng");
      case 'gas':
        return t("common.gas") || "Gas";
      case 'kerosene':
        return t("common.kerosene") || "Kerosene";
      default:
        return t("common.unknown");
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filter controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-2">
        <h2 className="text-xl font-semibold">{t("fuelSupplies.summary")}</h2>
        
        <div className="flex flex-wrap gap-4">
          {/* Time period filter */}
          <div className="flex items-center">
            <Tabs value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
              <TabsList>
                <TabsTrigger value="all">
                  {t("common.allTime")}
                </TabsTrigger>
                <TabsTrigger value="week">
                  {t("common.lastWeek")}
                </TabsTrigger>
                <TabsTrigger value="month">
                  {t("common.lastMonth")} 
                </TabsTrigger>
                <TabsTrigger value="3months">
                  {t("common.last90Days")}
                </TabsTrigger>
                <TabsTrigger value="year">
                  {t("common.lastYear")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Group by filter */}
          <div className="flex items-center gap-2">
            <Select value={groupBy} onValueChange={(value: GroupingFilter) => setGroupBy(value)}>
              <SelectTrigger className="w-[180px]">
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {t("common.groupBy")}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fuelType">{t("common.fuelType")}</SelectItem>
                <SelectItem value="tank">{t("common.tanks")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <CardGrid metrics={metrics} />
      
      {/* Grouped Data Breakdown */}
      {!loading && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            {groupBy === "fuelType" 
              ? t("fuelSupplies.fuelTypeBreakdown") 
              : t("fuelSupplies.tankBreakdown") || "Tank Breakdown"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(summary.groupedStats)
              .sort((a, b) => b[1].quantity - a[1].quantity) // Sort by quantity desc
              .map(([key, stats]) => {
                const colorClass = getFuelTypeColor(stats.fuelType);
                const displayName = groupBy === "fuelType" 
                  ? getFuelTypeName(key)
                  : stats.tankName || `Tank ${key}`;
                
                return (
                  <Card key={key} className="overflow-hidden">
                    <div className={`h-1 w-full ${colorClass}`} />
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center text-base">
                        <span className="truncate" title={displayName}>{displayName}</span>
                        <Badge variant="outline" className="font-normal">
                          {stats.count} {t("common.supplies").toLowerCase() || "supplies"}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex justify-between">
                        <span>{formatNumber(stats.quantity)} {t("common.liters")}</span>
                        {groupBy === "tank" && (
                          <span className="text-xs">{getFuelTypeName(stats.fuelType)}</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("fuelSupplies.avgPricePerLiter")}:</span>
                          <span className="font-medium">{formatNumber(stats.avgPrice)} ֏</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("common.totalCost")}:</span>
                          <span className="font-medium">{formatNumber(stats.cost)} ֏</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className={`${colorClass} h-full`} 
                          style={{ 
                            width: `${(stats.quantity / summary.totalQuantity) * 100}%` 
                          }} 
                        />
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
        </div>
      )}
      
      {/* Loading state for breakdown */}
      {loading && (
        <div className="mt-6">
          <Skeleton className="h-7 w-48 mb-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter className="pt-0">
                  <Skeleton className="h-2 w-full rounded-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
