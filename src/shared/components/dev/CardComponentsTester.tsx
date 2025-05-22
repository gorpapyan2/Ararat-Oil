import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/core/components/ui/tabs';
import {
  BarChart3,
  Building,
  Calendar,
  CreditCard,
  Settings,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserCircle,
} from "lucide-react";
import {
  MetricCard,
  ActionCard,
  StatsCard,
  SummaryCard
} from "@/core/components/ui/composed/card";

export function CardComponentsTester() {
  return (
    <Tabs defaultValue="examples" className="w-full">
      <TabsList className="w-full justify-start mb-4">
        <TabsTrigger value="examples">Examples</TabsTrigger>
        <TabsTrigger value="base">Base Cards</TabsTrigger>
        <TabsTrigger value="metric">Metric Cards</TabsTrigger>
        <TabsTrigger value="action">Action Cards</TabsTrigger>
        <TabsTrigger value="stats">Stats Cards</TabsTrigger>
        <TabsTrigger value="summary">Summary Cards</TabsTrigger>
      </TabsList>

      <TabsContent value="examples" className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Dashboard Example</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Sales"
              value="$45,231.89"
              trend={{
                value: "12.5%",
                positive: true,
                label: "vs. last month"
              }}
              icon={<TrendingUp className="h-5 w-5" />}
              description="vs. last month"
              className="border-l-4 border-l-blue-500"
            />
            <MetricCard
              title="Active Stations"
              value="8/10"
              description="2 offline"
              icon={<Building className="h-5 w-5" />}
              className="border-l-4 border-l-green-500"
            />
            <MetricCard
              title="Monthly Revenue"
              value="$123,456"
              trend={{
                value: "8.2%",
                positive: true,
                label: "compared to last month"
              }}
              icon={<BarChart3 className="h-5 w-5" />}
              description="compared to last month"
              className="border-l-4 border-l-purple-500"
            />
            <MetricCard
              title="Fuel Inventory"
              value="7,523 L"
              trend={{
                value: "3.1%",
                positive: false,
                label: "remaining capacity"
              }}
              icon={<TrendingDown className="h-5 w-5" />}
              description="remaining capacity"
              className="border-l-4 border-l-amber-500"
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Administrative Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              title="Add New Employee"
              description="Onboard a new team member"
              icon={<UserCircle className="h-5 w-5" />}
              actionLabel="Add"
              onAction={() => alert("Add employee")}
            />
            <ActionCard
              title="Security Settings"
              description="Review security settings"
              icon={<ShieldCheck className="h-5 w-5" />}
              actionLabel="Review"
              onAction={() => alert("Review security")}
            />
            <ActionCard
              title="Payment Methods"
              description="Manage payment options"
              icon={<CreditCard className="h-5 w-5" />}
              actionLabel="Manage"
              onAction={() => alert("Manage payments")}
            />
            <ActionCard
              title="Schedule Reports"
              description="Set up automated reports"
              icon={<Calendar className="h-5 w-5" />}
              actionLabel="Schedule"
              onAction={() => alert("Schedule reports")}
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Station Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard
              title="Station Performance"
              metrics={[
                { label: "Total Sales", value: "$12,345.67", color: "default" },
                { label: "Transactions", value: "1,234", color: "default" },
                { label: "Average Sale", value: "$45.67", color: "default" },
                { label: "Customer Satisfaction", value: "4.8/5", color: "success" },
              ]}
              action={{
                label: "View Report",
                onClick: () => alert("View Report"),
              }}
            />
            <SummaryCard
              title="Inventory Status"
              metrics={[
                { label: "Regular", value: "78%", color: "success" },
                { label: "Premium", value: "45%", color: "warning" },
                { label: "Diesel", value: "12%", color: "danger" },
                { label: "Last Delivery", value: "2 days ago", color: "muted" },
              ]}
              action={{
                label: "Order Fuel",
                onClick: () => alert("Order Fuel"),
              }}
            />
            <SummaryCard
              title="Staff Schedule"
              metrics={[
                { label: "Morning Shift", value: "3 employees", color: "default" },
                { label: "Afternoon Shift", value: "4 employees", color: "default" },
                { label: "Night Shift", value: "2 employees", color: "warning" },
                { label: "On Leave", value: "1 employee", color: "muted" },
              ]}
              action={{
                label: "Manage Schedule",
                onClick: () => alert("Manage Schedule"),
              }}
            />
          </div>
        </section>
      </TabsContent>

      <TabsContent value="base" className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Basic Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>A basic card with title and description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the basic card component that provides the foundation for all other card variants.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>With Footer</CardTitle>
                <CardDescription>Card with actions in the footer</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Cards can include actions in a separate footer section for better visual hierarchy.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle>Custom Styling</CardTitle>
                <CardDescription>Cards can be easily styled with utility classes</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p>You can add custom backgrounds, borders, and spacing to cards.</p>
              </CardContent>
              <CardFooter className="bg-muted/30 justify-between">
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button size="sm">Submit</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </TabsContent>

      <TabsContent value="metric" className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Metric Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Revenue"
              value="$45,231.89"
              description="Monthly revenue"
              icon={<BarChart3 className="h-5 w-5" />}
            />
            
            <MetricCard
              title="New Users"
              value="1,234"
              trend={{
                value: "12.5%",
                positive: true,
                label: "vs. last month"
              }}
              description="vs. last month"
              icon={<UserCircle className="h-5 w-5" />}
            />
            
            <MetricCard
              title="Expenses"
              value="$12,543"
              trend={{
                value: "3.2%",
                positive: false,
                label: "vs. last month"
              }}
              description="vs. last month"
              icon={<TrendingDown className="h-5 w-5" />}
            />
            
            <MetricCard
              title="Active Users"
              value="3,456"
              description="Currently online"
              icon={<UserCircle className="h-5 w-5" />}
              className="border border-green-200 dark:border-green-900"
            />
            
            <MetricCard
              title="Average Session"
              value="12m 34s"
              description="Session duration"
              icon={<Calendar className="h-5 w-5" />}
            />

            <MetricCard
              title="Conversion Rate"
              value="24.8%"
              description="From trial to paid"
              icon={<TrendingUp className="h-5 w-5" />}
              className="border border-blue-200 dark:border-blue-900"
            />
          </div>
        </section>
      </TabsContent>

      <TabsContent value="action" className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Action Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard
              title="Security Settings"
              description="Manage your security preferences"
              icon={<ShieldCheck className="h-5 w-5" />}
              actionLabel="Manage"
              onAction={() => alert("Manage security")}
            />
            
            <ActionCard
              title="Payment Methods"
              description="Add or update payment methods"
              icon={<CreditCard className="h-5 w-5" />}
              actionLabel="Update"
              onAction={() => alert("Update payment methods")}
            />
            
            <ActionCard
              title="User Profile"
              description="Update your personal information"
              icon={<UserCircle className="h-5 w-5" />}
              actionLabel="View"
              onAction={() => alert("View profile")}
            />
            
            <ActionCard
              title="Account Settings"
              description="Manage your account preferences"
              icon={<Settings className="h-5 w-5" />}
              actionLabel="Settings"
              onAction={() => alert("Account settings")}
            />
            
            <ActionCard
              title="Billing Information"
              description="Update your billing details"
              icon={<CreditCard className="h-5 w-5" />}
              actionLabel="Update"
              onAction={() => alert("Update billing")}
              status="warning"
            />
            
            <ActionCard
              title="Notifications"
              description="Manage your notification preferences"
              icon={<Calendar className="h-5 w-5" />}
              actionLabel="Configure"
              onAction={() => alert("Configure notifications")}
              status="error"
            />
          </div>
        </section>
      </TabsContent>

      <TabsContent value="stats" className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Stats Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard
              title="Daily Sales"
              value="$12,345"
              change={{
                value: "12.3%",
                direction: "up"
              }}
              icon={<BarChart3 className="h-5 w-5" />}
            />
            
            <StatsCard
              title="New Customers"
              value="231"
              change={{
                value: "5.2%",
                direction: "up"
              }}
              icon={<UserCircle className="h-5 w-5" />}
            />
            
            <StatsCard
              title="Refunds"
              value="$1,245"
              change={{
                value: "2.1%",
                direction: "down"
              }}
              icon={<CreditCard className="h-5 w-5" />}
            />
            
            <StatsCard
              title="Conversion Rate"
              value="3.2%"
              change={{
                value: "0.5%",
                direction: "up"
              }}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            
            <StatsCard
              title="Average Order"
              value="$45.67"
              change={{
                value: "1.1%",
                direction: "neutral"
              }}
              icon={<ShieldCheck className="h-5 w-5" />}
            />
            
            <StatsCard
              title="Site Traffic"
              value="12,345"
              change={{
                value: "10.5%",
                direction: "up"
              }}
              icon={<Calendar className="h-5 w-5" />}
            />
          </div>
        </section>
      </TabsContent>

      <TabsContent value="summary" className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Summary Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SummaryCard
              title="Performance Overview"
              metrics={[
                { label: "Conversion Rate", value: "3.2%", color: "success" },
                { label: "Bounce Rate", value: "42.3%", color: "warning" },
                { label: "Average Session", value: "2m 45s", color: "default" },
                { label: "Pages per Session", value: "3.5", color: "default" },
              ]}
              action={{
                label: "View Details",
                onClick: () => alert("View Performance Details"),
              }}
            />
            
            <SummaryCard
              title="Revenue Breakdown"
              metrics={[
                { label: "Product Sales", value: "$8,234", color: "success" },
                { label: "Subscriptions", value: "$3,245", color: "success" },
                { label: "Refunds", value: "-$845", color: "danger" },
                { label: "Net Revenue", value: "$10,634", color: "default" },
              ]}
              action={{
                label: "Generate Report",
                onClick: () => alert("Generate Revenue Report"),
              }}
            />
            
            <SummaryCard
              title="Customer Segments"
              metrics={[
                { label: "New", value: "23%", color: "default" },
                { label: "Returning", value: "45%", color: "success" },
                { label: "Inactive", value: "32%", color: "warning" },
                { label: "Total Customers", value: "12,456", color: "default" },
              ]}
              action={{
                label: "View Segments",
                onClick: () => alert("View Customer Segments"),
              }}
            />
          </div>
        </section>
      </TabsContent>
    </Tabs>
  );
} 