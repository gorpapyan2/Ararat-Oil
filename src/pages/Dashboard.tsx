
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
  Package,
  BarChart4,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  Boxes,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  FileBarChart,
  Filter,
  Printer,
  Share2,
  RefreshCw,
  Info
} from "lucide-react";
import { 
  fetchSales, 
  fetchExpenses, 
  fetchInventory,
  fetchFuelSupplies,
  type Sale,
  type Expense,
  type InventoryItem,
  type FuelSupply
} from "@/services/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, subDays, isSameDay, parseISO, startOfMonth, endOfMonth, isSameMonth } from "date-fns";
import { motion } from "framer-motion";

export default function Dashboard() {
  // State for time period filtering
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("month");
  
  // Fetch sales data
  const { data: salesData, isLoading: isSalesLoading } = useQuery<Sale[]>({
    queryKey: ['sales'],
    queryFn: fetchSales,
  });

  // Fetch expenses data
  const { data: expensesData, isLoading: isExpensesLoading } = useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
  });

  // Fetch inventory data
  const { data: inventoryData, isLoading: isInventoryLoading } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });
  
  // Fetch fuel supplies data
  const { data: fuelSuppliesData, isLoading: isFuelSuppliesLoading } = useQuery<FuelSupply[]>({
    queryKey: ['fuelSupplies'],
    queryFn: fetchFuelSupplies,
  });

  // Filter data based on selected time period
  const filterDataByPeriod = <T extends { date?: string; delivery_date?: string; created_at?: string }>(data: T[] | undefined): T[] => {
    if (!data) return [];
    
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case "day":
        startDate = now;
        break;
      case "week":
        startDate = subDays(now, 7);
        break;
      case "month":
        startDate = startOfMonth(now);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = subDays(now, 30);
    }
    
    return data.filter(item => {
      const itemDate = parseISO(item.date || item.delivery_date || item.created_at || new Date().toISOString());
      
      if (period === "day") return isSameDay(itemDate, now);
      if (period === "month") return isSameMonth(itemDate, now);
      return itemDate >= startDate;
    });
  };
  
  // Filter data by period
  const filteredSales = filterDataByPeriod(salesData);
  const filteredExpenses = filterDataByPeriod(expensesData);
  const filteredInventory = filterDataByPeriod(inventoryData);
  const filteredFuelSupplies = filterDataByPeriod(fuelSuppliesData);
  
  // Calculate KPIs
  const totalSales = filteredSales?.reduce((sum, sale) => 
    sum + Number(sale.total_sales || 0), 0) || 0;
  
  const previousPeriodSales = salesData?.filter(sale => {
    const saleDate = parseISO(sale.date || sale.created_at || "");
    const now = new Date();
    let startDate: Date, endDate: Date;
    
    if (period === "month") {
      // Previous month
      startDate = startOfMonth(subDays(startOfMonth(now), 1));
      endDate = endOfMonth(startDate);
    } else if (period === "week") {
      // Previous week
      startDate = subDays(subDays(now, 7), 7);
      endDate = subDays(now, 7);
    } else if (period === "day") {
      // Previous day
      startDate = subDays(now, 1);
      endDate = startDate;
    } else {
      // Previous year
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear() - 1, 11, 31);
    }
    
    return saleDate >= startDate && saleDate <= endDate;
  }).reduce((sum, sale) => sum + Number(sale.total_sales || 0), 0) || 0;
  
  const salesChange = previousPeriodSales === 0 
    ? 100 
    : ((totalSales - previousPeriodSales) / previousPeriodSales) * 100;

  // Calculate total expenses with proper type checking
  const totalExpenses = filteredExpenses?.reduce((sum, expense) => 
    sum + Number(expense.amount || 0), 0) || 0;
    
  const previousPeriodExpenses = expensesData?.filter(expense => {
    const expenseDate = parseISO(expense.date || expense.created_at || "");
    const now = new Date();
    let startDate: Date, endDate: Date;
    
    if (period === "month") {
      // Previous month
      startDate = startOfMonth(subDays(startOfMonth(now), 1));
      endDate = endOfMonth(startDate);
    } else if (period === "week") {
      // Previous week
      startDate = subDays(subDays(now, 7), 7);
      endDate = subDays(now, 7);
    } else if (period === "day") {
      // Previous day
      startDate = subDays(now, 1);
      endDate = startDate;
    } else {
      // Previous year
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear() - 1, 11, 31);
    }
    
    return expenseDate >= startDate && expenseDate <= endDate;
  }).reduce((sum, expense) => sum + Number(expense.amount || 0), 0) || 0;
  
  const expensesChange = previousPeriodExpenses === 0 
    ? 100 
    : ((totalExpenses - previousPeriodExpenses) / previousPeriodExpenses) * 100;
  
  // Calculate net profit
  const netProfit = totalSales - totalExpenses;
  const previousNetProfit = previousPeriodSales - previousPeriodExpenses;
  const profitChange = previousNetProfit === 0 
    ? 100 
    : ((netProfit - previousNetProfit) / Math.abs(previousNetProfit)) * 100;
  
  // Calculate inventory value with proper type checking
  const inventoryValue = filteredInventory?.reduce((sum, item) => 
    sum + (Number(item.closing_stock || 0) * Number(item.unit_price || 0)), 0) || 0;
    
  // Get total fuel supplies cost
  const totalFuelCost = filteredFuelSupplies?.reduce((sum, supply) => 
    sum + Number(supply.total_cost || 0), 0) || 0;

  // Prepare chart data for sales by date
  const salesChartData = filteredSales
    .reduce((acc, sale) => {
      const date = format(parseISO(sale.date), 'MM/dd/yyyy');
      const existingEntry = acc.find(item => item.date === date);
      
      if (existingEntry) {
        existingEntry.sales += Number(sale.total_sales || 0);
      } else {
        acc.push({
          date,
          sales: Number(sale.total_sales || 0)
        });
      }
      
      return acc;
    }, [] as Array<{ date: string; sales: number }>)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Prepare chart data for expenses by category
  const expensesByCategory = filteredExpenses
    .reduce((acc, expense) => {
      const category = expense.category;
      const existingEntry = acc.find(item => item.category === category);
      
      if (existingEntry) {
        existingEntry.amount += Number(expense.amount || 0);
      } else {
        acc.push({
          category,
          amount: Number(expense.amount || 0)
        });
      }
      
      return acc;
    }, [] as Array<{ category: string; amount: number }>);

  // Prepare pie chart data for fuel types inventory
  const fuelTypeInventory = filteredInventory
    .reduce((acc, item) => {
      const fuelType = item.fuel_type;
      const existingEntry = acc.find(entry => entry.name === fuelType);
      
      if (existingEntry) {
        existingEntry.value += Number(item.closing_stock || 0);
      } else {
        acc.push({
          name: fuelType,
          value: Number(item.closing_stock || 0)
        });
      }
      
      return acc;
    }, [] as Array<{ name: string; value: number }>);

  // Colors for fuel type pie chart
  const FUEL_TYPE_COLORS = {
    diesel: '#0088FE',
    gasoline: '#00C49F',
    premium: '#FFBB28',
    cng: '#FF8042',
    petrol: '#8884d8'
  };

  // List of recent activities (sales, expenses, supplies)
  const recentActivities = [
    ...filteredSales.map(sale => ({
      type: 'sale',
      date: sale.date || sale.created_at || '',
      amount: sale.total_sales,
      description: `Sale of ${sale.quantity} liters of ${sale.fuel_type} at ${sale.filling_system_name}`
    })),
    ...filteredExpenses.map(expense => ({
      type: 'expense',
      date: expense.date || expense.created_at || '',
      amount: expense.amount,
      description: `${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)} expense: ${expense.description}`
    })),
    ...filteredFuelSupplies.map(supply => ({
      type: 'supply',
      date: supply.delivery_date || supply.created_at || '',
      amount: supply.total_cost,
      description: `Fuel supply of ${supply.quantity_liters} liters from ${supply.provider?.name || 'Provider'}`
    }))
  ]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 10);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h2>
          <p className="text-muted-foreground">Monitor your business performance in real-time</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 ml-auto mr-2">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Tabs defaultValue="month" className="space-y-4" onValueChange={(value) => setPeriod(value as "day" | "week" | "month" | "year")}>
            <TabsList className="grid grid-cols-4 h-8">
              <TabsTrigger value="day" className="text-xs">Today</TabsTrigger>
              <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
              <TabsTrigger value="year" className="text-xs">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8">
              <Filter className="mr-2 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button size="sm" variant="outline" className="h-8">
              <Share2 className="mr-2 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button size="sm" className="h-8">
              <Download className="mr-2 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Sales Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {isSalesLoading ? (
                <>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {totalSales.toLocaleString()} ֏
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge variant={salesChange > 0 ? "success" : "destructive"} className="text-xs font-normal">
                      {salesChange > 0 ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          {salesChange.toFixed(1)}%
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          {Math.abs(salesChange).toFixed(1)}%
                        </>
                      )}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">from previous {period}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Expenses Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-l-4 border-l-destructive hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              {isExpensesLoading ? (
                <>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {totalExpenses.toLocaleString()} ֏
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge variant={expensesChange <= 0 ? "success" : "destructive"} className="text-xs font-normal">
                      {expensesChange > 0 ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          {expensesChange.toFixed(1)}%
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          {Math.abs(expensesChange).toFixed(1)}%
                        </>
                      )}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">from previous {period}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Net Profit Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className={`overflow-hidden border-l-4 ${netProfit >= 0 ? 'border-l-green-500' : 'border-l-red-500'} hover:shadow-md transition-all`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <div className={`h-8 w-8 rounded-full ${netProfit >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                <TrendingUp className={`h-4 w-4 ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isSalesLoading || isExpensesLoading ? (
                <>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </>
              ) : (
                <>
                  <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netProfit.toLocaleString()} ֏
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge variant={profitChange > 0 ? "success" : "destructive"} className="text-xs font-normal">
                      {profitChange > 0 ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          {profitChange.toFixed(1)}%
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          {Math.abs(profitChange).toFixed(1)}%
                        </>
                      )}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">from previous {period}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Inventory Value Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Boxes className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              {isInventoryLoading ? (
                <>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {inventoryValue.toLocaleString()} ֏
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="text-xs font-normal bg-blue-50">
                      {fuelTypeInventory.length} fuel types
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">in current stock</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-2">
        {/* Sales Trend Chart */}
        <motion.div 
          className="col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="h-full border shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Sales Overview</CardTitle>
                  <CardDescription className="text-sm">
                    Sales trend for the selected period
                  </CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="max-w-xs">Shows sales trend over time. Click on the graph to see detailed amounts.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="pl-2 pb-6">
              <div className="h-[300px]">
                {isSalesLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="space-y-4 w-full px-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-[250px] w-full rounded-lg" />
                    </div>
                  </div>
                ) : salesChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={salesChartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value.toLocaleString()}`}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <RechartsTooltip 
                        formatter={(value: any) => [`${Number(value).toLocaleString()} ֏`, "Sales"]}
                        labelFormatter={(date) => `Date: ${date}`}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center space-y-2">
                      <FileBarChart className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">No sales data available for this period</p>
                      <Badge variant="secondary" className="mx-auto mt-2">Try a different time period</Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Expenses by Category Chart */}
        <motion.div 
          className="col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="h-full border shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Expenses by Category</CardTitle>
                  <CardDescription className="text-sm">
                    Distribution of expenses for the selected period
                  </CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="max-w-xs">Shows expenses categorized by type. Hover over the bars for details.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="h-[300px]">
                {isExpensesLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="space-y-4 w-full px-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-[250px] w-full rounded-lg" />
                    </div>
                  </div>
                ) : expensesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={expensesByCategory}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <XAxis 
                        dataKey="category" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value.toLocaleString()}`}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <RechartsTooltip 
                        formatter={(value: any) => [`${Number(value).toLocaleString()} ֏`, "Amount"]}
                        labelFormatter={(category) => `Category: ${category}`}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                      />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <Bar 
                        dataKey="amount" 
                        fill="rgba(130, 202, 157, 0.8)" 
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                        animationDuration={1000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center space-y-2">
                      <BarChart4 className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">No expense data available for this period</p>
                      <Badge variant="secondary" className="mx-auto mt-2">Try a different time period</Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Inventory and Recent Activity Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-2">
        {/* Inventory by Fuel Type */}
        <motion.div 
          className="col-span-3" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="h-full border shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Inventory by Fuel Type</CardTitle>
                  <CardDescription className="text-sm">
                    Distribution of current inventory
                  </CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="max-w-xs">Shows current inventory breakdown by fuel type. Click on segments for details.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="h-[300px]">
                {isInventoryLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="space-y-4 w-full px-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-[250px] w-full rounded-full" />
                    </div>
                  </div>
                ) : fuelTypeInventory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fuelTypeInventory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        innerRadius={30}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {fuelTypeInventory.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={FUEL_TYPE_COLORS[entry.name as keyof typeof FUEL_TYPE_COLORS] || '#8884d8'} 
                            strokeWidth={1}
                            stroke="rgba(255,255,255,0.5)"
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: any) => [`${Number(value).toFixed(2)} liters`, "Volume"]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend 
                        iconSize={10}
                        iconType="circle"
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center space-y-2">
                      <Boxes className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">No inventory data available</p>
                      <Badge variant="secondary" className="mx-auto mt-2">Check inventory records</Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Recent Activity */}
        <motion.div 
          className="col-span-4" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="h-full border shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                  <CardDescription className="text-sm">
                    Latest transactions and events
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>View All</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              {(isSalesLoading || isExpensesLoading || isFuelSuppliesLoading) ? (
                <div className="space-y-3 pt-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[310px] pr-4">
                  {recentActivities.length > 0 ? (
                    <div className="space-y-3">
                      {recentActivities.map((activity, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-start gap-4 rounded-md border p-3 hover:bg-muted/20 transition-colors"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            activity.type === 'sale' ? 'bg-primary/10' : 
                            activity.type === 'expense' ? 'bg-destructive/10' : 'bg-blue-500/10'
                          }`}>
                            {activity.type === 'sale' && <DollarSign className="h-4 w-4 text-primary" />}
                            {activity.type === 'expense' && <CreditCard className="h-4 w-4 text-destructive" />}
                            {activity.type === 'supply' && <Package className="h-4 w-4 text-blue-500" />}
                          </div>
                          <div className="grid gap-1 w-full">
                            <div className="flex items-center justify-between w-full">
                              <p className="text-sm font-medium line-clamp-1">
                                {activity.description}
                              </p>
                              <Badge variant={activity.type === 'sale' ? 'success' : activity.type === 'expense' ? 'destructive' : 'outline'} className="ml-2 whitespace-nowrap text-xs">
                                {activity.type === 'expense' ? '-' : activity.type === 'sale' ? '+' : ''}
                                {Number(activity.amount).toLocaleString()} ֏
                              </Badge>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <CalendarDays className="h-3 w-3 mr-1" />
                              {format(parseISO(activity.date), 'PPP')}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center space-y-2">
                        <Activity className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">No recent activity for this period</p>
                        <Badge variant="secondary" className="mx-auto mt-2">Try a different time period</Badge>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
