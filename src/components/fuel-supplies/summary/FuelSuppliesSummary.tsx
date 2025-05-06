import { useMemo } from "react";
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
import { format } from "date-fns";
import { 
  TrendingUp, 
  DollarSign, 
  Droplet, 
  Calendar, 
  Fuel, 
  CircleDollarSign,
  GasPump
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

interface FuelSuppliesSummaryProps {
  supplies: FuelSupply[];
  loading?: boolean;
  className?: string;
}

// Helper function to format numbers
const formatNumber = (num: number): string => {
  return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

export function FuelSuppliesSummary({ supplies, loading, className }: FuelSuppliesSummaryProps) {
  const { t } = useTranslation();
  
  const summary = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const totalQuantity = supplies.reduce(
      (sum, supply) => sum + supply.quantity_liters,
      0,
    );
    const totalCost = supplies.reduce(
      (sum, supply) => sum + supply.total_cost,
      0,
    );
    const currentMonthSupplies = supplies.filter((supply) => {
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
      supplies.length > 0
        ? new Date(
            Math.max(
              ...supplies.map((s) => new Date(s.delivery_date).getTime()),
            ),
          )
        : null;

    // Group statistics by fuel type
    const fuelTypeStats = supplies.reduce((acc, supply) => {
      const fuelType = supply.tank?.fuel_type || "unknown";
      
      if (!acc[fuelType]) {
        acc[fuelType] = {
          quantity: 0,
          cost: 0,
          count: 0,
          avgPrice: 0,
        };
      }
      
      acc[fuelType].quantity += supply.quantity_liters;
      acc[fuelType].cost += supply.total_cost;
      acc[fuelType].count += 1;
      
      return acc;
    }, {} as Record<string, { quantity: number; cost: number; count: number; avgPrice: number }>);
    
    // Calculate average prices
    Object.keys(fuelTypeStats).forEach(type => {
      if (fuelTypeStats[type].quantity > 0) {
        fuelTypeStats[type].avgPrice = fuelTypeStats[type].cost / fuelTypeStats[type].quantity;
      }
    });

    return {
      totalQuantity,
      totalCost,
      currentMonthQuantity,
      currentMonthCost,
      suppliesCount: supplies.length,
      latestDelivery,
      fuelTypeStats,
    };
  }, [supplies]);

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

    return [
      {
        title: t("fuelSupplies.totalSupplies"),
        value: `${formatNumber(summary.totalQuantity)} ${t("common.liters")}`,
        description: t("fuelSupplies.totalCount", { count: summary.suppliesCount }),
        icon: <Fuel className="h-5 w-5" />,
      },
      {
        title: t("fuelSupplies.thisMonth"),
        value: `${formatNumber(summary.currentMonthQuantity)} ${t("common.liters")}`,
        description: t("fuelSupplies.totalLiters"),
        icon: <TrendingUp className="h-5 w-5" />,
      },
      {
        title: t("common.totalCost"),
        value: `${formatNumber(summary.totalCost)} ֏`,
        description: `${formatNumber(summary.currentMonthCost)} ֏ ${t("common.thisMonth").toLowerCase()}`,
        icon: <CircleDollarSign className="h-5 w-5" />,
      },
    ];
  }, [loading, summary, t]);

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
      <CardGrid metrics={metrics} />
      
      {/* Fuel Type Breakdown */}
      {!loading && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">{t("fuelSupplies.fuelTypeBreakdown") || "Fuel Type Breakdown"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.keys(summary.fuelTypeStats).map((fuelType) => {
              const stats = summary.fuelTypeStats[fuelType];
              const colorClass = getFuelTypeColor(fuelType);
              
              return (
                <Card key={fuelType} className="overflow-hidden">
                  <div className={`h-1 w-full ${colorClass}`} />
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center text-base">
                      <span>{getFuelTypeName(fuelType)}</span>
                      <Badge variant="outline" className="font-normal">
                        {stats.count} {t("common.supplies").toLowerCase() || "supplies"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {formatNumber(stats.quantity)} {t("common.liters")}
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
      
      {/* Loading state for fuel type breakdown */}
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
