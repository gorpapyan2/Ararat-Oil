import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, tank_id, fuel_type, date_range }: FuelRequest = await req.json();

    let response;

    switch (action) {
      case 'get_metrics':
        response = generateFuelMetrics();
        break;
        
      case 'get_prices':
        response = generateFuelPrices();
        break;
        
      case 'get_analytics':
        response = generateFuelAnalytics();
        break;
        
      case 'get_inventory_forecast':
        response = generateInventoryForecast();
        break;
        
      case 'get_supplier_comparison':
        response = generateSupplierComparison();
        break;
        
      case 'get_maintenance_schedule':
        response = generateMaintenanceSchedule();
        break;
        
      case 'get_tank_details':
        response = {
          tank_id,
          details: {
            name: `Tank ${tank_id} - ${fuel_type}`,
            capacity: 8000,
            current_level: 6200,
            percentage: 77.5,
            last_refill: '2024-01-10',
            daily_consumption: 320,
            efficiency_rating: 94.5,
            temperature: 18.5,
            pressure: 1.2,
            last_maintenance: '2024-01-01',
            next_maintenance: '2024-01-25',
            sensor_status: 'online',
            leak_detection: 'normal'
          },
          recent_activity: [
            {
              timestamp: '2024-01-15 14:30',
              type: 'fuel_dispensed',
              amount: 45.2,
              customer_id: 'C001'
            },
            {
              timestamp: '2024-01-15 10:15',
              type: 'level_check',
              level: 6245,
              automated: true
            }
          ]
        };
        break;
        
      case 'optimize_pricing':
        response = {
          current_prices: generateFuelPrices(),
          optimization_suggestions: [
            {
              fuel_type: 'gasoline',
              current_price: 1.32,
              suggested_price: 1.34,
              expected_volume_change: -2.5,
              expected_revenue_change: 1.8,
              confidence: 87
            },
            {
              fuel_type: 'diesel',
              current_price: 1.45,
              suggested_price: 1.43,
              expected_volume_change: 4.2,
              expected_revenue_change: 2.1,
              confidence: 92
            }
          ],
          market_factors: [
            'Competitor average: $1.33/L for gasoline',
            'Local demand increased 8% this week',
            'Supply chain disruption affecting diesel prices'
          ]
        };
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Fuel analytics error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}); 