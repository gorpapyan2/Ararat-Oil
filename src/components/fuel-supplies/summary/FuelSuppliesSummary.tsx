import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardGrid, MetricCardProps } from "@/components/ui/composed/cards";
import { FuelSupply } from "@/types";
import { format } from "date-fns";
import { TrendingUp, DollarSign, Droplet, Calendar, Fuel, CircleDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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

    return {
      totalQuantity,
      totalCost,
      currentMonthQuantity,
      currentMonthCost,
      suppliesCount: supplies.length,
      latestDelivery,
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
        title: "Total Fuel",
        value: `${formatNumber(summary.totalQuantity)} L`,
        description: `${formatNumber(summary.suppliesCount)} fuel deliveries`,
        icon: <Fuel className="h-5 w-5" />,
      },
      {
        title: "Monthly Fuel",
        value: `${formatNumber(summary.currentMonthQuantity)} L`,
        description: "Delivered this month",
        icon: <TrendingUp className="h-5 w-5" />,
      },
      {
        title: "Total Cost",
        value: `${formatNumber(summary.totalCost)} ֏`,
        description: `${formatNumber(summary.currentMonthCost)} ֏ this month`,
        icon: <CircleDollarSign className="h-5 w-5" />,
      },
    ];
  }, [loading, summary]);

  return (
    <div className={cn("", className)}>
      <CardGrid metrics={metrics} />
    </div>
  );
}
