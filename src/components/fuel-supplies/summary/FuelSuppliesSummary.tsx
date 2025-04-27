import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    
    const totalQuantity = supplies.reduce((sum, supply) => sum + supply.quantity_liters, 0);
    const totalCost = supplies.reduce((sum, supply) => sum + supply.total_cost, 0);
    const currentMonthSupplies = supplies.filter(supply => {
      const supplyDate = new Date(supply.delivery_date);
      return supplyDate.getMonth() === currentMonth && supplyDate.getFullYear() === currentYear;
    });
    const currentMonthQuantity = currentMonthSupplies.reduce((sum, supply) => sum + supply.quantity_liters, 0);
    const currentMonthCost = currentMonthSupplies.reduce((sum, supply) => sum + supply.total_cost, 0);
    
    // Get latest delivery date
    const latestDelivery = supplies.length > 0 
      ? new Date(Math.max(...supplies.map(s => new Date(s.delivery_date).getTime())))
      : null;

    return {
      totalQuantity,
      totalCost,
      currentMonthQuantity,
      currentMonthCost,
      suppliesCount: supplies.length,
      latestDelivery
    };
  }, [supplies]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fuel Quantity</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalQuantity.toLocaleString()} L</div>
            <p className="text-xs text-muted-foreground">
              {summary.suppliesCount} total supplies
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalCost.toLocaleString()} ֏</div>
            <p className="text-xs text-muted-foreground">
              Average: {summary.suppliesCount > 0 ? (summary.totalCost / summary.suppliesCount).toLocaleString() : 0} ֏ per supply
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.currentMonthQuantity.toLocaleString()} L</div>
            <p className="text-xs text-muted-foreground">
              {summary.currentMonthCost.toLocaleString()} ֏ total cost
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Delivery</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.latestDelivery ? format(summary.latestDelivery, "PP") : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.latestDelivery ? format(summary.latestDelivery, "p") : ""}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
