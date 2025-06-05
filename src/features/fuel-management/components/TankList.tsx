import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Tank } from "@/core/api/types";
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
import { Fuel, AlertTriangle, CheckCircle, Edit3, Eye, Droplets } from "lucide-react";

interface TankListProps {
  tanks: Tank[];
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
  const [selectedTank, setSelectedTank] = useState<Tank | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent className="pb-4">
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-2 w-full mb-3" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!tanks.length) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <Droplets className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {t("tanks.noTanksFound", "No tanks found")}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {t("tanks.addTankPrompt", "Get started by adding your first fuel storage tank.")}
        </p>
      </div>
    );
  }

  const handleOpenHistory = (tank: Tank) => {
    setSelectedTank(tank);
    setDialogOpen(true);
  };

  const getStatusIcon = (fillPercentage: number, isActive: boolean) => {
    if (!isActive) return <AlertTriangle className="h-3 w-3 text-gray-400" />;
    if (fillPercentage < 20) return <AlertTriangle className="h-3 w-3 text-red-500" />;
    if (fillPercentage > 90) return <AlertTriangle className="h-3 w-3 text-orange-500" />;
    return <CheckCircle className="h-3 w-3 text-green-500" />;
  };

  const getStatusText = (fillPercentage: number, isActive: boolean) => {
    if (!isActive) return { text: t("common.inactive", "Inactive"), color: "text-gray-500" };
    if (fillPercentage < 20) return { text: t("tanks.lowLevel", "Low Level"), color: "text-red-600" };
    if (fillPercentage > 90) return { text: t("tanks.nearFull", "Near Full"), color: "text-orange-600" };
    return { text: t("tanks.normal", "Normal"), color: "text-green-600" };
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
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
          else if (fillPercentage > 90) progressColor = "bg-orange-500";
          else if (fillPercentage > 75) progressColor = "bg-green-500";

          const status = getStatusText(fillPercentage, tank.is_active ?? true);

          return (
            <Card
              key={tank.id}
              className={`overflow-hidden transition-shadow hover:shadow-md ${
                isEditMode 
                  ? "border-blue-400" 
                  : "cursor-pointer"
              }`}
              onClick={() => !isEditMode && handleOpenHistory(tank)}
            >
              {/* Header */}
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-start text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <Fuel className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {tank.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {getStatusIcon(fillPercentage, tank.is_active ?? true)}
                      <span className={`${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                    {typeof tank.fuel_type === "object"
                      ? tank.fuel_type.name
                      : tank.fuel_type}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="pb-4">
                {/* Progress and Info */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{fillPercentage}%</span>
                    <span>{tank.current_level.toLocaleString()} / {tank.capacity.toLocaleString()} L</span>
                  </div>
                  <Progress
                    value={fillPercentage}
                    className="h-2"
                    indicatorClassName={progressColor}
                  />
                </div>

                {/* Action Button */}
                {isEditMode ? (
                  <div>
                    {editingTankId === tank.id ? (
                      <TankLevelEditor
                        tank={tank}
                        onComplete={() => {
                          setEditingTankId(null);
                          onEditComplete();
                        }}
                      />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTankId(tank.id);
                        }}
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        {t("tanks.editLevels", "Edit Level")}
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenHistory(tank);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    {t("common.viewDetails", "View Details")}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog for tank history */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-blue-600" />
              <span>{selectedTank?.name} {t("common.history", "History")}</span>
            </DialogTitle>
          </DialogHeader>
          {selectedTank && (
            <div className="pt-4">
              {/* Tank Info Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t("common.fuelType")}
                  </div>
                  <div className="font-medium text-sm">
                    {typeof selectedTank.fuel_type === "object"
                      ? selectedTank.fuel_type.name
                      : selectedTank.fuel_type}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t("common.capacity")}
                  </div>
                  <div className="font-medium text-sm">
                    {selectedTank.capacity.toLocaleString()} L
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t("common.currentLevel")}
                  </div>
                  <div className="font-medium text-sm">
                    {selectedTank.current_level.toLocaleString()} L
                  </div>
                </div>
              </div>

              <TankHistory tankId={selectedTank.id} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
