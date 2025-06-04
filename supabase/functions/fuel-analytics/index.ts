import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCors } from '../_shared/cors.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FuelRequest {
  action: string;
  tank_id?: string;
  fuel_type?: string;
  date_range?: {
    start: string;
    end: string;
  };
}

interface FuelMetrics {
  total_tanks: number;
  total_capacity: number;
  current_total: number;
  daily_sales: number;
  weekly_revenue: number;
  monthly_revenue: number;
  low_level_alerts: number;
  fuel_efficiency: number;
  average_price: number;
  tanks_by_status: {
    normal: number;
    low: number;
    critical: number;
    maintenance: number;
  };
  consumption_trend: number;
  profit_margin: number;
}

interface FuelPrice {
  fuel_type: string;
  current_price: number;
  previous_price: number;
  change_percentage: number;
  last_updated: string;
  market_price: number;
  profit_margin: number;
}

interface FuelAnalytics {
  daily_consumption: Array<{
    date: string;
    gasoline: number;
    diesel: number;
    premium: number;
    total: number;
  }>;
  tank_efficiency: Array<{
    tank_id: string;
    tank_name: string;
    efficiency_score: number;
    uptime: number;
    maintenance_cost: number;
  }>;
  sales_by_fuel_type: Array<{
    fuel_type: string;
    volume: number;
    revenue: number;
    profit: number;
  }>;
  peak_hours: Array<{
    hour: number;
    volume: number;
    revenue: number;
  }>;
}

// Mock data generators for development
function generateFuelMetrics(): FuelMetrics {
  return {
    total_tanks: 6,
    total_capacity: 45000,
    current_total: 32400,
    daily_sales: 2800,
    weekly_revenue: 28650,
    monthly_revenue: 125400,
    low_level_alerts: 2,
    fuel_efficiency: 94.5,
    average_price: 1.35,
    tanks_by_status: {
      normal: 3,
      low: 2,
      critical: 1,
      maintenance: 0
    },
    consumption_trend: 8.5,
    profit_margin: 15.8
  };
}

function generateFuelPrices(): FuelPrice[] {
  return [
    {
      fuel_type: 'gasoline',
      current_price: 1.32,
      previous_price: 1.28,
      change_percentage: 3.1,
      last_updated: new Date().toISOString(),
      market_price: 1.25,
      profit_margin: 5.6
    },
    {
      fuel_type: 'diesel',
      current_price: 1.45,
      previous_price: 1.42,
      change_percentage: 2.1,
      last_updated: new Date().toISOString(),
      market_price: 1.38,
      profit_margin: 5.1
    },
    {
      fuel_type: 'premium',
      current_price: 1.48,
      previous_price: 1.46,
      change_percentage: 1.4,
      last_updated: new Date().toISOString(),
      market_price: 1.40,
      profit_margin: 5.7
    }
  ];
}

function generateFuelAnalytics(): FuelAnalytics {
  const now = new Date();
  const dailyData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    dailyData.push({
      date: date.toISOString().split('T')[0],
      gasoline: Math.floor(Math.random() * 1500) + 800,
      diesel: Math.floor(Math.random() * 800) + 400,
      premium: Math.floor(Math.random() * 600) + 200,
      total: Math.floor(Math.random() * 2800) + 1500
    });
  }

  return {
    daily_consumption: dailyData,
    tank_efficiency: [
      {
        tank_id: '1',
        tank_name: 'Tank A - Gasoline',
        efficiency_score: 96.5,
        uptime: 99.2,
        maintenance_cost: 450
      },
      {
        tank_id: '2',
        tank_name: 'Tank B - Diesel',
        efficiency_score: 94.8,
        uptime: 98.7,
        maintenance_cost: 520
      },
      {
        tank_id: '3',
        tank_name: 'Tank C - Premium',
        efficiency_score: 97.2,
        uptime: 99.5,
        maintenance_cost: 380
      }
    ],
    sales_by_fuel_type: [
      {
        fuel_type: 'gasoline',
        volume: 8500,
        revenue: 11220,
        profit: 1683
      },
      {
        fuel_type: 'diesel',
        volume: 4200,
        revenue: 6090,
        profit: 945
      },
      {
        fuel_type: 'premium',
        volume: 2100,
        revenue: 3108,
        profit: 498
      }
    ],
    peak_hours: [
      { hour: 7, volume: 245, revenue: 324 },
      { hour: 8, volume: 298, revenue: 395 },
      { hour: 12, volume: 267, revenue: 354 },
      { hour: 17, volume: 312, revenue: 415 },
      { hour: 18, volume: 289, revenue: 384 }
    ]
  };
}

