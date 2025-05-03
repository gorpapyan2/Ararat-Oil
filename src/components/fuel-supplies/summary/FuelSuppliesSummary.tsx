import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardGrid } from "@/components/ui/composed/cards";
import { FuelSupply } from "@/types";
import { format } from "date-fns";
import { TrendingUp, DollarSign, Droplet, Calendar } from "lucide-react";

interface FuelSuppliesSummaryProps {
  supplies: FuelSupply[];
}

export function FuelSuppliesSummary({ supplies }: FuelSuppliesSummaryProps) {
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

  const metrics = [
    { title: 'Total Fuel Quantity', value: `${summary.totalQuantity.toLocaleString()} L`, description: `${summary.suppliesCount} total supplies`, icon: Droplet },
    { title: 'Total Cost', value: `${summary.totalCost.toLocaleString()} ֏`, description: `Average: ${summary.suppliesCount > 0 ? (summary.totalCost / summary.suppliesCount).toLocaleString() : 0} ֏ per supply`, icon: DollarSign },
    { title: 'Current Month', value: `${summary.currentMonthQuantity.toLocaleString()} L`, description: `${summary.currentMonthCost.toLocaleString()} ֏ total cost`, icon: TrendingUp },
    { title: 'Latest Delivery', value: summary.latestDelivery ? format(summary.latestDelivery, 'PP') : 'N/A', description: summary.latestDelivery ? format(summary.latestDelivery, 'p') : '', icon: Calendar },
  ];
  return <CardGrid metrics={metrics} />;
}
