
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/primitives/badge';
import { Progress } from '@/core/components/ui/primitives/progress';
import { Button } from '@/core/components/ui/primitives/button';
import { 
  Fuel, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Droplets,
  Gauge,
  Plus,
  Settings
} from 'lucide-react';
import { cn } from '@/shared/utils';

// Mock data - in a real app, this would come from your API
const mockTankData = [
  { id: '1', level: 75, capacity: 10000, type: 'Diesel', status: 'Normal' as const },
  { id: '2', level: 30, capacity: 8000, type: 'Gasoline', status: 'Low' as const },
  { id: '3', level: 15, capacity: 12000, type: 'Premium', status: 'Critical' as const },
];

const mockSupplyData = [
  { id: '1', supplier: 'PetroArm', amount: 5000, date: '2024-01-15', type: 'Diesel' },
  { id: '2', supplier: 'ArmenOil', amount: 3000, date: '2024-01-14', type: 'Gasoline' },
  { id: '3', supplier: 'FuelCorp', amount: 2500, date: '2024-01-13', type: 'Premium' },
];

interface TankCardProps {
  tankId: string;
  level: number;
  capacity: number;
  type: string;
  status: 'Normal' | 'Low' | 'Critical';
}

const TankCard: React.FC<TankCardProps> = ({ tankId, level, capacity, type, status }) => {
  const percentage = (level / capacity) * 100;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'destructive';
      case 'Low': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Critical': return <AlertTriangle className="h-4 w-4" />;
      case 'Low': return <TrendingDown className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      status === 'Critical' && "border-destructive",
      status === 'Low' && "border-yellow-500"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Tank {tankId} - {type}
        </CardTitle>
        <Badge variant={getStatusColor(status) as any} className={cn(
          "text-xs",
          status === 'Critical' && "bg-red-100 text-red-800",
          status === 'Low' && "bg-yellow-100 text-yellow-800"
        )}>
          {getStatusIcon(status)}
          <span className="ml-1">{status}</span>
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Level</span>
            <span className="font-medium">{level.toLocaleString()}L</span>
          </div>
          
          <Progress value={percentage} className={cn(
            "h-2",
            status === 'Critical' && "bg-red-100",
            status === 'Low' && "bg-yellow-100"
          )} />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>0L</span>
            <span>{percentage.toFixed(1)}%</span>
            <span>{capacity.toLocaleString()}L</span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Settings className="h-3 w-3 mr-1" />
              Manage
            </Button>
            <Button size="sm" variant="outline">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function FuelManagementDashboardPro() {
  const totalCapacity = mockTankData.reduce((sum, tank) => sum + tank.capacity, 0);
  const totalCurrent = mockTankData.reduce((sum, tank) => sum + tank.level, 0);
  const utilizationRate = (totalCurrent / totalCapacity) * 100;

  const criticalTanks = mockTankData.filter(tank => tank.status === 'Critical').length;
  const lowTanks = mockTankData.filter(tank => tank.status === 'Low').length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity.toLocaleString()}L</div>
            <p className="text-xs text-muted-foreground">
              Across {mockTankData.length} tanks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCurrent.toLocaleString()}L</div>
            <p className="text-xs text-muted-foreground">
              {utilizationRate.toFixed(1)}% utilization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className={cn(
              "h-4 w-4",
              (criticalTanks > 0 || lowTanks > 0) ? "text-red-500" : "text-muted-foreground"
            )} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalTanks + lowTanks}
            </div>
            <p className="text-xs text-muted-foreground">
              {criticalTanks} critical, {lowTanks} low
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tank Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tank Status</h3>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Tank
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockTankData.map((tank) => (
            <TankCard
              key={tank.id}
              tankId={tank.id}
              level={tank.level}
              capacity={tank.capacity}
              type={tank.type}
              status={tank.status}
            />
          ))}
        </div>
      </div>

      {/* Recent Supplies */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Fuel Supplies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSupplyData.map((supply) => (
              <div key={supply.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{supply.supplier}</p>
                  <p className="text-sm text-muted-foreground">{supply.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{supply.amount.toLocaleString()}L</p>
                  <p className="text-sm text-muted-foreground">{supply.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