function generateInventoryForecast() {
  return {
    predictions: [
      {
        tank_id: '1',
        tank_name: 'Tank A - Gasoline',
        current_level: 7200,
        predicted_empty_date: '2024-01-20',
        recommended_order_date: '2024-01-18',
        recommended_quantity: 8000,
        confidence: 94.5
      },
      {
        tank_id: '2',
        tank_name: 'Tank B - Diesel',
        current_level: 3400,
        predicted_empty_date: '2024-01-22',
        recommended_order_date: '2024-01-20',
        recommended_quantity: 6000,
        confidence: 91.2
      }
    ],
    seasonal_adjustments: {
      summer_increase: 15,
      winter_decrease: 8,
      holiday_spike: 25
    },
    market_insights: [
      'Gasoline prices expected to rise 3% next week due to refinery maintenance',
      'Diesel demand increasing due to logistics sector growth',
      'Premium fuel sales showing 12% month-over-month growth'
    ]
  };
}

function generateSupplierComparison() {
  return {
    suppliers: [
      {
        id: '1',
        name: 'PetroMax Supply Co.',
        rating: 4.8,
        price_competitiveness: 92,
        delivery_reliability: 96,
        fuel_quality: 98,
        average_price: 1.23,
        last_delivery: '2024-01-10',
        contract_terms: 'Net 30',
        volume_discount: 3.5
      },
      {
        id: '2',
        name: 'Global Fuel Partners',
        rating: 4.5,
        price_competitiveness: 89,
        delivery_reliability: 94,
        fuel_quality: 95,
        average_price: 1.26,
        last_delivery: '2024-01-08',
        contract_terms: 'Net 15',
        volume_discount: 2.8
      },
      {
        id: '3',
        name: 'Regional Energy Solutions',
        rating: 4.2,
        price_competitiveness: 85,
        delivery_reliability: 89,
        fuel_quality: 92,
        average_price: 1.29,
        last_delivery: '2024-01-12',
        contract_terms: 'COD',
        volume_discount: 1.5
      }
    ],
    recommendations: [
      'Consider increasing orders from PetroMax Supply Co. due to superior quality ratings',
      'Negotiate better payment terms with Global Fuel Partners',
      'Regional Energy Solutions offers good backup option for emergency supplies'
    ]
  };
}

function generateMaintenanceSchedule() {
  return {
    upcoming_maintenance: [
      {
        tank_id: '1',
        tank_name: 'Tank A - Gasoline',
        maintenance_type: 'Routine Inspection',
        scheduled_date: '2024-01-25',
        estimated_duration: '4 hours',
        cost_estimate: 450,
        priority: 'medium',
        last_maintenance: '2024-01-01'
      },
      {
        tank_id: '3',
        tank_name: 'Tank C - Premium',
        maintenance_type: 'Pump Replacement',
        scheduled_date: '2024-01-28',
        estimated_duration: '8 hours',
        cost_estimate: 1200,
        priority: 'high',
        last_maintenance: '2023-12-15'
      }
    ],
    maintenance_history: [
      {
        date: '2024-01-01',
        tank_id: '1',
        type: 'Routine Inspection',
        cost: 425,
        duration: '3.5 hours',
        findings: 'Normal wear, no issues found'
      }
    ],
    annual_budget: {
      budgeted: 12000,
      spent: 1875,
      remaining: 10125,
      projected_year_end: 9850
    }
  };
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Robust path parsing
  const url = new URL(req.url);
  const pathParts = url.pathname.replace(/^\/functions\/v1\//, '').split('/');
  const mainRoute = pathParts[0];
  const subRoute = pathParts[1] || '';

  if (mainRoute !== 'fuel-analytics') {
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Example: /fuel-analytics/metrics
  if (subRoute === 'metrics') {
    if (req.method === 'GET') {
      const metrics = generateFuelMetrics();
      return new Response(JSON.stringify({ metrics }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ...repeat for other subroutes, always using ...corsHeaders...

  // Not found
  return new Response(
    JSON.stringify({ error: 'Not found' }),
    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}); 