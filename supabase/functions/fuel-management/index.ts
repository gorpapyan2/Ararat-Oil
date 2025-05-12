import { createServiceClient, getUserFromRequest } from '../_shared/database.ts';
import { 
  handleCors, 
  successResponse, 
  errorResponse, 
  methodNotAllowed,
  unauthorized,
  parseRequestBody,
  getUrlParams
} from '../_shared/api.ts';
import { FuelTank, FuelType, FuelSupply, FillingSystem } from '../_shared/types.ts';

// Types for better type safety
interface FuelManagementSummary {
  tanks: {
    total: number;
    byType: Record<FuelType, number>;
    totalCapacity: number;
    totalCurrentLevel: number;
    utilizationRate: number;
    list: Array<{
      id: string;
      name: string;
      fuel_type: FuelType;
      capacity: number;
      current_level: number;
      utilization_rate: number;
    }>;
  };
  supplies: {
    total: number;
    totalQuantity: number;
    totalCost: number;
    averagePrice: number;
    byType: Record<FuelType, {
      quantity: number;
      cost: number;
      averagePrice: number;
    }>;
  };
  systems: {
    total: number;
    active: number;
    byTank: Record<string, number>;
    list: Array<{
      id: string;
      tank_id: string;
      tank_name: string;
      status: string;
    }>;
  };
  recentActivity: {
    supplies: FuelSupply[];
    levelChanges: Array<{
      tank_id: string;
      tank_name: string;
      change_amount: number;
      previous_level: number;
      new_level: number;
      change_type: "add" | "subtract";
      created_at: string;
    }>;
  };
  trends: {
    dailyConsumption: Array<{
      date: string;
      quantity: number;
      cost: number;
    }>;
    tankUtilization: Array<{
      tank_id: string;
      tank_name: string;
      utilization_rate: number;
      trend: "up" | "down" | "stable";
    }>;
  };
}

interface FuelManagementFilters {
  startDate?: string;
  endDate?: string;
  tankId?: string;
  fuelType?: FuelType;
}

console.info('Fuel Management Edge Function started');

// Handle fuel management operations
Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.replace('/fuel-management', '');

  // Authentication check
  const user = await getUserFromRequest(req);
  if (!user) {
    return unauthorized();
  }

  try {
    // Route handling
    if (req.method === 'GET' || req.method === 'POST') {
      if (path === '' || path === '/') {
        let filters: FuelManagementFilters = {};
        
        if (req.method === 'GET') {
          const params = getUrlParams(req);
          filters = {
            startDate: params.get('start_date') || undefined,
            endDate: params.get('end_date') || undefined,
            tankId: params.get('tank_id') || undefined,
            fuelType: params.get('fuel_type') as FuelType || undefined
          };
        } else {
          // Handle POST request
          const body = await parseRequestBody(req);
          if (body && typeof body === 'object' && 'filters' in body) {
            filters = body.filters as FuelManagementFilters;
          }
        }
        
        return await getFuelManagementSummary(filters);
      }
    }
  } catch (error) {
    console.error('Fuel Management function error:', error);
    return errorResponse(error);
  }

  return methodNotAllowed();
});

/**
 * Get comprehensive fuel management summary
 */
