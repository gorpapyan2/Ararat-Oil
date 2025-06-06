import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Bell,
  Settings,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  RefreshCw,
  Download,
  Filter,
  Eye,
  EyeOff,
} from 'lucide-react';

import { cn } from '@/shared/utils';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/primitives/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdownmenu';
import { Progress } from '@/core/components/ui/progress';
import { Skeleton } from '@/core/components/ui/skeleton';

export type WidgetType = 
  | 'metric' 
  | 'chart' 
  | 'table' 
  | 'progress' 
  | 'activity' 
  | 'calendar' 
  | 'notifications'
  | 'custom';

export type WidgetSize = 'sm' | 'md' | 'lg' | 'xl';

interface ChartSummaryItem {
  value: string | number;
  label: string;
}

interface ProgressItem {
  label: string;
  value: number;
}

interface ActivityItem {
  title: string;
  time: string;
  status?: string;
}

interface WidgetData {
  // For chart widgets
  summary?: ChartSummaryItem[];
  // For progress widgets  
  items?: ProgressItem[];
  // For activity widgets
  activities?: ActivityItem[];
  // For metric widgets
  label?: string;
  value?: string | number;
  change?: string | number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  size: WidgetSize;
  position: { x: number; y: number };
  visible: boolean;
  refreshable?: boolean;
  exportable?: boolean;
  configurable?: boolean;
  data?: WidgetData;
  loading?: boolean;
  error?: string;
  lastUpdated?: Date;
  autoRefresh?: number; // in seconds;
}

export interface DashboardWidgetsProps {
  widgets: WidgetConfig[];
  onWidgetUpdate: (widgetId: string, updates: Partial<WidgetConfig>) => void;
  onWidgetReorder: (newOrder: WidgetConfig[]) => void;
  onWidgetRefresh?: (widgetId: string) => void;
  onWidgetExport?: (widgetId: string) => void;
  onWidgetConfigure?: (widgetId: string) => void;
  editable?: boolean;
  gridMode?: boolean;
  className?: string;
}

const WIDGET_SIZES = {
  sm: 'col-span-1 row-span-1',
  md: 'col-span-2 row-span-1', 
  lg: 'col-span-2 row-span-2',
  xl: 'col-span-3 row-span-2',
};

const WIDGET_ICONS = {
  metric: DollarSign,
  chart: BarChart3,
  table: Activity,
  progress: PieChart,
  activity: Bell,
  calendar: Calendar,
  notifications: Bell,
  custom: Settings,
};

