import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Progress } from "@/core/components/ui/primitives/progress";
import { Badge } from "@/core/components/ui/badge";
import type { FuelTank } from "../types/fuel.types";

interface FuelTankCardProps {
  tank: FuelTank;
}

export function FuelTankCard({ tank }: FuelTankCardProps) {
  const { t } = useTranslation();
  const fillPercentage = (tank.current_level / tank.capacity) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{tank.name}</span>
          <Badge variant={tank.status === "active" ? "default" : "secondary"}>
            {t(`fuel.tank.status.${tank.status}`)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t("fuel.tank.capacity")}</span>
              <span>{tank.capacity}L</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t("fuel.tank.currentLevel")}</span>
              <span>{tank.current_level}L</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("fuel.tank.fillLevel")}</span>
              <span>{fillPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={fillPercentage} />
          </div>
          <div className="text-sm text-muted-foreground">
            {t("fuel.tank.fuelType")}: {t(`fuel.types.${tank.fuel_type}`)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
