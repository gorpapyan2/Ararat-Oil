import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/primitives/card";
import { useTranslation } from "react-i18next";
import type { FuelSale } from "../../types/fuel-sales.types";

interface FuelSalesSummaryProps {
  sales: FuelSale[];
}

export function FuelSalesSummary({ sales }: FuelSalesSummaryProps) {
  const { t } = useTranslation();

  const summary = useMemo(() => {
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalAmount = sales.reduce((sum, sale) => sum + sale.total_sales, 0);
    const averagePrice = totalQuantity > 0 ? totalAmount / totalQuantity : 0;

    return {
      totalQuantity,
      totalAmount,
      averagePrice,
      saleCount: sales.length,
    };
  }, [sales]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('fuel.sales.summary.totalQuantity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalQuantity.toFixed(2)}L</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('fuel.sales.summary.totalAmount')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.totalAmount.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('fuel.sales.summary.averagePrice')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.averagePrice.toFixed(2)}/L</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('fuel.sales.summary.saleCount')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.saleCount}</div>
        </CardContent>
      </Card>
    </div>
  );
} 