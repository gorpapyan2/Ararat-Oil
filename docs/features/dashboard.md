# Dashboard Feature

## Overview

The Dashboard feature provides a comprehensive overview of the business operations, including fuel levels, sales data, financial metrics, and inventory status. It serves as the central command center for monitoring all aspects of the fuel station. The dashboard provides:

- Real-time monitoring of fuel levels across all tanks
- Sales summaries with different timeframes (daily, weekly, monthly)
- Financial metrics including revenue, expenses, and profit
- Inventory value and status tracking
- Performance indicators and key metrics

## Architecture

The feature follows the standardized feature-based architecture:

```
src/features/dashboard/
├── hooks/                  # React Query hooks
│   ├── useDashboard.ts     # Hooks for dashboard data
│   └── index.ts            # Export file
├── services/               # API service functions
│   ├── index.ts            # Core API integration
│   └── dashboard.ts        # Original service implementation
├── types/                  # TypeScript type definitions
│   └── index.ts            # Dashboard data types
├── components/             # React components
│   ├── DashboardMetrics.tsx
│   ├── IncomeExpenseOverview.tsx
│   └── [other components]
└── index.ts                # Feature-level exports
```

## Types

The main types in this feature are:

- `DashboardData`: Comprehensive type containing all dashboard data (sales, expenses, tanks, metrics)
- Additional specific types for different data sections (via imports from other features)

## Services

The service layer provides the following functions:

- `getDashboardData()`: Get comprehensive dashboard data including sales, tanks, and financial metrics
- `getFuelLevels()`: Get real-time fuel levels for all tanks
- `getSalesSummary(timeframe)`: Get sales summary data for a specific timeframe
- `getFinancialDashboard()`: Get financial metrics and trends

The service layer aggregates data from multiple core API endpoints including dashboard, financials, tanks, and sales.

## Hooks

The feature provides specialized React Query hooks for different dashboard data needs:

- `useDashboardData()`: Main hook for fetching comprehensive dashboard data
- `useFuelLevels()`: Hook for real-time fuel level monitoring
- `useSalesSummary(timeframe)`: Hook for sales summaries with different timeframes
- `useFinancialDashboard()`: Hook for financial metrics and trends
- `useDashboard()`: Convenience hook that combines all dashboard hooks

The hooks include automatic refetching configurations for real-time updates:
- Fuel levels refresh every 30 seconds
- Dashboard data refreshes every minute
- Sales and financial data refresh every 5 minutes

## Usage Examples

### Main Dashboard Display

```tsx
import { useDashboard } from '@/features/dashboard';

function MainDashboard() {
  const { 
    data, 
    fuelLevels, 
    salesSummary, 
    financialData,
    isLoading
  } = useDashboard();
  
  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }
  
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <section className="metrics-section">
        <h2>Key Metrics</h2>
        <div className="metrics-grid">
          <MetricCard 
            title="Total Sales" 
            value={data?.totalSales || 0} 
            format="currency" 
          />
          <MetricCard 
            title="Net Profit" 
            value={data?.netProfit || 0} 
            format="currency" 
          />
          <MetricCard 
            title="Inventory Value" 
            value={data?.inventoryValue || 0} 
            format="currency" 
          />
        </div>
      </section>
      
      <section className="fuel-levels-section">
        <h2>Fuel Levels</h2>
        <div className="fuel-levels-grid">
          {Object.entries(fuelLevels).map(([tankId, level]) => (
            <TankLevelCard 
              key={tankId}
              tankId={tankId}
              level={level}
            />
          ))}
        </div>
      </section>
      
      <section className="sales-summary-section">
        <h2>Sales Summary (Today)</h2>
        {salesSummary && (
          <SalesSummaryChart data={salesSummary.data} />
        )}
      </section>
      
      <section className="financial-section">
        <h2>Financial Overview</h2>
        {financialData && (
          <FinancialOverviewChart 
            revenue={financialData.revenue}
            expenses={financialData.expenses}
            profit={financialData.profit}
          />
        )}
      </section>
    </div>
  );
}
```

### Real-time Fuel Monitoring

```tsx
import { useFuelLevels } from '@/features/dashboard';

function FuelMonitoring() {
  const { data: fuelLevels, isLoading, error } = useFuelLevels();
  
  if (isLoading) return <div>Loading fuel levels...</div>;
  if (error) return <div>Error loading fuel levels: {error.message}</div>;
  
  return (
    <div>
      <h2>Fuel Monitoring</h2>
      <div className="tank-grid">
        {Object.entries(fuelLevels || {}).map(([tankId, level]) => {
          const percentageFilled = level / 100; // Assuming capacity is normalized to 100
          const status = percentageFilled < 0.2 ? 'low' : 
                        percentageFilled > 0.8 ? 'high' : 'normal';
          
          return (
            <div key={tankId} className={`tank-card tank-status-${status}`}>
              <h3>Tank {tankId}</h3>
              <div className="tank-visual">
                <div 
                  className="tank-fill" 
                  style={{ height: `${percentageFilled * 100}%` }}
                />
              </div>
              <div className="tank-info">
                <p>Current level: {level} liters</p>
                <p>Status: {status}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Sales Summary with Timeframe Selection

```tsx
import { useSalesSummary } from '@/features/dashboard';
import { useState } from 'react';

function SalesSummaryView() {
  const [timeframe, setTimeframe] = useState('day');
  const { data, isLoading } = useSalesSummary(timeframe);
  
  return (
    <div className="sales-summary-container">
      <div className="timeframe-selector">
        <button 
          className={timeframe === 'day' ? 'active' : ''} 
          onClick={() => setTimeframe('day')}
        >
          Today
        </button>
        <button 
          className={timeframe === 'week' ? 'active' : ''} 
          onClick={() => setTimeframe('week')}
        >
          This Week
        </button>
        <button 
          className={timeframe === 'month' ? 'active' : ''} 
          onClick={() => setTimeframe('month')}
        >
          This Month
        </button>
      </div>
      
      {isLoading ? (
        <div>Loading sales data...</div>
      ) : (
        <div className="sales-data">
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Sales</h3>
              <p className="total">{data?.total || 0} AMD</p>
            </div>
            <div className="summary-card">
              <h3>Average Sale</h3>
              <p className="average">{data?.average || 0} AMD</p>
            </div>
          </div>
          
          <div className="sales-chart">
            {/* Render chart using data.data array */}
            <SalesChart data={data?.data || []} timeframe={timeframe} />
          </div>
        </div>
      )}
    </div>
  );
}
```

## Error Handling

The dashboard feature implements robust error handling:

- All API errors are caught and processed consistently
- Fallback values are provided for all data points when APIs fail
- Errors are properly propagated to the UI for visibility
- Console logging provides debugging information
- Components implement graceful degradation when data is unavailable

## Real-time Updates

The dashboard implements automatic data refreshing for real-time monitoring:

- Fuel levels refresh every 30 seconds
- Dashboard data refreshes every minute
- Sales and financial data refresh every 5 minutes
- All data refreshes when the browser window regains focus

## Future Improvements

Planned enhancements for the feature:

1. Add user-configurable dashboard with drag-and-drop widgets
2. Implement alerts and notifications for critical thresholds (low fuel levels, etc.)
3. Add historical data comparison with previous periods
4. Enhance data visualization with interactive charts
5. Add predictive analytics for sales forecasting and inventory management 