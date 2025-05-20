import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  LabelList,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/core/components/ui/card';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Info,
  PieChart
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/useResponsive';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from '@/core/components/ui/tooltip';
import { fetchDashboardData } from '../services/dashboard';
import type { DashboardData } from '../types';

// Types
interface ChartDataItem {
  month: string;
  fullMonth: string;
  income: number;
  expense: number;
  profit: number;
  isPositive: boolean;
  index: number;
}

// Professional color palette
const COLORS = {
  income: {
    main: '#38bdf8', // Bright blue
    light: '#bae6fd',
    dark: '#0369a1'
  },
  expense: {
    main: '#fb7185', // Coral pink
    light: '#fed7e2',
    dark: '#e11d48'
  },
  profit: {
    main: '#34d399', // Emerald green
    light: '#a7f3d0',
    dark: '#059669'
  },
  loss: {
    main: '#f43f5e', // Red
    light: '#fecdd3',
    dark: '#be123c'
  },
  neutral: {
    grid: 'rgba(148, 163, 184, 0.2)',
    line: 'rgba(148, 163, 184, 0.5)',
    reference: 'rgba(148, 163, 184, 0.7)'
  }
};

export function IncomeExpenseOverview() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [chartType, setChartType] = useState<"monthly" | "total">("monthly");
  
  // Helper function to safely get translations with fallbacks
  const safeT = (key: string, fallback: string) => {
    try {
      const translation = t(key);
      return translation === key ? fallback : translation;
    } catch (error) {
      return fallback;
    }
  };
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
  });
  
  // Process data for the chart
  const chartData = useMemo<ChartDataItem[]>(() => {
    if (!dashboardData) return [];

    // Get the last 6 months
    const months = Array.from({ length: 6 }).map((_, idx) => {
      const date = subMonths(new Date(), 5 - idx);
      return {
        date,
        monthLabel: format(date, 'MMM yyyy'),
        month: format(date, 'yyyy-MM'),
        startOfMonth: startOfMonth(date),
        endOfMonth: endOfMonth(date),
      };
    });

    // Group sales by month
    const salesByMonth = months.map(({ month, monthLabel, startOfMonth, endOfMonth }) => {
      const monthSales = dashboardData.sales.filter(sale => {
        const saleDate = new Date(sale.date || sale.created_at || '');
        return saleDate >= startOfMonth && saleDate <= endOfMonth;
      });
      
      const totalSales = monthSales.reduce((sum, sale) => sum + (sale.total_sales || 0), 0);
      return { month, monthLabel, sales: totalSales };
    });

    // Group expenses by month
    const expensesByMonth = months.map(({ month, monthLabel, startOfMonth, endOfMonth }) => {
      const monthExpenses = dashboardData.expenses.filter(expense => {
        const expenseDate = new Date(expense.date || expense.created_at || '');
        return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
      });
      
      const totalExpenses = monthExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
      return { month, monthLabel, expenses: totalExpenses };
    });

    // Merge sales and expenses data
    return months.map(({ month, monthLabel }, index) => {
      const salesData = salesByMonth.find(s => s.month === month);
      const expensesData = expensesByMonth.find(e => e.month === month);
      
      const income = salesData?.sales || 0;
      const expense = expensesData?.expenses || 0;
      const profit = income - expense;
      
      return {
        month: isMobile ? format(new Date(month), 'MMM') : monthLabel,
        fullMonth: monthLabel,
        income,
        expense,
        profit,
        isPositive: profit >= 0,
        index
      };
    });
  }, [dashboardData, isMobile]);
  
  // Calculate totals for the summary
  const totals = useMemo(() => {
    const totalIncome = chartData.reduce((sum, item) => sum + item.income, 0);
    const totalExpense = chartData.reduce((sum, item) => sum + item.expense, 0);
    const totalProfit = totalIncome - totalExpense;
    const profitGrowth = chartData.length >= 2 
      ? ((chartData[chartData.length - 1].profit - chartData[chartData.length - 2].profit) / 
         Math.abs(chartData[chartData.length - 2].profit || 1)) * 100
      : 0;
    
    // Calculate month-over-month changes
    const incomeChange = chartData.length >= 2
      ? ((chartData[chartData.length - 1].income - chartData[chartData.length - 2].income) /
         Math.abs(chartData[chartData.length - 2].income || 1)) * 100
      : 0;
      
    const expenseChange = chartData.length >= 2
      ? ((chartData[chartData.length - 1].expense - chartData[chartData.length - 2].expense) /
         Math.abs(chartData[chartData.length - 2].expense || 1)) * 100
      : 0;
    
    return {
      income: totalIncome,
      expense: totalExpense,
      profit: totalProfit,
      profitGrowth: profitGrowth || 0,
      incomeChange: incomeChange || 0,
      expenseChange: expenseChange || 0,
      profitRatio: totalIncome > 0 ? (totalProfit / totalIncome) * 100 : 0
    };
  }, [chartData]);

  // Handle mouse/touch interaction
  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
      const expense = payload.find((p: any) => p.dataKey === 'expense')?.value || 0;
      const profit = income - expense;
      const isProfit = profit >= 0;
      
      return (
        <div className="rounded-lg border bg-background p-4 shadow-lg animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          <div className="mb-2 flex items-center">
            <span className="text-sm font-semibold tracking-tight">{payload[0]?.payload?.fullMonth || label}</span>
          </div>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={`tooltip-${index}`} className="flex justify-between items-center gap-6 text-sm">
                <span className="flex items-center gap-1.5">
                  <span 
                    className="inline-block w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{entry.name}:</span>
                </span>
                <span className="font-semibold">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-muted">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-1.5">
                <span 
                  className={`inline-block w-3 h-3 rounded-full ${isProfit ? 'bg-emerald-500' : 'bg-rose-500'}`}
                />
                <span>{t('dashboard.netProfit')}:</span>
              </span>
              <span className={`font-semibold ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(profit)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Summary card component
  const SummaryItem = ({ 
    title, 
    value, 
    change, 
    icon, 
    color, 
    prefix = "֏",
    suffix,
    compact = false
  }: { 
    title: string; 
    value: number; 
    change?: number; 
    icon: React.ReactNode; 
    color: string;
    prefix?: string;
    suffix?: string;
    compact?: boolean;
  }) => {
    const isPositive = (change || 0) >= 0;
    const changeIcon = isPositive ? <ArrowUpRight className={`h-4 w-4 ${color}`} /> : <ArrowDownRight className={`h-4 w-4 text-rose-500`} />;
    
    return (
      <div className={cn(
        "rounded-lg bg-background border p-3 lg:p-4 flex flex-col justify-between", 
        compact ? "h-[100px]" : "h-[120px]"
      )}>
        <div className="flex justify-between items-start">
          <span className="text-sm text-muted-foreground">{title}</span>
          <span className={`rounded-full p-1.5 bg-opacity-20 ${color.replace('text-', 'bg-')}`}>
            {icon}
          </span>
        </div>
        <div className="mt-1">
          <div className="text-2xl font-bold tracking-tight">
            {prefix && <span className="text-lg font-normal mr-0.5">{prefix}</span>}
            {value.toLocaleString()}
            {suffix && <span className="text-sm font-normal ml-0.5">{suffix}</span>}
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-1 text-xs">
              {changeIcon}
              <span className={isPositive ? color : "text-rose-500"}>
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">{t('dashboard.vsLastMonth')}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-xl md:text-2xl font-bold">
            {t("dashboard.incomeExpenseOverview")}
          </CardTitle>
          <Tabs 
            value={chartType} 
            className="w-full sm:w-auto" 
            onValueChange={(val) => setChartType(val as "monthly" | "total")}
          >
            <TabsList className="grid grid-cols-2 w-full sm:w-[240px]">
              <TabsTrigger value="monthly" className="text-xs sm:text-sm">
                {safeT("common.monthlyView", "Monthly View")}
              </TabsTrigger>
              <TabsTrigger value="total" className="text-xs sm:text-sm">
                {safeT("common.summaryView", "Summary View")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="monthly" className="mt-0">
              <div className="h-[300px] md:h-[350px] w-full">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-md">
                    <p>{t("common.loading")}</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: isMobile ? 10 : 20,
                        left: isMobile ? 0 : 20,
                        bottom: 20,
                      }}
                      barGap={isMobile ? 2 : 4}
                      barSize={isMobile ? 12 : 20}
                      onMouseMove={(data: any) => {
                        if (data.activeTooltipIndex !== undefined) {
                          handleMouseEnter(data, data.activeTooltipIndex);
                        }
                      }}
                      onMouseLeave={handleMouseLeave}
                      onClick={(data: any) => {
                        if (data.activeTooltipIndex !== undefined) {
                          setActiveIndex(activeIndex === data.activeTooltipIndex ? null : data.activeTooltipIndex);
                        }
                      }}
                      className="touch-manipulation"
                    >
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.income.main} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.income.main} stopOpacity={0.4}/>
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.expense.main} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.expense.main} stopOpacity={0.4}/>
                        </linearGradient>
                        <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.profit.main} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.profit.main} stopOpacity={0.4}/>
                        </linearGradient>
                        <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.loss.main} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.loss.main} stopOpacity={0.4}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        vertical={!isMobile}
                        horizontal={true}
                        stroke={COLORS.neutral.grid} 
                      />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: isMobile ? 9 : 12, fill: '#64748b' }} 
                        tickMargin={6}
                        axisLine={{ stroke: COLORS.neutral.line }}
                        tickLine={{ stroke: COLORS.neutral.line }}
                        dy={5}
                      />
                      <YAxis 
                        tickFormatter={(value) => isMobile ? 
                          `${(value / 1000000).toFixed(0)}M` : 
                          `${(value / 1000000).toFixed(1)}M`
                        }
                        tick={{ fontSize: isMobile ? 9 : 11, fill: '#64748b' }}
                        width={isMobile ? 35 : 50}
                        axisLine={{ stroke: COLORS.neutral.line }}
                        tickLine={{ stroke: COLORS.neutral.line }}
                        dx={isMobile ? -5 : 0}
                      />
                      <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(236, 240, 243, 0.4)' }}
                        wrapperStyle={{ outline: 'none' }}
                      />
                      <Legend 
                        iconSize={isMobile ? 8 : 10} 
                        iconType="circle"
                        verticalAlign="top"
                        wrapperStyle={{ paddingBottom: '10px' }}
                        formatter={(value, entry, index) => (
                          <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                            {value}
                          </span>
                        )}
                      />
                      <ReferenceLine 
                        y={0} 
                        stroke={COLORS.neutral.reference} 
                        strokeDasharray="3 3" 
                        ifOverflow="extendDomain"
                      />
                      <Bar 
                        name={t("dashboard.income")} 
                        dataKey="income" 
                        fill="url(#incomeGradient)" 
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                        isAnimationActive={true}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`income-${index}`}
                            fill={activeIndex === index ? COLORS.income.dark : "url(#incomeGradient)"}
                            strokeWidth={activeIndex === index ? 2 : 0}
                            className="transition-all duration-300 ease-in-out"
                          />
                        ))}
                      </Bar>
                      <Bar 
                        name={t("dashboard.expense")} 
                        dataKey="expense" 
                        fill="url(#expenseGradient)" 
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                        isAnimationActive={true}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`expense-${index}`}
                            fill={activeIndex === index ? COLORS.expense.dark : "url(#expenseGradient)"}
                            strokeWidth={activeIndex === index ? 2 : 0}
                          />
                        ))}
                      </Bar>
                      <Bar 
                        name={t("dashboard.profit")} 
                        dataKey="profit" 
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                        isAnimationActive={true}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`profit-${index}`}
                            fill={activeIndex === index 
                              ? (entry.profit >= 0 ? COLORS.profit.dark : COLORS.loss.dark)
                              : (entry.profit >= 0 ? "url(#profitGradient)" : "url(#lossGradient)")
                            }
                            strokeWidth={activeIndex === index ? 2 : 0}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </TabsContent>
            <TabsContent value="total" className="mt-0">
              <div className="h-[300px] md:h-[350px] w-full">
                {/* Add your summary view content here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <CardDescription className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
          <span>{t("dashboard.last6MonthsFinancial")}</span>
          <span className="flex items-center gap-2 text-sm">
            <span>{t("dashboard.netProfit")}:</span>
            <span className={`font-semibold flex items-center ${totals.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(totals.profit)}
              {totals.profitGrowth !== 0 && (
                <>
                  {totals.profitGrowth > 0 
                    ? <ArrowUpRight className="ml-1 h-4 w-4 text-emerald-600" /> 
                    : <ArrowDownRight className="ml-1 h-4 w-4 text-rose-600" />}
                  <span className="text-xs ml-1">
                    {Math.abs(totals.profitGrowth).toFixed(1)}%
                  </span>
                </>
              )}
            </span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Remove the old TabsContent here since it's now properly nested */}
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          <span>
            {chartType === "monthly" 
              ? safeT("dashboard.clickBarForDetails", "Click on a bar for more details")
              : safeT("dashboard.switchToMonthlyView", "Switch to monthly view for detailed breakdown")
            }
          </span>
        </div>
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-full bg-sky-500"></span>
                  <span className="text-xs">{t("dashboard.income")}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{safeT("dashboard.incomeTooltip", "Total revenue from sales for the period")}</p>
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>
          
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="text-xs">{t("dashboard.expense")}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{safeT("dashboard.expenseTooltip", "Total business expenses for the period")}</p>
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>
          
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs">{t("dashboard.profit")}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{safeT("dashboard.profitTooltip", "Net profit calculated as income minus expenses")}</p>
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
} 