import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { useTranslation } from "react-i18next";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { Progress } from "@/core/components/ui/primitives/progress";
import { Badge } from "@/core/components/ui/badge";

// Simple fuel type mapping for display purposes
const getFuelTypeName = (fuelTypeId: string): string => {
  const fuelTypeMap: Record<string, string> = {
    'gasoline-95': 'Gasoline 95',
    'gasoline-98': 'Gasoline 98',
    'diesel': 'Diesel',
    'premium': 'Premium',
  };
  return fuelTypeMap[fuelTypeId] || `Fuel Type ${fuelTypeId.slice(0, 8)}...`;
};

export function FuelLevelVisualizationStandardized() {
  const { t } = useTranslation();
  const { data: dashboardData, isLoading: isLoadingTankLevels } = useDashboard();

  if (isLoadingTankLevels) {
    return <div>{t("common.loading")}</div>;
  }

  const tankLevels = dashboardData?.tanks || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.fuelLevels")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tankLevels.map((tank) => {
          // Calculate percentage for the progress bar
          const percentage = (tank.current_level / tank.capacity) * 100;
          // Determine status based on percentage
          let status: "low" | "medium" | "high" = "medium";
          let statusColor = "";

          if (percentage < 20) {
            status = "low";
            statusColor = "text-red-500";
          } else if (percentage >= 80) {
            status = "high";
            statusColor = "text-green-500";
          }

          return (
            <div key={tank.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{getFuelTypeName(tank.fuel_type_id)}</p>
                  <p className="text-sm text-muted-foreground">
                    {tank.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {tank.current_level.toLocaleString()} L
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      / {tank.capacity.toLocaleString()} L
                    </span>
                  </p>
                  <Badge
                    variant={
                      status === "low"
                        ? "destructive"
                        : status === "high"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <Progress
                value={percentage}
                className={
                  status === "low"
                    ? "bg-red-100"
                    : status === "high"
                      ? "bg-green-100"
                      : "bg-gray-100"
                }
              />
            </div>
          );
        })}

        {tankLevels.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              {t("dashboard.noTanksAvailable")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
