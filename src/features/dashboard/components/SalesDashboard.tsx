
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/primitives/badge';
import { Button } from '@/core/components/ui/primitives/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/components/ui/primitives/table';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Calendar, Filter } from 'lucide-react';
import { cn } from '@/shared/utils';

// Mock data - replace with real data from your API
const mockSalesData = [
  { id: '1', date: '2024-01-15', customer: 'Customer A', fuelType: 'Diesel', quantity: 50, amount: 25000, status: 'completed' },
  { id: '2', date: '2024-01-15', customer: 'Customer B', fuelType: 'Gasoline', quantity: 30, amount: 18000, status: 'completed' },
  { id: '3', date: '2024-01-14', customer: 'Customer C', fuelType: 'Premium', quantity: 40, amount: 24000, status: 'pending' },
];

const mockMetrics = {
  totalSales: 127500,
  totalTransactions: 156,
  averageTransaction: 817,
  growthRate: 12.5
};

export function SalesDashboard() {
  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      cancelled: 'destructive'
    };
    return variants[status as keyof typeof variants] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalSales.toLocaleString()}֏</div>
            <p className="text-xs text-muted-foreground">
              +{mockMetrics.growthRate}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.averageTransaction.toLocaleString()}֏</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className={cn(
              "h-4 w-4",
              mockMetrics.growthRate >= 0 ? "text-green-600" : "text-red-600"
            )} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              mockMetrics.growthRate >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {mockMetrics.growthRate >= 0 ? '+' : ''}{mockMetrics.growthRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly change
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Sales</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Quantity (L)</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSalesData.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.fuelType}</TableCell>
                  <TableCell>{sale.quantity.toLocaleString()}</TableCell>
                  <TableCell>{sale.amount.toLocaleString()}֏</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(sale.status) as any}>
                      {sale.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