function WidgetSkeleton({ size }: { size: WidgetSize }) {
  return (
    <Card className={cn('w-full h-full', WIDGET_SIZES[size])}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-3 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
}

function WidgetHeader({
  widget,
  onRefresh,
  onExport,
  onConfigure,
  onToggleVisible,
  onSizeChange,
  editable = false,
}: {
  widget: WidgetConfig;
  onRefresh?: () => void;
  onExport?: () => void;
  onConfigure?: () => void;
  onToggleVisible?: () => void;
  onSizeChange?: (size: WidgetSize) => void;
  editable?: boolean;
}) {
  const Icon = WIDGET_ICONS[widget.type] || Settings;

  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-gray-500" />
          <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          {!widget.visible && (
            <Badge variant="secondary" className="text-xs">
              Hidden
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {widget.lastUpdated && (
            <span className="text-xs text-gray-500">
              {new Date(widget.lastUpdated).toLocaleTimeString()}
            </span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {widget.refreshable && onRefresh && (
                <DropdownMenuItem onClick={onRefresh} disabled={widget.loading}>
                  <RefreshCw className={cn(
                    "h-4 w-4 mr-2",
                    widget.loading && "animate-spin"
                  )} />
                  Refresh
                </DropdownMenuItem>
              )}

              {widget.exportable && onExport && (
                <DropdownMenuItem onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
              )}

              {editable && (
                <>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={onToggleVisible}>
                    {widget.visible ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Show
                      </>
                    )}
                  </DropdownMenuItem>

                  {onSizeChange && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <DropdownMenuItem>
                          <Maximize2 className="h-4 w-4 mr-2" />
                          Resize
                        </DropdownMenuItem>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        {Object.keys(WIDGET_SIZES).map((size) => (
                          <DropdownMenuItem
                            key={size}
                            onClick={() => onSizeChange(size as WidgetSize)}
                            className={cn(
                              widget.size === size && "bg-gray-100 dark:bg-gray-800"
                            )}
                          >
                            {size.toUpperCase()}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {widget.configurable && onConfigure && (
                    <DropdownMenuItem onClick={onConfigure}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {widget.description && (
        <CardDescription className="text-xs">
          {widget.description}
        </CardDescription>
      )}
    </CardHeader>
  );
}

function MetricWidget({ widget }: { widget: WidgetConfig }) {
  const { data } = widget;
  
  if (!data) return null;

  return (
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {data.label || 'Metric'}
          </p>
          <p className="text-2xl font-bold">
            {data.value || '0'}
          </p>
          {data.change && (
            <p className={cn(
              "text-sm font-medium",
              data.trend === 'up' ? "text-green-600" : 
              data.trend === 'down' ? "text-red-600" : 
              "text-gray-600"
            )}>
              {typeof data.change === 'number' ? `${data.change > 0 ? '+' : ''}${data.change}%` : data.change}
            </p>
          )}
        </div>
        {data.icon && (
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            data.color ? `bg-${data.color}-50` : "bg-gray-50"
          )}>
            <data.icon className={cn(
              "w-6 h-6", 
              data.color ? `text-${data.color}-600` : "text-gray-600"
            )} />
          </div>
        )}
      </div>
    </CardContent>
  );
}

function ChartWidget({ widget }: { widget: WidgetConfig }) {
  const { data } = widget;

  return (
    <CardContent>
      <div className="h-32 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
        <BarChart3 className="h-8 w-8 text-gray-400" />
        <span className="ml-2 text-sm text-gray-500">Chart Component</span>
      </div>
      
      {data?.summary && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {data.summary.map((item: ChartSummaryItem, index: number) => (
            <div key={index}>
              <div className="text-lg font-semibold">{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  );
}

function ProgressWidget({ widget }: { widget: WidgetConfig }) {
  const { data } = widget;

  if (!data) return null;

  return (
    <CardContent>
      <div className="space-y-4">
        {data.items?.map((item: ProgressItem, index: number) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{item.label}</span>
              <span className="font-medium">{item.value}%</span>
            </div>
            <Progress value={item.value} className="h-2" />
          </div>
        ))}
      </div>
    </CardContent>
  );
}

function ActivityWidget({ widget }: { widget: WidgetConfig }) {
  const { data } = widget;

  if (!data) return null;

  return (
    <CardContent>
      <div className="space-y-3">
        {data.activities?.slice(0, 5).map((activity: ActivityItem, index: number) => (
          <div key={index} className="flex items-center gap-3">
            <div className="h-2 w-2 bg-blue-500 rounded-full" />
            <div className="flex-1 text-sm">
              <div className="font-medium">{activity.title}</div>
              <div className="text-gray-500 text-xs">{activity.time}</div>
            </div>
            {activity.status && (
              <Badge variant="outline" className="text-xs">
                {activity.status}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  );
}

function WidgetContent({ widget }: { widget: WidgetConfig }) {
  if (widget.loading) {
    return (
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
    );
  }

  if (widget.error) {
    return (
      <CardContent>
        <div className="text-center py-8">
          <div className="text-red-500 text-sm mb-2">Error loading widget</div>
          <div className="text-xs text-gray-500">{widget.error}</div>
        </div>
      </CardContent>
    );
  }

  switch (widget.type) {
    case 'metric':
      return <MetricWidget widget={widget} />;
    case 'chart':
      return <ChartWidget widget={widget} />;
    case 'progress':
      return <ProgressWidget widget={widget} />;
    case 'activity':
      return <ActivityWidget widget={widget} />;
    default:
      return (
        <CardContent>
          <div className="text-center py-8 text-gray-500 text-sm">
            Widget type not implemented
          </div>
        </CardContent>
      );
  }
}

const Widget = React.forwardRef<
  HTMLDivElement,
  {
    widget: WidgetConfig;
    onUpdate: (updates: Partial<WidgetConfig>) => void;
    onRefresh?: () => void;
    onExport?: () => void;
    onConfigure?: () => void;
    editable?: boolean;
  }
>(function Widget({
  widget,
  onUpdate,
  onRefresh,
  onExport,
  onConfigure,
  editable = false,
}, ref) {
  if (!widget.visible) {
    return null;
  }

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn('w-full', WIDGET_SIZES[widget.size])}
    >
      <Card className="h-full">
        <WidgetHeader
          widget={widget}
          onRefresh={onRefresh}
          onExport={onExport}
          onConfigure={onConfigure}
          onToggleVisible={() => onUpdate({ visible: !widget.visible })}
          onSizeChange={(size) => onUpdate({ size })}
          editable={editable}
        />
        
        <WidgetContent widget={widget} />
      </Card>
    </motion.div>
  );
});

export function DashboardWidgets({
  widgets,
  onWidgetUpdate,
  onWidgetReorder,
  onWidgetRefresh,
  onWidgetExport,
  onWidgetConfigure,
  editable = false,
  gridMode = true,
  className,
}: DashboardWidgetsProps) {
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const visibleWidgets = useMemo(
    () => widgets.filter(widget => widget.visible),
    [widgets]
  );

  const handleWidgetUpdate = useCallback(
    (widgetId: string, updates: Partial<WidgetConfig>) => {
      onWidgetUpdate(widgetId, updates);
    },
    [onWidgetUpdate]
  );

  if (gridMode) {
    return (
      <div className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-min',
        className
      )}>
        <AnimatePresence mode="popLayout">
          {visibleWidgets.map((widget) => (
            <Widget
              key={widget.id}
              widget={widget}
              onUpdate={(updates) => handleWidgetUpdate(widget.id, updates)}
              onRefresh={() => onWidgetRefresh?.(widget.id)}
              onExport={() => onWidgetExport?.(widget.id)}
              onConfigure={() => onWidgetConfigure?.(widget.id)}
              editable={editable}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  }

  // Reorderable list mode
  if (editable) {
    return (
      <Reorder.Group
        axis="y"
        values={visibleWidgets}
        onReorder={onWidgetReorder}
        className={cn('space-y-4', className)}
      >
        <AnimatePresence mode="popLayout">
          {visibleWidgets.map((widget) => (
            <Reorder.Item
              key={widget.id}
              value={widget}
              onDragStart={() => setDraggedWidget(widget.id)}
              onDragEnd={() => setDraggedWidget(null)}
              className={cn(
                'cursor-grab active:cursor-grabbing',
                draggedWidget === widget.id && 'z-10 scale-105 shadow-lg'
              )}
            >
              <Widget
                widget={widget}
                onUpdate={(updates) => handleWidgetUpdate(widget.id, updates)}
                onRefresh={() => onWidgetRefresh?.(widget.id)}
                onExport={() => onWidgetExport?.(widget.id)}
                onConfigure={() => onWidgetConfigure?.(widget.id)}
                editable={editable}
              />
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    );
  }

  // Static list mode
  return (
    <div className={cn('space-y-4', className)}>
      <AnimatePresence mode="popLayout">
        {visibleWidgets.map((widget) => (
          <Widget
            key={widget.id}
            widget={widget}
            onUpdate={(updates) => handleWidgetUpdate(widget.id, updates)}
            onRefresh={() => onWidgetRefresh?.(widget.id)}
            onExport={() => onWidgetExport?.(widget.id)}
            onConfigure={() => onWidgetConfigure?.(widget.id)}
            editable={editable}
          />
        ))}
      </AnimatePresence>
    </div>
  );
} 