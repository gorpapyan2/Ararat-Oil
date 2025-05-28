import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { FuelTank } from "../types/tanks.types";
import { Progress } from "@/core/components/ui/primitives/progress";
import { Skeleton } from "@/core/components/ui/skeleton";
import { TankLevelEditor } from "./TankLevelEditor";
import { Button } from "@/core/components/ui/button";
import { TankHistory } from "./TankHistory";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/core/components/ui/dialog";

interface TankListProps {
  tanks: FuelTank[];
  isLoading: boolean;
  isEditMode: boolean;
  onEditComplete: () => void;
}

export function TankList({
  tanks,
  isLoading,
  isEditMode,
  onEditComplete,
}: TankListProps) {
  const { t } = useTranslation();
  const [editingTankId, setEditingTankId] = useState<string | null>(null);
  const [selectedTank, setSelectedTank] = useState<FuelTank | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!tanks.length) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium">{t("tanks.noTanksFound")}</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {t("tanks.addTankPrompt")}
        </p>
      </div>
    );
  }

  const handleOpenHistory = (tank: FuelTank) => {
    setSelectedTank(tank);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tanks.map((tank) => {
          const fillPercentage =
            tank.capacity > 0
              ? Math.min(
                  100,
                  Math.round((tank.current_level / tank.capacity) * 100)
                )
              : 0;

          let progressColor = "bg-blue-500";
          if (fillPercentage < 20) progressColor = "bg-red-500";
          else if (fillPercentage < 50) progressColor = "bg-yellow-500";
          else if (fillPercentage > 90) progressColor = "bg-green-500";

          return (
            <Card
              key={tank.id}
              className={`overflow-hidden ${isEditMode ? "border-blue-400" : "cursor-pointer transition hover:shadow-lg"}`}
              onClick={() => !isEditMode && handleOpenHistory(tank)}
              tabIndex={!isEditMode ? 0 : undefined}
              aria-label={`${t("common.viewDetails")} ${tank.name}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>{tank.name}</span>
                  <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                    {typeof tank.fuel_type === "object"
                      ? tank.fuel_type.name
                      : tank.fuel_type}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("common.capacity")}: {tank.capacity} {t("common.liters")}
                  </span>
                  <span className="text-sm font-medium">{fillPercentage}%</span>
                </div>
                <Progress
                  value={fillPercentage}
                  className="h-3"
                  indicatorClassName={progressColor}
                />
                <div className="mt-2 text-sm">
                  {t("common.currentLevel")}:{" "}
                  <span className="font-medium">
                    {tank.current_level} {t("common.liters")}
                  </span>
                </div>

                {isEditMode && (
                  <div className="mt-4">
                    {editingTankId === tank.id ? (
                      <TankLevelEditor
                        tank={tank}
                        onComplete={() => {
                          setEditingTankId(null);
                          if (!isEditMode) onEditComplete();
                        }}
                      />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTankId(tank.id);
                        }}
                      >
                        {t("tanks.editLevels")}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog for tank history */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTank?.name} {t("common.history")}
            </DialogTitle>
          </DialogHeader>
          {selectedTank && (
            <div>
              <div className="mb-2 font-medium text-muted-foreground">
                {t("common.fuelType")}:{" "}
                <span className="font-semibold">
                  {typeof selectedTank.fuel_type === "object"
                    ? selectedTank.fuel_type.name
                    : selectedTank.fuel_type}
                </span>
              </div>
              <TankHistory tankId={selectedTank.id} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
