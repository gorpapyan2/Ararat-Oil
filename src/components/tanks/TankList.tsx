
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FuelTank } from "@/services/supabase";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TankLevelEditor } from "./TankLevelEditor";
import { Button } from "@/components/ui/button";
import { TankHistory } from "./TankHistory";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";

import { InventoryItem } from "@/types";

interface TankListProps {
  tanks: FuelTank[];
  inventory: InventoryItem[];
  isLoading: boolean;
  isEditMode: boolean;
  onEditComplete: () => void;
}

export function TankList({ tanks, inventory, isLoading, isEditMode, onEditComplete }: TankListProps) {
  const [editingTankId, setEditingTankId] = useState<string | null>(null);
  const [selectedTank, setSelectedTank] = useState<FuelTank | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
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

  if (tanks.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No fuel tanks found. Add your first tank to get started.</p>
      </Card>
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
          // Find the latest inventory record for this tank (if any)
          const tankInventory = inventory
            .filter((inv) => inv.tank_id === tank.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

          const fillPercentage = tank.capacity > 0 
            ? Math.min(100, Math.round((tank.current_level / tank.capacity) * 100)) 
            : 0;

          let progressColor = "bg-blue-500";
          if (fillPercentage < 20) progressColor = "bg-red-500";
          else if (fillPercentage < 50) progressColor = "bg-yellow-500";
          else if (fillPercentage > 90) progressColor = "bg-green-500";

          return (
            <Card
              key={tank.id}
              className={`overflow-hidden ${isEditMode ? 'border-blue-400' : 'cursor-pointer transition hover:shadow-lg'}`}
              onClick={() => !isEditMode && handleOpenHistory(tank)}
              tabIndex={!isEditMode ? 0 : undefined}
              aria-label={`View history for ${tank.name}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>{tank.name}</span>
                  <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                    {tank.fuel_type}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Capacity: {tank.capacity} liters</span>
                  <span className="text-sm font-medium">{fillPercentage}%</span>
                </div>
                <Progress 
                  value={fillPercentage} 
                  className="h-3"
                  indicatorClassName={progressColor} 
                />
                <div className="mt-2 text-sm">
                  Current Level: <span className="font-medium">{tank.current_level} liters</span>
                </div>
                {/* Inventory Data Section */}
                <div className="mt-2 text-xs text-muted-foreground">
                  {tankInventory ? (
                    <>
                      <div>Inventory Date: <span className="font-medium">{new Date(tankInventory.date).toLocaleDateString()}</span></div>
                      <div>Opening: {tankInventory.opening_stock}L, Received: {tankInventory.received}L, Sold: {tankInventory.sold}L</div>
                      <div>Closing: <span className="font-semibold">{tankInventory.closing_stock}L</span> @ {tankInventory.unit_price.toLocaleString()} ֏/L</div>
                    </>
                  ) : (
                    <div className="italic text-red-400">No inventory record for this tank</div>
                  )}
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
                        Adjust Level
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
              {selectedTank?.name} History
            </DialogTitle>
          </DialogHeader>
          {selectedTank && (
            <div>
              <div className="mb-2 font-medium text-muted-foreground">
                Fuel Type: <span className="font-semibold">{selectedTank.fuel_type}</span>
              </div>
              <TankHistory tankId={selectedTank.id} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
