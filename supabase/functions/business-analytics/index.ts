import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface BusinessMetrics {
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    change_percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
  fuel: {
    sold_today: number;
    inventory_level: number;
    tank_utilization: number;
    supply_efficiency: number;
  };
  customers: {
    active_today: number;
    total_registered: number;
    retention_rate: number;
    satisfaction_score: number;
  };
  operations: {
    efficiency_percentage: number;
    uptime_percentage: number;
    error_rate: number;
    response_time: number;
  };
}

interface QuickActionData {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  count?: number;
  urgency?: boolean;
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'supply' | 'employee' | 'system' | 'maintenance';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  user_id?: string;
  metadata?: Record<string, any>;
}

interface SystemHealth {
  database_performance: number;
  api_response_time: number;
  system_uptime: number;
  memory_usage: number;
  disk_usage: number;
  active_connections: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();
    
    switch (endpoint) {
      case 'metrics':
        return await getBusinessMetrics(req);
      case 'quick-actions':
        return await getQuickActions(req);
      case 'recent-activity':
        return await getRecentActivity(req);
      case 'system-health':
        return await getSystemHealth(req);
      case 'analytics-summary':
        return await getAnalyticsSummary(req);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }
  } catch (error) {
    console.error('Business Analytics Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function getBusinessMetrics(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const timeframe = url.searchParams.get('timeframe') || 'today';
  const userId = req.headers.get('user-id');

  // Simulate business metrics calculation
  // In production, this would query your database
  const metrics: BusinessMetrics = {
    revenue: {
      daily: 1234567,
      weekly: 8641969,
      monthly: 37082956,
      yearly: 444995472,
      change_percentage: 12.5,
      trend: 'up'
    },
    fuel: {
      sold_today: 45678,
      inventory_level: 84320,
      tank_utilization: 68.7,
      supply_efficiency: 94.2
    },
    customers: {
      active_today: 1847,
      total_registered: 25693,
      retention_rate: 87.3,
      satisfaction_score: 4.6
    },
    operations: {
      efficiency_percentage: 94.2,
      uptime_percentage: 99.9,
      error_rate: 0.1,
      response_time: 120
    }
  };

  return new Response(
    JSON.stringify({
      success: true,
      data: metrics,
      timeframe,
      generated_at: new Date().toISOString()
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function getQuickActions(req: Request): Promise<Response> {
  const userId = req.headers.get('user-id');
  
  // Generate contextual quick actions based on business state
  const quickActions: QuickActionData[] = [
    {
      id: 'add_employee',
      title: 'Add Employee',
      description: 'Register new team member',
      path: '/employees',
      icon: 'Users',
      priority: 'high',
      count: 3,
      urgency: false
    },
    {
      id: 'fuel_supply',
      title: 'Record Fuel Supply',
      description: 'Log new fuel delivery',
      path: '/fuel-management/supplies',
      icon: 'Plus',
      priority: 'high',
      urgency: true
    },
    {
      id: 'low_inventory_alert',
      title: 'Low Inventory Alert',
      description: 'Tank #1 needs refilling',
      path: '/fuel-management/tanks',
      icon: 'AlertTriangle',
      priority: 'high',
      urgency: true
    },
    {
      id: 'generate_report',
      title: 'Generate Report',
      description: 'Create business reports',
      path: '/reports',
      icon: 'BarChart3',
      priority: 'medium'
    },
    {
      id: 'system_settings',
      title: 'System Settings',
      description: 'Configure application',
      path: '/settings',
      icon: 'Settings',
      priority: 'low'
    }
  ];

  return new Response(
    JSON.stringify({
      success: true,
      data: quickActions,
      count: quickActions.length
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function getRecentActivity(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const userId = req.headers.get('user-id');

  // Simulate recent activity data
  const activities: RecentActivity[] = [
    {
      id: 'act_001',
      type: 'sale',
      title: 'Fuel Sale Completed',
      description: 'Customer purchased 50L of Premium fuel',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: 'success',
      metadata: { amount: 50, fuel_type: 'premium', pump: 3 }
    },
    {
      id: 'act_002',
      type: 'supply',
      title: 'Fuel Delivery Received',
      description: 'Tank #3 refilled with 5000L of Regular fuel',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'info',
      metadata: { tank_id: 3, volume: 5000, fuel_type: 'regular' }
    },
    {
      id: 'act_003',
      type: 'employee',
      title: 'Shift Change',
      description: 'Evening shift started with 3 employees',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: 'info',
      metadata: { shift: 'evening', employee_count: 3 }
    },
    {
      id: 'act_004',
      type: 'system',
      title: 'Low Fuel Alert',
      description: 'Tank #1 fuel level below 10%',
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      status: 'warning',
      metadata: { tank_id: 1, level: 8.5, threshold: 10 }
    },
    {
      id: 'act_005',
      type: 'maintenance',
      title: 'Pump Maintenance',
      description: 'Pump #2 scheduled for maintenance',
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      status: 'warning',
      metadata: { pump_id: 2, maintenance_type: 'scheduled' }
    }
  ];

  return new Response(
    JSON.stringify({
      success: true,
      data: activities.slice(0, limit),
      count: activities.length,
      limit
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function getSystemHealth(req: Request): Promise<Response> {
  // Simulate system health metrics
  const health: SystemHealth = {
    database_performance: 98.2,
    api_response_time: 95.7,
    system_uptime: 99.9,
    memory_usage: 67.3,
    disk_usage: 45.8,
    active_connections: 42
  };

  // Determine overall health status
  const avgHealth = Object.values(health).reduce((sum, val) => sum + val, 0) / Object.values(health).length;
  const status = avgHealth >= 95 ? 'excellent' : avgHealth >= 80 ? 'good' : avgHealth >= 60 ? 'fair' : 'poor';

  return new Response(
    JSON.stringify({
      success: true,
      data: health,
      overall_status: status,
      overall_score: Math.round(avgHealth),
      timestamp: new Date().toISOString()
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function getAnalyticsSummary(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const period = url.searchParams.get('period') || '24h';
  
  // Comprehensive analytics summary
  const summary = {
    overview: {
      total_revenue: 1234567,
      total_transactions: 342,
      fuel_sold: 45678,
      active_customers: 1847,
      efficiency_score: 94.2
    },
    trends: {
      revenue_trend: 12.5,
      sales_trend: -3.2,
      customer_trend: 8.1,
      efficiency_trend: 2.1
    },
    alerts: {
      critical: 1,
      warnings: 3,
      info: 2
    },
    forecasts: {
      next_week_revenue: 1456789,
      fuel_needed: 15000,
      maintenance_due: 2
    },
    performance: {
      best_performing_pump: 3,
      peak_hours: '14:00-16:00',
      busiest_day: 'Friday',
      average_transaction: 365.5
    }
  };

  return new Response(
    JSON.stringify({
      success: true,
      data: summary,
      period,
      generated_at: new Date().toISOString()
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
} 