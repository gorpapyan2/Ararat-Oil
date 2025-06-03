import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  CreditCard,
  BarChart3,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Plus,
  MoreVertical,
  Star,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Receipt,
  MapPin,
  Phone,
  Mail,
  Package
} from 'lucide-react';
import { Badge } from '../../../core/components/ui/primitives/badge';
import { Card } from '../../../core/components/ui/card';
import { Button } from '../../../core/components/ui/button';
import { Input } from '../../../core/components/ui/input';
import { useToast } from '../../../core/hooks/useToast';
import { supabase } from '../../../core/api/supabase';

// Types
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

// Sales service for Supabase integration
const salesService = {
  getMetrics: async (): Promise<SalesMetrics> => {
    const { data, error } = await supabase.functions.invoke('sales-analytics', {
      body: { action: 'get_metrics' }
    });
    if (error) throw error;
    return data;
  },

  getSales: async (): Promise<Sale[]> => {
    const { data, error } = await supabase.functions.invoke('sales-analytics', {
      body: { action: 'get_sales' }
    });
    if (error) throw error;
    return data;
  },

  getCustomers: async (): Promise<Customer[]> => {
    const { data, error } = await supabase.functions.invoke('sales-analytics', {
      body: { action: 'get_customers' }
    });
    if (error) throw error;
    return data;
  },

  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase.functions.invoke('sales-analytics', {
      body: { action: 'get_products' }
    });
    if (error) throw error;
    return data;
  },

  createSale: async (saleData: Partial<Sale>) => {
    const { data, error } = await supabase.functions.invoke('sales-analytics', {
      body: { action: 'create_sale', ...saleData }
    });
    if (error) throw error;
    return data;
  },

  refundSale: async (saleId: string) => {
    const { data, error } = await supabase.functions.invoke('sales-analytics', {
      body: { action: 'refund_sale', sale_id: saleId }
    });
    if (error) throw error;
    return data;
  }
};

