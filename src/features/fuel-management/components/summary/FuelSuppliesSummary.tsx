import { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/core/components/ui/card";
import { CardGrid } from "@/core/components/ui/cards/card-grid";
import { MetricCard } from "@/core/components/ui/cards/metric-card";
import { MetricCardProps } from "@/core/components/ui/cards/types";
import { FuelSupply } from "../../types";
import { FuelType } from "@/types";
import {
  format,
  subDays,
  subMonths,
  subWeeks,
  isAfter,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
  isSameDay,
  startOfDay,
  endOfDay,
} from "date-fns";
import {
  TrendingUp,
  DollarSign,
  Droplet,
  Calendar,
  Fuel,
  CircleDollarSign,
  Filter,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { Skeleton } from "@/core/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { Badge } from "@/core/components/ui/primitives/badge";
import { Tabs, TabsList, TabsTrigger } from "@/core/components/ui/tabs";
import { Button } from "@/core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/primitives/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { Calendar as CalendarComponent } from "@/core/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/core/components/ui/dropdown-menu";

// Types for filters
type TimePeriod =
  | "all"
  | "week"
  | "month"
  | "3months"
  | "6months"
  | "year"
  | "custom";
type GroupingFilter = "fuelType" | "tank";
type DateRangeType = { from: Date | undefined; to: Date | undefined };

interface FuelSuppliesSummaryProps {
  supplies: FuelSupply[];
  loading?: boolean;
  className?: string;
  initialFilters?: {
    period?: TimePeriod;
    groupBy?: GroupingFilter;
    dateRange?: DateRangeType;
    fuelType?: string;
  };
  onFilteredSuppliesChange?: (filteredSupplies: FuelSupply[]) => void;
}

// Helper function to format numbers
const formatNumber = (num: number): string => {
  return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

// Create date range presets
const createDatePresets = (
  t: (key: string) => string
): Array<{ name: string; dates: DateRangeType; period: TimePeriod }> => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return [
    {
      name: t("common.today"),
      dates: { from: startOfDay(new Date()), to: endOfDay(new Date()) },
      period: "custom" as TimePeriod,
    },
    {
      name: t("common.yesterday"),
      dates: {
        from: startOfDay(subDays(new Date(), 1)),
        to: endOfDay(subDays(new Date(), 1)),
      },
      period: "custom" as TimePeriod,
    },
    {
      name: t("common.last7Days"),
      dates: {
        from: startOfDay(subDays(new Date(), 7)),
        to: endOfDay(new Date()),
      },
      period: "week" as TimePeriod,
    },
    {
      name: t("common.previousMonth"),
      dates: {
        from: startOfMonth(
          currentMonth === 0
            ? new Date(new Date().getFullYear() - 1, 11, 1)
            : new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
        ),
        to: endOfMonth(
          currentMonth === 0
            ? new Date(new Date().getFullYear() - 1, 11, 1)
            : new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
        ),
      },
      period: "month" as TimePeriod,
    },
    {
      name: t("common.last90Days"),
      dates: {
        from: startOfDay(subDays(new Date(), 90)),
        to: endOfDay(new Date()),
      },
      period: "3months" as TimePeriod,
    },
    {
      name: t("common.last6Months"),
      dates: {
        from: startOfDay(subMonths(new Date(), 6)),
        to: endOfDay(new Date()),
      },
      period: "6months" as TimePeriod,
    },
    {
      name: t("common.previousYear"),
      dates: {
        from: startOfYear(new Date(currentYear - 1, 0, 1)),
        to: endOfYear(new Date(currentYear - 1, 0, 1)),
      },
      period: "year" as TimePeriod,
    },
  ];
};

export function FuelSuppliesSummary({
  supplies,
  loading,
  className,
  initialFilters,
  onFilteredSuppliesChange,
}: FuelSuppliesSummaryProps) {
  const { t } = useTranslation();

  // State for filters
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(
    initialFilters?.period || "all"
  );
  const [groupBy, setGroupBy] = useState<GroupingFilter>(
    initialFilters?.groupBy || "fuelType"
  );
  const [dateRange, setDateRange] = useState<DateRangeType>(
    initialFilters?.dateRange || { from: undefined, to: undefined }
  );
  const [selectedFuelType, setSelectedFuelType] = useState<string>(
    initialFilters?.fuelType || "all"
  );

  // Create date presets
  const datePresets = useMemo(() => createDatePresets(t), [t]);

  // Check if custom date range is selected
  const isCustomRange =
    timePeriod === "custom" && dateRange.from && dateRange.to;

  // Get unique fuel types from supplies
  const uniqueFuelTypes = useMemo(() => {
    const types = new Set<string>();
    supplies.forEach((supply) => {
      if (supply.tank?.fuel_type) {
        types.add(supply.tank.fuel_type.toLowerCase());
      }
    });
    return Array.from(types);
  }, [supplies]);

  // Filter supplies by time period, date range, and fuel type
  const filteredSupplies = useMemo(() => {
    // First filter by fuel type if not "all"
    let result = supplies;

    if (selectedFuelType !== "all") {
      result = result.filter(
        (supply) =>
          supply.tank?.fuel_type?.toLowerCase() ===
          selectedFuelType.toLowerCase()
      );
    }

    // If not filtering by time, return all supplies
    if (timePeriod === "all") return result;

    // If using custom date range
    if (timePeriod === "custom" && dateRange.from && dateRange.to) {
      return result.filter((supply) => {
        const supplyDate =
          typeof supply.delivery_date === "string"
            ? parseISO(supply.delivery_date)
            : new Date(supply.delivery_date);

        // Normal date range check - the date-fns isWithinInterval is inclusive
        return isWithinInterval(supplyDate, {
          start: startOfDay(dateRange.from!),
          end: endOfDay(dateRange.to!),
        });
      });
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return result.filter((supply) => {
      // Ensure delivery_date is parsed correctly
      const supplyDate =
        typeof supply.delivery_date === "string"
          ? parseISO(supply.delivery_date)
          : new Date(supply.delivery_date);

      // Date filters for specific time periods
      switch (timePeriod) {
        case "week": {
          // Last 7 days
          const cutoffDate = startOfDay(subDays(now, 7));
          return isWithinInterval(supplyDate, {
            start: cutoffDate,
            end: endOfDay(now),
          });
        }
        case "month": {
          // Previous calendar month (not current)
          if (currentMonth === 0) {
            // If January, previous month is December of last year
            return isWithinInterval(supplyDate, {
              start: startOfMonth(new Date(currentYear - 1, 11, 1)),
              end: endOfMonth(new Date(currentYear - 1, 11, 1)),
            });
          } else {
            return isWithinInterval(supplyDate, {
              start: startOfMonth(new Date(currentYear, currentMonth - 1, 1)),
              end: endOfMonth(new Date(currentYear, currentMonth - 1, 1)),
            });
          }
        }
        case "3months": {
          // Last 90 days
          return isWithinInterval(supplyDate, {
            start: startOfDay(subDays(now, 90)),
            end: endOfDay(now),
          });
        }
        case "6months": {
          // Last 180 days
          return isWithinInterval(supplyDate, {
            start: startOfDay(subDays(now, 180)),
            end: endOfDay(now),
          });
        }
        case "year": {
          // Previous calendar year (not current)
          return isWithinInterval(supplyDate, {
            start: startOfYear(new Date(currentYear - 1, 0, 1)),
            end: endOfYear(new Date(currentYear - 1, 0, 1)),
          });
        }
        default:
          return true;
      }
    });
  }, [supplies, timePeriod, dateRange, selectedFuelType]);

  // Emit filtered supplies back to parent component
  useEffect(() => {
    if (onFilteredSuppliesChange) {
      onFilteredSuppliesChange(filteredSupplies);
    }
  }, [filteredSupplies, onFilteredSuppliesChange]);

  // Handle date range selection from calendar
  const handleDateRangeChange = (range: DateRangeType | undefined) => {
    // Handle case when range is undefined
    if (!range) {
      setDateRange({ from: undefined, to: undefined });
      return;
    }

    if (range.from && range.to) {
      // Make sure the date range covers the full days (inclusive)
      const normalizedRange = {
        from: startOfDay(range.from),
        to: endOfDay(range.to),
      };
      setDateRange(normalizedRange);
      setTimePeriod("custom");
    } else {
      setDateRange(range);
    }
  };

  // Handle preset selection
  const handlePresetSelect = (preset: {
    name: string;
    dates: DateRangeType;
    period: TimePeriod;
  }) => {
    setDateRange(preset.dates);
    setTimePeriod(preset.period);
  };

  // Clear all filters
  const clearFilters = () => {
    setTimePeriod("all");
    setDateRange({ from: undefined, to: undefined });
    setSelectedFuelType("all");
  };

  const summary = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const totalQuantity = filteredSupplies.reduce(
      (sum, supply) => sum + supply.quantity_liters,
      0
    );
    const totalCost = filteredSupplies.reduce(
      (sum, supply) => sum + supply.total_cost,
      0
    );
    const currentMonthSupplies = filteredSupplies.filter((supply) => {
      const supplyDate = new Date(supply.delivery_date);
      return (
        supplyDate.getMonth() === currentMonth &&
        supplyDate.getFullYear() === currentYear
      );
    });
    const currentMonthQuantity = currentMonthSupplies.reduce(
      (sum, supply) => sum + supply.quantity_liters,
      0
    );
    const currentMonthCost = currentMonthSupplies.reduce(
      (sum, supply) => sum + supply.total_cost,
      0
    );

    // Get latest delivery date
    const latestDelivery =
      filteredSupplies.length > 0
        ? new Date(
            Math.max(
              ...filteredSupplies.map((s) =>
                new Date(s.delivery_date).getTime()
              )
            )
          )
        : null;

    // Group statistics by the selected grouping filter
    const groupedStats = filteredSupplies.reduce(
      (acc, supply) => {
        // Determine the group key based on the selected grouping
        let groupKey: string;

        if (groupBy === "fuelType") {
          groupKey = supply.tank?.fuel_type || "unknown";
        } else {
          // groupBy === "tank"
          groupKey = supply.tank?.name || `tank_${supply.tank_id}` || "unknown";
        }

        if (!acc[groupKey]) {
          acc[groupKey] = {
            quantity: 0,
            cost: 0,
            count: 0,
            avgPrice: 0,
            fuelType: supply.tank?.fuel_type || "unknown",
            tankId: supply.tank_id,
            tankName: supply.tank?.name,
          };
        }

        acc[groupKey].quantity += supply.quantity_liters;
        acc[groupKey].cost += supply.total_cost;
        acc[groupKey].count += 1;

        return acc;
      },
      {} as Record<
        string,
        {
          quantity: number;
          cost: number;
          count: number;
          avgPrice: number;
          fuelType: string;
          tankId: string;
          tankName?: string;
        }
      >
    );

    // Calculate average prices
    Object.keys(groupedStats).forEach((key) => {
      if (groupedStats[key].quantity > 0) {
        groupedStats[key].avgPrice =
          groupedStats[key].cost / groupedStats[key].quantity;
      }
    });

    return {
      totalQuantity,
      totalCost,
      currentMonthQuantity,
      currentMonthCost,
      suppliesCount: filteredSupplies.length,
      latestDelivery,
      groupedStats,
      // Keep original fuel type stats for backward compatibility
      fuelTypeStats: groupBy === "fuelType" ? groupedStats : {},
    };
  }, [filteredSupplies, groupBy]);

  // Create metrics for the CardGrid component
  const metrics = useMemo<MetricCardProps[]>(() => {
    if (loading) {
      // Return loading placeholders
      return Array(3).fill({
        title: "Loading...",
        value: "Loading...",
        description: "Loading...",
        isLoading: true,
      });
    }

    // Create time period label for description
    let periodLabel = "";

    if (timePeriod === "custom" && dateRange.from && dateRange.to) {
      periodLabel = `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    } else {
      periodLabel =
        timePeriod === "all"
          ? t("common.allTime")
          : timePeriod === "week"
            ? t("common.last7Days") || "Last 7 Days"
            : timePeriod === "month"
              ? t("common.previousMonth") || "Previous Month"
              : timePeriod === "3months"
                ? t("common.last90Days")
                : timePeriod === "6months"
                  ? t("common.last6Months")
                  : t("common.previousYear") || "Previous Year";
    }

    return [
      {
        title: t("fuelSupplies.totalSupplies"),
        value: `${formatNumber(summary.totalQuantity)} ${t("common.liters")}`,
        description: t("fuelSupplies.totalCount", {
          count: summary.suppliesCount,
        }),
        icon: <Fuel className="h-5 w-5" />,
      },
      {
        title: periodLabel,
        value: `${formatNumber(summary.suppliesCount)}`,
        description: t("fuelSupplies.supplies"),
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        title: t("common.totalCost"),
        value: `${formatNumber(summary.totalCost)} ֏`,
        description: `${t("fuelSupplies.avgPricePerLiter")}: ${formatNumber(summary.totalQuantity > 0 ? summary.totalCost / summary.totalQuantity : 0)} ֏`,
        icon: <CircleDollarSign className="h-5 w-5" />,
      },
    ];
  }, [loading, summary, t, timePeriod, dateRange]);

  // Get color for fuel type
  const getFuelTypeColor = (fuelType: string): string => {
    switch (fuelType.toLowerCase()) {
      case "petrol":
        return "bg-green-500";
      case "diesel":
        return "bg-yellow-500";
      case "cng":
        return "bg-blue-500";
      case "gas":
        return "bg-purple-500";
      case "kerosene":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get translated fuel type name
  const getFuelTypeName = (fuelType: string): string => {
    switch (fuelType.toLowerCase()) {
      case "petrol":
        return t("common.petrol");
      case "diesel":
        return t("common.diesel");
      case "cng":
        return t("common.cng");
      case "gas":
        return t("common.gas") || "Gas";
      case "kerosene":
        return t("common.kerosene") || "Kerosene";
      default:
        return t("common.unknown");
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Enhanced Filter controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-2">
        <h2 className="text-xl font-semibold">{t("fuelSupplies.summary")}</h2>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Time period filter with date range picker */}
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {isCustomRange ? (
                    <span className="text-xs sm:text-sm truncate max-w-[150px]">
                      {format(dateRange.from!, "MMM d, yyyy")} -{" "}
                      {format(dateRange.to!, "MMM d, yyyy")}
                    </span>
                  ) : (
                    <span>
                      {timePeriod === "all"
                        ? t("common.allTime")
                        : timePeriod === "week"
                          ? t("common.last7Days")
                          : timePeriod === "month"
                            ? t("common.previousMonth")
                            : timePeriod === "3months"
                              ? t("common.last90Days")
                              : timePeriod === "6months"
                                ? t("common.last6Months")
                                : t("common.previousYear")}
                    </span>
                  )}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-3 border-b">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">
                      {t("common.selectDateRange")}
                    </h4>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      {t("common.clear")}
                    </Button>
                  </div>

                  {/* Date Presets */}
                  <div className="grid grid-cols-2 gap-1">
                    {datePresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "justify-start text-xs h-8",
                          (timePeriod === preset.period &&
                            preset.period !== "custom") ||
                            (preset.period === "custom" &&
                              dateRange.from &&
                              dateRange.to &&
                              preset.dates.from &&
                              preset.dates.to &&
                              isSameDay(dateRange.from, preset.dates.from) &&
                              isSameDay(dateRange.to, preset.dates.to))
                            ? "bg-primary/10"
                            : ""
                        )}
                        onClick={() => handlePresetSelect(preset)}
                      >
                        {preset.name}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "justify-start text-xs h-8",
                        timePeriod === "all" ? "bg-primary/10" : ""
                      )}
                      onClick={() => {
                        setTimePeriod("all");
                        setDateRange({ from: undefined, to: undefined });
                      }}
                    >
                      {t("common.allTime")}
                    </Button>
                  </div>
                </div>

                {/* Calendar picker */}
                <div className="p-3">
                  <h4 className="text-sm font-medium mb-2">
                    {t("common.customRange")}
                  </h4>
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: dateRange.from || undefined,
                      to: dateRange.to || undefined,
                    }}
                    onSelect={handleDateRangeChange}
                    initialFocus
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Fuel Type filter */}
          <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
            <SelectTrigger className="w-[150px]">
              <span className="flex items-center gap-2">
                <Fuel className="h-4 w-4" />
                {selectedFuelType === "all"
                  ? t("common.allFuelTypes") || "All Fuel Types"
                  : getFuelTypeName(selectedFuelType)}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("common.allFuelTypes") || "All Fuel Types"}
              </SelectItem>
              {uniqueFuelTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {getFuelTypeName(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Group by filter */}
          <Select
            value={groupBy}
            onValueChange={(value: GroupingFilter) => setGroupBy(value)}
          >
            <SelectTrigger className="w-[150px]">
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {t("common.groupBy")}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fuelType">{t("common.fuelType")}</SelectItem>
              <SelectItem value="tank">{t("common.tanks")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <CardGrid 
        columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }} 
        gap="gap-4"
        className="mb-6"
      >
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            isLoading={metric.isLoading}
          />
        ))}
      </CardGrid>

      {/* Grouped Data Breakdown */}
      {!loading && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            {groupBy === "fuelType"
              ? t("fuelSupplies.fuelTypeBreakdown")
              : t("fuelSupplies.tankBreakdown") || "Tank Breakdown"}
          </h3>
          <div className="compact-card-grid">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(summary.groupedStats)
                .sort((a, b) => b[1].quantity - a[1].quantity) // Sort by quantity desc
                .map(([key, stats]) => {
                  const colorClass = getFuelTypeColor(stats.fuelType);
                  const displayName =
                    groupBy === "fuelType"
                      ? getFuelTypeName(key)
                      : stats.tankName || `Tank ${key}`;

                  return (
                    <Card key={key} className="overflow-hidden">
                      <div className={`h-1 w-full ${colorClass}`} />
                      <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between items-center text-base">
                          <span className="truncate" title={displayName}>
                            {displayName}
                          </span>
                          <Badge variant="outline" className="font-normal">
                            {stats.count}{" "}
                            {t("common.supplies").toLowerCase() || "supplies"}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex justify-between">
                          <span>
                            {formatNumber(stats.quantity)} {t("common.liters")}
                          </span>
                          {groupBy === "tank" && (
                            <span className="text-xs">
                              {getFuelTypeName(stats.fuelType)}
                            </span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {t("fuelSupplies.avgPricePerLiter")}:
                            </span>
                            <span className="font-medium">
                              {formatNumber(stats.avgPrice)} ֏
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {t("common.totalCost")}:
                            </span>
                            <span className="font-medium">
                              {formatNumber(stats.cost)} ֏
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`${colorClass} h-full`}
                            style={{
                              width: `${(stats.quantity / summary.totalQuantity) * 100}%`,
                            }}
                          />
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Loading state for breakdown */}
      {loading && (
        <div className="mt-6">
          <Skeleton className="h-7 w-48 mb-3" />
          <div className="compact-card-grid">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Skeleton className="h-2 w-full rounded-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
