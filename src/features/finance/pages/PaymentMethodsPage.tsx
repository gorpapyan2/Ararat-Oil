import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { CreditCard, Banknote, Smartphone, Plus } from 'lucide-react';

export default function PaymentMethodsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
          <p className="text-muted-foreground">
            Manage payment processing options
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Primary payment method
            </p>
            <div className="mt-4">
              <p className="text-sm">Daily limit: $5,000</p>
              <p className="text-sm">Processed today: $2,340</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit/Debit Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Visa, MasterCard, American Express
            </p>
            <div className="mt-4">
              <p className="text-sm">Processing fee: 2.9%</p>
              <p className="text-sm">Transactions today: 45</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Payments</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Setup Required</div>
            <p className="text-xs text-muted-foreground">
              Apple Pay, Google Pay
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cash Payments</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Card Payments</span>
                <span className="font-medium">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mobile Payments</span>
                <span className="font-medium">0%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Card Processing Fees</span>
                <span className="font-medium">$234.56</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Monthly Fixed Fees</span>
                <span className="font-medium">$29.99</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Monthly Fees</span>
                <span className="font-medium">$264.55</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 