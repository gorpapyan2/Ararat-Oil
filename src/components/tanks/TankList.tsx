
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FuelTank } from "@/services/supabase";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TankLevelEditor } from "./TankLevelEditor";
import { Button } from "@/components/ui/button";
import { TankHistory } from "./TankHistory";

interface TankListProps {
  tanks: FuelTank[];
  isLoading: boolean;
  isEditMode: boolean;
  onEditComplete: () => void;
}

export function TankList({ tanks, isLoading, isEditMode, onEditComplete }: TankListProps) {
  const [editingTankId, setEditingTankId] = useState<string | null>(null);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tanks.map((tank) => {
        const fillPercentage = tank.capacity > 0 
          ? Math.min(100, Math.round((tank.current_level / tank.capacity) * 100)) 
          : 0;
        
        let progressColor = "bg-blue-500";
        if (fillPercentage < 20) progressColor = "bg-red-500";
        else if (fillPercentage < 50) progressColor = "bg-yellow-500";
        else if (fillPercentage > 90) progressColor = "bg-green-500";
        
        return (
          <Card key={tank.id} className={`overflow-hidden ${isEditMode ? 'border-blue-400' : ''}`}>
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
                      onClick={() => setEditingTankId(tank.id)}
                    >
                      Adjust Level
                    </Button>
                  )}
                </div>
              )}

              {/* Show tank history below the tank info */}
              <div className="mt-6">
                <TankHistory tankId={tank.id} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
