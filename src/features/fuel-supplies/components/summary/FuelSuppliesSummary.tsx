import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { FuelSupply } from "../../types/fuel-supplies.types";

interface FuelSuppliesSummaryProps {
  supplies: FuelSupply[];
}

export function FuelSuppliesSummary({ supplies }: FuelSuppliesSummaryProps) {
  const { t } = useTranslation();

  const summary = useMemo(() => {
    const totalQuantity = supplies.reduce((sum, supply) => sum + supply.quantity_liters, 0);
    const totalCost = supplies.reduce((sum, supply) => sum + supply.total_cost, 0);
    const averagePrice = totalQuantity > 0 ? totalCost / totalQuantity : 0;

    return {
      totalQuantity,
      totalCost,
      averagePrice,
      supplyCount: supplies.length,
    };
  }, [supplies]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('fuel.supplies.summary.totalQuantity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalQuantity.toFixed(2)}L</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('fuel.supplies.summary.totalCost')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.totalCost.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('fuel.supplies.summary.averagePrice')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.averagePrice.toFixed(2)}/L</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('fuel.supplies.summary.supplyCount')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.supplyCount}</div>
        </CardContent>
      </Card>
    </div>
  );
} 