export const SalesDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'pending' | 'refunded'>('all');
  const [viewMode, setViewMode] = useState<'sales' | 'customers' | 'products'>('sales');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Queries
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['sales-metrics'],
    queryFn: salesService.getMetrics,
    refetchInterval: 30000,
  });

  const { data: sales = [], isLoading: salesLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: salesService.getSales,
    refetchInterval: 60000,
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: salesService.getCustomers,
    refetchInterval: 300000,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: salesService.getProducts,
    refetchInterval: 300000,
  });

  // Mutations
  const refundMutation = useMutation({
    mutationFn: ({ saleId }: { saleId: string }) => salesService.refundSale(saleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sales-metrics'] });
      toast({
        title: 'Sale Refunded',
        description: 'The sale has been refunded successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to refund sale. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Filter data
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || sale.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Metric cards data
  const metricCards = [
    {
      title: 'Total Sales',
      value: metrics?.total_sales ? `$${metrics.total_sales.toLocaleString()}` : '--',
      icon: DollarSign,
      color: 'green',
      description: 'Today\'s revenue',
      trend: metrics?.daily_growth || null
    },
    {
      title: 'Transactions',
      value: metrics?.sales_count?.toString() || '--',
      icon: ShoppingCart,
      color: 'blue',
      description: 'Number of sales',
      trend: null
    },
    {
      title: 'Avg. Transaction',
      value: metrics?.average_transaction ? `$${metrics.average_transaction.toFixed(2)}` : '--',
      icon: BarChart3,
      color: 'purple',
      description: 'Per transaction',
      trend: metrics?.weekly_growth || null
    },
    {
      title: 'Growth',
      value: metrics?.monthly_growth ? `${metrics.monthly_growth.toFixed(1)}%` : '--',
      icon: TrendingUp,
      color: 'orange',
      description: 'Monthly growth',
      trend: metrics?.monthly_growth || null
    }
  ];

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['sales-metrics'] });
    queryClient.invalidateQueries({ queryKey: ['sales'] });
    queryClient.invalidateQueries({ queryKey: ['customers'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
    toast({
      title: 'Data Refreshed',
      description: 'All sales data has been updated.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'default';
      case 'cancelled': return 'destructive';
      case 'refunded': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      case 'cancelled': return XCircle;
      case 'refunded': return XCircle;
      default: return Clock;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'gold': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'silver': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      case 'bronze': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (metricsError) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Sales Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We couldn't load the sales data. Please try again.
          </p>
          <Button onClick={handleRefresh} className="mx-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Sales Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor sales performance, customers, and product analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={metricsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${metricsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Sale
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/20`}>
                    <metric.icon className={`h-5 w-5 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {metricsLoading ? '...' : metric.value}
                    </p>
                  </div>
                </div>
                {metric.trend && (
                  <div className={`flex items-center space-x-1 ${metric.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(metric.trend).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {metric.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('sales')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'sales'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Receipt className="h-4 w-4 mr-2 inline" />
              Sales
            </button>
            <button
              onClick={() => setViewMode('customers')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'customers'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Users className="h-4 w-4 mr-2 inline" />
              Customers
            </button>
            <button
              onClick={() => setViewMode('products')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'products'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Package className="h-4 w-4 mr-2 inline" />
              Products
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${viewMode}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          {viewMode === 'sales' && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
              >
                <option value="all">All Sales</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'sales' ? (
        // Sales View
        <div className="space-y-4">
          <AnimatePresence>
            {filteredSales.map((sale, index) => {
              const StatusIcon = getStatusIcon(sale.status);
              return (
                <motion.div
                  key={sale.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <Receipt className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {sale.transaction_id}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {sale.customer_name} • {formatDate(sale.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            ${sale.subtotal.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Tax</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            ${sale.tax.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            ${sale.total.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Payment</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {sale.payment_method}
                          </p>
                        </div>
                        
                        <Badge variant={getStatusColor(sale.status) as any} className="capitalize">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {sale.status}
                        </Badge>
                        
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Products */}
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Products:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {sale.products.map((product, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">
                              {product.quantity}x {product.name}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              ${product.total.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {sale.notes && (
                      <div className="border-t pt-4 mt-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Notes:</strong> {sale.notes}
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : viewMode === 'customers' ? (
        // Customers View
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {customer.name}
                        </h3>
                        <p className={`text-xs px-2 py-1 rounded-full ${getTierColor(customer.tier)} capitalize`}>
                          {customer.tier}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <DollarSign className="h-4 w-4" />
                        <span>${customer.total_spent.toFixed(2)} spent</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {customer.loyalty_points} pts
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {customer.total_purchases} purchases • Last: {formatDate(customer.last_purchase)}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        // Products View
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.category}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Price:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Stock:</span>
                      <span className={`font-medium ${product.stock_quantity < 10 ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
                        {product.stock_quantity} units
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Units Sold:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {product.units_sold}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Revenue:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        ${product.revenue.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Margin:</span>
                      <span className="font-medium text-green-600">
                        {product.profit_margin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Loading State */}
      {(salesLoading || customersLoading || productsLoading || metricsLoading) && (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading sales data...</p>
        </div>
      )}

      {/* Empty State */}
      {!salesLoading && !customersLoading && !productsLoading && 
       ((viewMode === 'sales' && filteredSales.length === 0) || 
        (viewMode === 'customers' && filteredCustomers.length === 0) ||
        (viewMode === 'products' && filteredProducts.length === 0)) && (
        <Card className="p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No {viewMode} Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedFilter !== 'all' 
              ? `Try adjusting your search or filter criteria.` 
              : `Start by adding your first ${viewMode.slice(0, -1)}.`
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add {viewMode === 'sales' ? 'Sale' : viewMode === 'customers' ? 'Customer' : 'Product'}
          </Button>
        </Card>
      )}
    </div>
  );
}; 