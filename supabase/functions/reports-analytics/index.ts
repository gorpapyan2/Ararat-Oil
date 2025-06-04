import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCors } from '../_shared/cors.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportRequest {
  type: 'sales' | 'fuel' | 'customer' | 'operational' | 'financial' | 'compliance';
  dateRange: {
    from: string;
    to: string;
  };
  filters?: {
    category?: string;
    location?: string;
    employee?: string;
  };
}

interface ReportData {
  id: string;
  title: string;
  type: string;
  generatedAt: string;
  summary: {
    totalRevenue: number;
    totalTransactions: number;
    averageTransaction: number;
    growth: number;
  };
  data: any[];
  charts: {
    type: 'line' | 'bar' | 'pie' | 'area';
    data: any[];
    config: any;
  }[];
}

async function generateSalesReport(request: ReportRequest): Promise<ReportData> {
  // Simulate sales data generation
  const mockTransactions = Array.from({ length: 50 }, (_, i) => ({
    id: `txn_${i + 1}`,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    amount: Math.floor(Math.random() * 500) + 50,
    fuelType: ['Petrol', 'Diesel', 'Premium'][Math.floor(Math.random() * 3)],
    quantity: Math.floor(Math.random() * 100) + 10,
    pumpId: Math.floor(Math.random() * 8) + 1,
    employeeId: `emp_${Math.floor(Math.random() * 5) + 1}`,
  }));

  const totalRevenue = mockTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const totalTransactions = mockTransactions.length;
  const averageTransaction = totalRevenue / totalTransactions;

  return {
    id: `report_${Date.now()}`,
    title: 'Sales Summary Report',
    type: 'sales',
    generatedAt: new Date().toISOString(),
    summary: {
      totalRevenue,
      totalTransactions,
      averageTransaction,
      growth: Math.random() * 20 - 10, // Random growth between -10% and +10%
    },
    data: mockTransactions,
    charts: [
      {
        type: 'line',
        data: mockTransactions.map(txn => ({
          date: new Date(txn.date).toLocaleDateString(),
          revenue: txn.amount,
        })),
        config: { xAxis: 'date', yAxis: 'revenue', title: 'Daily Revenue Trend' }
      },
      {
        type: 'pie',
        data: [
          { name: 'Petrol', value: mockTransactions.filter(t => t.fuelType === 'Petrol').length },
          { name: 'Diesel', value: mockTransactions.filter(t => t.fuelType === 'Diesel').length },
          { name: 'Premium', value: mockTransactions.filter(t => t.fuelType === 'Premium').length },
        ],
        config: { title: 'Fuel Type Distribution' }
      }
    ]
  };
}

async function generateFuelReport(request: ReportRequest): Promise<ReportData> {
  const mockInventory = [
    { tank: 'Tank 1', fuelType: 'Petrol', capacity: 10000, current: 7500, consumption: 2500 },
    { tank: 'Tank 2', fuelType: 'Diesel', capacity: 8000, current: 6200, consumption: 1800 },
    { tank: 'Tank 3', fuelType: 'Premium', capacity: 5000, current: 3800, consumption: 1200 },
  ];

  return {
    id: `report_${Date.now()}`,
    title: 'Fuel Inventory Report',
    type: 'fuel',
    generatedAt: new Date().toISOString(),
    summary: {
      totalRevenue: 0,
      totalTransactions: mockInventory.reduce((sum, tank) => sum + tank.consumption, 0),
      averageTransaction: 0,
      growth: Math.random() * 10 - 5,
    },
    data: mockInventory,
    charts: [
      {
        type: 'bar',
        data: mockInventory.map(tank => ({
          name: tank.tank,
          current: tank.current,
          capacity: tank.capacity,
          percentage: (tank.current / tank.capacity) * 100,
        })),
        config: { title: 'Tank Levels' }
      }
    ]
  };
}

async function generateCustomerReport(request: ReportRequest): Promise<ReportData> {
  const mockCustomers = Array.from({ length: 25 }, (_, i) => ({
    id: `cust_${i + 1}`,
    name: `Customer ${i + 1}`,
    totalSpent: Math.floor(Math.random() * 5000) + 500,
    visitCount: Math.floor(Math.random() * 20) + 1,
    lastVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    loyaltyPoints: Math.floor(Math.random() * 1000),
  }));

  return {
    id: `report_${Date.now()}`,
    title: 'Customer Analytics Report',
    type: 'customer',
    generatedAt: new Date().toISOString(),
    summary: {
      totalRevenue: mockCustomers.reduce((sum, cust) => sum + cust.totalSpent, 0),
      totalTransactions: mockCustomers.reduce((sum, cust) => sum + cust.visitCount, 0),
      averageTransaction: mockCustomers.reduce((sum, cust) => sum + cust.totalSpent, 0) / mockCustomers.length,
      growth: Math.random() * 15 - 5,
    },
    data: mockCustomers,
    charts: [
      {
        type: 'area',
        data: mockCustomers.slice(0, 10).map(cust => ({
          name: cust.name,
          spent: cust.totalSpent,
          visits: cust.visitCount,
        })),
        config: { title: 'Top Customers by Spending' }
      }
    ]
  };
}

