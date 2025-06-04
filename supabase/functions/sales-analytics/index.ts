import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { getCorsHeaders, handleCors } from '../_shared/cors.ts';

interface SalesRequest {
  action: string;
  date_range?: string;
  product_id?: string;
  customer_id?: string;
  payment_method?: string;
  limit?: number;
  offset?: number;
}

interface SalesMetrics {
  total_sales: number;
  sales_count: number;
  average_transaction: number;
  daily_growth: number;
  weekly_growth: number;
  monthly_growth: number;
  top_products: Array<{
    product: string;
    sales: number;
    revenue: number;
    growth: number;
  }>;
  payment_methods: Array<{
    method: string;
    count: number;
    amount: number;
    percentage: number;
  }>;
  hourly_sales: Array<{
    hour: number;
    sales: number;
    transactions: number;
  }>;
}

interface Sale {
  id: string;
  transaction_id: string;
  customer_name: string;
  customer_email?: string;
  products: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  payment_method: string;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  created_at: string;
  cashier_name: string;
  notes?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_purchases: number;
  total_spent: number;
  last_purchase: string;
  loyalty_points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  profit_margin: number;
  stock_quantity: number;
  units_sold: number;
  revenue: number;
  last_sold: string;
}

// Mock data generators
const generateSalesMetrics = (): SalesMetrics => ({
  total_sales: Math.floor(Math.random() * 50000) + 25000,
  sales_count: Math.floor(Math.random() * 200) + 150,
  average_transaction: Math.floor(Math.random() * 100) + 45,
  daily_growth: (Math.random() - 0.5) * 20,
  weekly_growth: (Math.random() - 0.3) * 15,
  monthly_growth: (Math.random() - 0.2) * 25,
  top_products: [
    { product: 'Premium Gasoline', sales: 45, revenue: 3420, growth: 8.5 },
    { product: 'Diesel Fuel', sales: 32, revenue: 2890, growth: 5.2 },
    { product: 'Coffee', sales: 78, revenue: 234, growth: 12.1 },
    { product: 'Energy Drinks', sales: 56, revenue: 168, growth: 3.8 },
    { product: 'Snacks', sales: 89, revenue: 267, growth: -2.1 }
  ],
  payment_methods: [
    { method: 'Credit Card', count: 85, amount: 8500, percentage: 55 },
    { method: 'Debit Card', count: 45, amount: 4200, percentage: 29 },
    { method: 'Cash', count: 25, amount: 1800, percentage: 16 }
  ],
  hourly_sales: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    sales: Math.floor(Math.random() * 2000) + 200,
    transactions: Math.floor(Math.random() * 20) + 5
  }))
});

const generateSales = (): Sale[] => {
  const sales: Sale[] = [];
  const products = [
    'Premium Gasoline', 'Regular Gasoline', 'Diesel Fuel', 'Coffee', 'Energy Drinks',
    'Snacks', 'Cigarettes', 'Lottery Tickets', 'Car Wash', 'Oil Change'
  ];
  const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'Mobile Pay'];
  const statuses: Sale['status'][] = ['completed', 'pending', 'cancelled', 'refunded'];
  const cashiers = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Lisa Brown'];

  for (let i = 0; i < 50; i++) {
    const productList = [];
    const numProducts = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < numProducts; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const unitPrice = Math.floor(Math.random() * 50) + 5;
      productList.push({
        name: product,
        quantity,
        unit_price: unitPrice,
        total: quantity * unitPrice
      });
    }

    const subtotal = productList.reduce((sum, p) => sum + p.total, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    sales.push({
      id: `sale_${i + 1}`,
      transaction_id: `TXN${Date.now()}${i}`,
      customer_name: `Customer ${i + 1}`,
      customer_email: Math.random() > 0.5 ? `customer${i + 1}@email.com` : undefined,
      products: productList,
      subtotal,
      tax,
      total,
      payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      cashier_name: cashiers[Math.floor(Math.random() * cashiers.length)],
      notes: Math.random() > 0.7 ? 'Special discount applied' : undefined
    });
  }

  return sales.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

const generateCustomers = (): Customer[] => {
  const customers: Customer[] = [];
  const tiers: Customer['tier'][] = ['bronze', 'silver', 'gold', 'platinum'];

  for (let i = 0; i < 30; i++) {
    const totalSpent = Math.floor(Math.random() * 5000) + 100;
    const tier = totalSpent > 2000 ? 'platinum' : totalSpent > 1000 ? 'gold' : totalSpent > 500 ? 'silver' : 'bronze';
    
    customers.push({
      id: `customer_${i + 1}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@email.com`,
      phone: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      total_purchases: Math.floor(Math.random() * 50) + 5,
      total_spent: totalSpent,
      last_purchase: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      loyalty_points: Math.floor(totalSpent / 10),
      tier,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return customers.sort((a, b) => b.total_spent - a.total_spent);
};

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  const categories = ['Fuel', 'Food & Beverage', 'Automotive', 'Tobacco', 'Lottery', 'Services'];
  const productNames = [
    'Premium Gasoline', 'Regular Gasoline', 'Diesel Fuel', 'Coffee', 'Energy Drinks',
    'Snacks', 'Cigarettes', 'Lottery Tickets', 'Car Wash', 'Oil Change',
    'Windshield Washer', 'Motor Oil', 'Phone Chargers', 'Beverages', 'Candy'
  ];

  productNames.forEach((name, i) => {
    const price = Math.floor(Math.random() * 100) + 10;
    const cost = price * (0.6 + Math.random() * 0.2);
    const unitsSold = Math.floor(Math.random() * 100) + 10;
    
    products.push({
      id: `product_${i + 1}`,
      name,
      category: categories[Math.floor(Math.random() * categories.length)],
      price,
      cost,
      profit_margin: ((price - cost) / price) * 100,
      stock_quantity: Math.floor(Math.random() * 100) + 20,
      units_sold: unitsSold,
      revenue: unitsSold * price,
      last_sold: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    });
  });

  return products.sort((a, b) => b.revenue - a.revenue);
};

const generateSalesAnalytics = () => ({
  revenue_trend: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    revenue: Math.floor(Math.random() * 3000) + 1000,
    transactions: Math.floor(Math.random() * 50) + 20
  })),
  category_performance: [
    { category: 'Fuel', revenue: 28500, growth: 5.2, transactions: 245 },
    { category: 'Food & Beverage', revenue: 8900, growth: 12.1, transactions: 189 },
    { category: 'Automotive', revenue: 3400, growth: -2.3, transactions: 45 },
    { category: 'Tobacco', revenue: 5600, growth: 1.8, transactions: 78 },
    { category: 'Services', revenue: 2100, growth: 8.9, transactions: 23 }
  ],
  peak_hours: [
    { hour: '7:00 AM', sales: 1200, percentage: 8.5 },
    { hour: '12:00 PM', sales: 1450, percentage: 10.2 },
    { hour: '5:00 PM', sales: 1680, percentage: 11.8 },
    { hour: '8:00 PM', sales: 980, percentage: 6.9 }
  ],
  customer_segments: [
    { segment: 'Regular Customers', count: 245, revenue: 18900, avg_spend: 77.14 },
    { segment: 'Occasional Visitors', count: 189, revenue: 8450, avg_spend: 44.71 },
    { segment: 'New Customers', count: 78, revenue: 2890, avg_spend: 37.05 }
  ]
});

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

  if (mainRoute !== 'sales-analytics') {
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Example: /sales-analytics/metrics
  if (subRoute === 'metrics') {
    if (req.method === 'GET') {
      const metrics = generateSalesMetrics();
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