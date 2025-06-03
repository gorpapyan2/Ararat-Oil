import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Filter,
  FileText,
  PieChart,
  LineChart,
  DollarSign,
  Fuel,
  Users,
  Clock,
  Target,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/primitives/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
import { DatePickerWithRange } from '@/core/components/ui/date-range-picker';
import { cn } from '@/shared/utils';

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'financial' | 'operational' | 'inventory' | 'customer';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  status: 'ready' | 'generating' | 'scheduled';
}

interface ReportMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export function ReportsPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const reportTypes: ReportType[] = [
    {
      id: 'sales_summary',
      title: 'Sales Summary Report',
      description: 'Comprehensive sales analysis and performance metrics',
      icon: BarChart3,
      category: 'financial',
      frequency: 'daily',
      status: 'ready'
    },
    {
      id: 'fuel_inventory',
      title: 'Fuel Inventory Report',
      description: 'Tank levels, consumption patterns, and supply forecasts',
      icon: Fuel,
      category: 'inventory',
      frequency: 'weekly',
      status: 'ready'
    },
    {
      id: 'customer_analytics',
      title: 'Customer Analytics',
      description: 'Customer behavior, loyalty metrics, and segmentation',
      icon: Users,
      category: 'customer',
      frequency: 'monthly',
      status: 'generating'
    },
    {
      id: 'operational_efficiency',
      title: 'Operational Efficiency',
      description: 'System performance, uptime, and productivity metrics',
      icon: Target,
      category: 'operational',
      frequency: 'weekly',
      status: 'ready'
    },
    {
      id: 'financial_summary',
      title: 'Financial Summary',
      description: 'Revenue, expenses, profit margins, and financial health',
      icon: DollarSign,
      category: 'financial',
      frequency: 'monthly',
      status: 'scheduled'
    },
    {
      id: 'compliance_audit',
      title: 'Compliance Audit',
      description: 'Regulatory compliance, safety metrics, and audit trails',
      icon: FileText,
      category: 'operational',
      frequency: 'monthly',
      status: 'ready'
    }
  ];

  const keyMetrics: ReportMetric[] = [
    {
      label: 'Total Revenue',
      value: '₽37,082,956',
      change: 12.5,
      trend: 'up',
      color: 'text-green-600'
    },
    {
      label: 'Fuel Sold',
      value: '1,456,789 L',
      change: -3.2,
      trend: 'down',
      color: 'text-blue-600'
    },
    {
      label: 'Customer Growth',
      value: '25,693',
      change: 8.1,
      trend: 'up',
      color: 'text-purple-600'
    },
    {
      label: 'Efficiency Score',
      value: '94.2%',
      change: 2.1,
      trend: 'up',
      color: 'text-orange-600'
    }
  ];

  const filteredReports = useMemo(() => {
    if (selectedCategory === 'all') return reportTypes;
    return reportTypes.filter(report => report.category === selectedCategory);
  }, [selectedCategory]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ready</Badge>;
      case 'generating':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Generating</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Scheduled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return DollarSign;
      case 'operational': return Target;
      case 'inventory': return Fuel;
      case 'customer': return Users;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'text-green-600';
      case 'operational': return 'text-blue-600';
      case 'inventory': return 'text-orange-600';
      case 'customer': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Business Reports & Analytics
            </h1>
            <p className="text-muted-foreground">
              Generate comprehensive reports and analyze your business performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2 rounded-lg", metric.color.replace('text-', 'bg-').replace('-600', '-100'))}>
                      <BarChart3 className={cn("w-6 h-6", metric.color)} />
                    </div>
                    <Badge 
                      variant={metric.trend === 'up' ? 'default' : 'secondary'}
                      className="flex items-center gap-1"
                    >
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingUp className="w-3 h-3 rotate-180" />
                      )}
                      {Math.abs(metric.change)}%
                    </Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {metric.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <div className="flex flex-wrap gap-3 flex-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>

                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={setDateRange}
                  className="w-auto"
                />
              </div>

              <Button variant="outline" size="sm">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports">Available Reports</TabsTrigger>
            <TabsTrigger value="analytics">Live Analytics</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report, index) => {
                const CategoryIcon = getCategoryIcon(report.category);
                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={cn(
                            "p-3 rounded-lg", 
                            getCategoryColor(report.category).replace('text-', 'bg-').replace('-600', '-100')
                          )}>
                            <report.icon className={cn("w-6 h-6", getCategoryColor(report.category))} />
                          </div>
                          {getStatusBadge(report.status)}
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-2">{report.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {report.description}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="capitalize">{report.frequency}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Preview
                            </Button>
                            <Button size="sm">
                              Generate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-blue-500" />
                    Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <LineChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Revenue chart visualization would be here</p>
                      <p className="text-sm">Connect to your analytics service</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-green-500" />
                    Sales Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Sales distribution chart would be here</p>
                      <p className="text-sm">Real-time sales breakdown</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="mt-6">
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Scheduled Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportTypes.filter(r => r.status === 'scheduled').map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <report.icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Next generation: {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="ghost">Cancel</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 