async function generateOperationalReport(request: ReportRequest): Promise<ReportData> {
  const mockOperations = {
    uptime: 98.5,
    systemEfficiency: 94.2,
    pumpStatus: [
      { id: 1, status: 'active', efficiency: 96.5, lastMaintenance: '2024-01-15' },
      { id: 2, status: 'active', efficiency: 94.8, lastMaintenance: '2024-01-20' },
      { id: 3, status: 'maintenance', efficiency: 0, lastMaintenance: '2024-01-25' },
      { id: 4, status: 'active', efficiency: 97.2, lastMaintenance: '2024-01-10' },
    ],
    incidents: [
      { date: '2024-01-20', type: 'maintenance', severity: 'low', resolved: true },
      { date: '2024-01-22', type: 'technical', severity: 'medium', resolved: true },
    ]
  };

  return {
    id: `report_${Date.now()}`,
    title: 'Operational Efficiency Report',
    type: 'operational',
    generatedAt: new Date().toISOString(),
    summary: {
      totalRevenue: 0,
      totalTransactions: mockOperations.incidents.length,
      averageTransaction: mockOperations.uptime,
      growth: Math.random() * 5,
    },
    data: mockOperations,
    charts: [
      {
        type: 'bar',
        data: mockOperations.pumpStatus.map(pump => ({
          pump: `Pump ${pump.id}`,
          efficiency: pump.efficiency,
          status: pump.status,
        })),
        config: { title: 'Pump Efficiency' }
      }
    ]
  };
}

async function generateFinancialReport(request: ReportRequest): Promise<ReportData> {
  const mockFinancials = {
    revenue: 125000,
    expenses: 78000,
    profit: 47000,
    profitMargin: 37.6,
    breakdown: {
      fuelSales: 95000,
      services: 20000,
      retail: 10000,
    },
    expenseBreakdown: {
      fuelPurchase: 45000,
      salaries: 18000,
      maintenance: 8000,
      utilities: 7000,
    }
  };

  return {
    id: `report_${Date.now()}`,
    title: 'Financial Summary Report',
    type: 'financial',
    generatedAt: new Date().toISOString(),
    summary: {
      totalRevenue: mockFinancials.revenue,
      totalTransactions: 0,
      averageTransaction: mockFinancials.profit,
      growth: Math.random() * 12 - 3,
    },
    data: mockFinancials,
    charts: [
      {
        type: 'pie',
        data: [
          { name: 'Fuel Sales', value: mockFinancials.breakdown.fuelSales },
          { name: 'Services', value: mockFinancials.breakdown.services },
          { name: 'Retail', value: mockFinancials.breakdown.retail },
        ],
        config: { title: 'Revenue Sources' }
      },
      {
        type: 'bar',
        data: Object.entries(mockFinancials.expenseBreakdown).map(([key, value]) => ({
          category: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          amount: value,
        })),
        config: { title: 'Expense Breakdown' }
      }
    ]
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

  if (mainRoute !== 'reports-analytics') {
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Example: /reports-analytics/metrics
  if (subRoute === 'metrics') {
    if (req.method === 'GET') {
      // Replace with actual logic
      return new Response(JSON.stringify({ metrics: {} }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const endpoint = url.pathname.split('/').pop();

    switch (endpoint) {
      case 'generate-report': {
        const requestData: ReportRequest = await req.json();
        
        let report: ReportData;
        switch (requestData.type) {
          case 'sales':
            report = await generateSalesReport(requestData);
            break;
          case 'fuel':
            report = await generateFuelReport(requestData);
            break;
          case 'customer':
            report = await generateCustomerReport(requestData);
            break;
          case 'operational':
            report = await generateOperationalReport(requestData);
            break;
          case 'financial':
            report = await generateFinancialReport(requestData);
            break;
          default:
            throw new Error(`Unsupported report type: ${requestData.type}`);
        }

        return new Response(JSON.stringify(report), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'scheduled-reports': {
        const scheduledReports = [
          {
            id: 'scheduled_1',
            name: 'Daily Sales Summary',
            type: 'sales',
            schedule: 'daily',
            lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
          },
          {
            id: 'scheduled_2',
            name: 'Weekly Fuel Inventory',
            type: 'fuel',
            schedule: 'weekly',
            lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
          },
          {
            id: 'scheduled_3',
            name: 'Monthly Financial Report',
            type: 'financial',
            schedule: 'monthly',
            lastRun: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            nextRun: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'scheduled',
          },
        ];

        return new Response(JSON.stringify(scheduledReports), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'export-report': {
        const { reportId, format } = await req.json();
        
        // Simulate report export
        const exportData = {
          reportId,
          format,
          downloadUrl: `https://example.com/reports/${reportId}.${format}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };

        return new Response(JSON.stringify(exportData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 