async function getFuelManagementSummary(filters: FuelManagementFilters): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Fetch all tanks with their details, filter by fuelType if provided
    let tanksQuery = supabase.from("fuel_tanks").select("*");
    if (filters.fuelType) {
      tanksQuery = tanksQuery.eq("fuel_type", filters.fuelType);
    }
    const { data: tanks, error: tanksError } = await tanksQuery;
    if (tanksError) throw tanksError;

    // Fetch all filling systems with tank names, filter by fuelType if provided
    let systemsQuery = supabase
      .from("filling_systems")
      .select(`*, tank:fuel_tanks(name, fuel_type)`);
    if (filters.fuelType) {
      systemsQuery = systemsQuery.eq("tank.fuel_type", filters.fuelType);
    }
    const { data: systems, error: systemsError } = await systemsQuery;
    if (systemsError) throw systemsError;

    // Fetch recent fuel supplies with filtering
    let suppliesQuery = supabase
      .from("fuel_supplies")
      .select("*, tank:fuel_tanks(fuel_type)")
      .order("delivery_date", { ascending: false })
      .limit(10);
    if (filters.startDate) {
      suppliesQuery = suppliesQuery.gte("delivery_date", filters.startDate);
    }
    if (filters.endDate) {
      suppliesQuery = suppliesQuery.lte("delivery_date", filters.endDate);
    }
    if (filters.tankId) {
      suppliesQuery = suppliesQuery.eq("tank_id", filters.tankId);
    }
    if (filters.fuelType) {
      suppliesQuery = suppliesQuery.eq("tank.fuel_type", filters.fuelType);
    }
    const { data: supplies, error: suppliesError } = await suppliesQuery;
    if (suppliesError) throw suppliesError;

    // Fetch recent tank level changes, filter by tankId and fuelType if provided
    let levelChangesQuery = supabase
      .from("tank_level_changes")
      .select(`*, tank:fuel_tanks(name, fuel_type)`)
      .order("created_at", { ascending: false })
      .limit(10);
    if (filters.tankId) {
      levelChangesQuery = levelChangesQuery.eq("tank_id", filters.tankId);
    }
    if (filters.fuelType) {
      levelChangesQuery = levelChangesQuery.eq("tank.fuel_type", filters.fuelType);
    }
    const { data: levelChanges, error: levelChangesError } = await levelChangesQuery;
    if (levelChangesError) throw levelChangesError;

    // Calculate tank statistics
    const tankStats = tanks.reduce((acc, tank) => {
      acc.total++;
      acc.byType[tank.fuel_type] = (acc.byType[tank.fuel_type] || 0) + 1;
      acc.totalCapacity += tank.capacity;
      acc.totalCurrentLevel += tank.current_level;
      acc.list.push({
        id: tank.id,
        name: tank.name,
        fuel_type: tank.fuel_type,
        capacity: tank.capacity,
        current_level: tank.current_level,
        utilization_rate: (tank.current_level / tank.capacity) * 100
      });
      return acc;
    }, {
      total: 0,
      byType: {} as Record<FuelType, number>,
      totalCapacity: 0,
      totalCurrentLevel: 0,
      list: [] as Array<{
        id: string;
        name: string;
        fuel_type: FuelType;
        capacity: number;
        current_level: number;
        utilization_rate: number;
      }>
    });

    // Calculate supply statistics
    const supplyStats = supplies.reduce((acc, supply) => {
      const fuelType = supply.tank?.fuel_type || supply.fuel_type;
      acc.total++;
      acc.totalQuantity += supply.quantity_liters;
      acc.totalCost += supply.total_cost;
      
      // Calculate by type
      if (!acc.byType[fuelType]) {
        acc.byType[fuelType] = {
          quantity: 0,
          cost: 0,
          averagePrice: 0
        };
      }
      
      acc.byType[fuelType].quantity += supply.quantity_liters;
      acc.byType[fuelType].cost += supply.total_cost;
      acc.byType[fuelType].averagePrice = 
        acc.byType[fuelType].cost / acc.byType[fuelType].quantity;
      
      return acc;
    }, {
      total: 0,
      totalQuantity: 0,
      totalCost: 0,
      averagePrice: 0,
      byType: {} as Record<FuelType, {
        quantity: number;
        cost: number;
        averagePrice: number;
      }>
    });

    // Calculate system statistics
    const systemStats = systems.reduce((acc, system) => {
      acc.total++;
      acc.byTank[system.tank_id] = (acc.byTank[system.tank_id] || 0) + 1;
      acc.list.push({
        id: system.id,
        tank_id: system.tank_id,
        tank_name: system.tank.name,
        status: system.status
      });
      return acc;
    }, {
      total: 0,
      active: systems.length,
      byTank: {} as Record<string, number>,
      list: [] as Array<{
        id: string;
        tank_id: string;
        tank_name: string;
        status: string;
      }>
    });

    // Calculate daily consumption trends
    const dailyConsumption = supplies.reduce((acc, supply) => {
      const date = supply.delivery_date.split('T')[0];
      if (!acc[date]) {
        acc[date] = { quantity: 0, cost: 0 };
      }
      acc[date].quantity += supply.quantity_liters;
      acc[date].cost += supply.total_cost;
      return acc;
    }, {} as Record<string, { quantity: number; cost: number }>);

    // Calculate tank utilization trends
    const tankUtilization = tankStats.list.map(tank => {
      const recentChanges = levelChanges
        .filter(change => change.tank_id === tank.id)
        .slice(0, 2);
      
      let trend: "up" | "down" | "stable" = "stable";
      if (recentChanges.length >= 2) {
        const diff = recentChanges[0].new_level - recentChanges[1].new_level;
        trend = diff > 0 ? "up" : diff < 0 ? "down" : "stable";
      }

      return {
        tank_id: tank.id,
        tank_name: tank.name,
        utilization_rate: tank.utilization_rate,
        trend
      };
    });

    // Prepare the summary response
    const summary: FuelManagementSummary = {
      tanks: {
        ...tankStats,
        utilizationRate: tankStats.totalCapacity > 0 
          ? (tankStats.totalCurrentLevel / tankStats.totalCapacity) * 100 
          : 0
      },
      supplies: {
        ...supplyStats,
        averagePrice: supplyStats.totalQuantity > 0 
          ? supplyStats.totalCost / supplyStats.totalQuantity 
          : 0
      },
      systems: systemStats,
      recentActivity: {
        supplies: supplies || [],
        levelChanges: levelChanges.map(change => ({
          ...change,
          tank_name: change.tank.name
        }))
      },
      trends: {
        dailyConsumption: Object.entries(dailyConsumption)
          .map(([date, data]) => ({
            date,
            quantity: data.quantity,
            cost: data.cost
          }))
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 7), // Last 7 days
        tankUtilization
      }
    };

    return successResponse(summary);
  } catch (error) {
    console.error('Error fetching fuel management summary:', error);
    return errorResponse(error);
  }
} 