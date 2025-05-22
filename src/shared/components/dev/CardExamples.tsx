import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  MetricCard,
  ActionCard,
  StatsCard,
  SummaryCard,
  InfoCard,
  CardGrid,
  CardGroup
} from "@/core/components/ui/cards";
import { Button } from "@/core/components/ui/button";
import { 
  DollarSign, 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  TrendingUp, 
  Bell,
  Info,
  Settings,
  AlertTriangle
} from "lucide-react";

/**
 * Component for showcasing the new card system with various examples
 */
export default function CardExamples() {
  return (
    <div className="container mx-auto p-6 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Card Component Examples</h1>
        <p className="text-muted-foreground mb-6">
          This page demonstrates the new standardized card component system with various examples.
        </p>
      </div>

      {/* Basic Card */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Basic Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>These are your account settings. You can update your profile here.</p>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>

          <Card variant="outline">
            <CardHeader>
              <CardTitle>Outline Variant</CardTitle>
              <CardDescription>A card with just a border.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Content for the outline variant card.</p>
            </CardContent>
          </Card>

          <Card variant="elevated" hover interactive>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>This card has hover and interactive states.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Click me or hover over me to see effects.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Metric Cards */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Metric Cards</h2>
        <CardGrid columns={{ xs: 1, sm: 2, md: 2, lg: 4 }} gap="gap-6">
          <MetricCard
            title="Revenue"
            value="$24,320"
            description="Total monthly revenue"
            trend={{ value: "12%", direction: "up", label: "vs last month" }}
            icon={<DollarSign className="h-5 w-5" />}
            onClick={() => alert("Revenue card clicked!")}
          />
          <MetricCard
            title="Users"
            value="1,234"
            description="Active users"
            trend={{ value: "3%", direction: "up", label: "new users" }}
            icon={<Users className="h-5 w-5" />}
          />
          <MetricCard
            title="Conversion Rate"
            value="5.2%"
            description="Current conversion"
            trend={{ value: "0.5%", direction: "down", label: "decrease" }}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <MetricCard
            title="Average Order"
            value="$89.43"
            description="Per transaction"
            trend={{ value: "2.3%", direction: "up", label: "increase" }}
            icon={<CreditCard className="h-5 w-5" />}
          />
        </CardGrid>
      </section>

      {/* Stats Cards */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Stats Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Orders"
            value="645"
            change={{ value: "-2%", direction: "down" }}
            icon={<ShoppingCart className="h-5 w-5" />}
          />
          <StatsCard
            title="Products"
            value="89"
            change={{ value: "+5", direction: "up" }}
            icon={<Package className="h-5 w-5" />}
          />
          <StatsCard
            title="Notifications"
            value="32"
            change={{ value: "+12", direction: "up" }}
            icon={<Bell className="h-5 w-5" />}
          />
          <StatsCard
            title="Settings"
            value="5"
            description="Updates needed"
            icon={<Settings className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Action Cards */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Action Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Complete Profile"
            description="Your profile is incomplete. Please add more information to improve your account security."
            status="warning"
            actionLabel="Update Profile"
            onAction={() => alert("Update profile clicked!")}
            icon={<Users className="h-5 w-5" />}
          />
          <ActionCard
            title="Payment Method"
            description="Add a payment method to proceed with your subscription."
            status="error"
            actionLabel="Add Payment"
            onAction={() => alert("Add payment clicked!")}
            icon={<CreditCard className="h-5 w-5" />}
          />
          <ActionCard
            title="View Reports"
            description="Monthly financial reports are available for review."
            status="info"
            actionLabel="View Reports"
            actionHref="#reports"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Summary Cards */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Summary Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryCard
            title="Financial Overview"
            description="Current month's performance"
            metrics={[
              { label: "Revenue", value: "$12,345", color: "success" },
              { label: "Expenses", value: "$5,432", color: "danger" },
              { label: "Profit", value: "$6,913", color: "success" },
              { label: "Pending", value: "$1,200", color: "warning" },
            ]}
            action={{
              label: "View Full Report",
              onClick: () => alert("View full report clicked!")
            }}
          />
          <SummaryCard
            title="User Activity"
            description="Last 30 days"
            metrics={[
              { label: "New Users", value: "245", color: "success" },
              { label: "Active Users", value: "1,890", color: "success" },
              { label: "Churned Users", value: "32", color: "danger" },
              { label: "Dormant Users", value: "342", color: "warning" },
            ]}
            action={{
              label: "View User Analytics",
              onClick: () => alert("View user analytics clicked!")
            }}
          />
        </div>
      </section>

      {/* Info Cards */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Info Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InfoCard
              title="Information"
              description="This is a general information message."
              type="info"
              actions={<Button size="sm" variant="outline">Dismiss</Button>}
            >
              <p>Here is some additional information that might be helpful to the user.</p>
            </InfoCard>
            
            <InfoCard
              title="Success"
              description="Operation completed successfully."
              type="success"
            />
          </div>
          <div className="space-y-4">
            <InfoCard
              title="Warning"
              description="Please review before proceeding."
              type="warning"
              actions={<Button size="sm" variant="outline">Review</Button>}
            />
            
            <InfoCard
              title="Error"
              description="There was an error processing your request."
              type="error"
              icon={<AlertTriangle className="h-5 w-5" />}
              actions={
                <div className="space-x-2">
                  <Button size="sm" variant="destructive">Retry</Button>
                  <Button size="sm" variant="outline">Cancel</Button>
                </div>
              }
            >
              <p>Please check your connection and try again. If the problem persists, contact support.</p>
            </InfoCard>
          </div>
        </div>
      </section>

      {/* Card Layouts */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Card Layouts</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-3">Card Group (Horizontal, Joined)</h3>
            <CardGroup direction="horizontal" joined>
              <Card>
                <CardHeader>
                  <CardTitle size="sm">Step 1</CardTitle>
                </CardHeader>
                <CardContent>Create your account</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle size="sm">Step 2</CardTitle>
                </CardHeader>
                <CardContent>Set up your profile</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle size="sm">Step 3</CardTitle>
                </CardHeader>
                <CardContent>Start using the app</CardContent>
              </Card>
            </CardGroup>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3">Card Group (Vertical, Spaced)</h3>
            <CardGroup direction="vertical" gap="gap-2">
              <Card>
                <CardHeader>
                  <CardTitle size="sm">First Card</CardTitle>
                </CardHeader>
                <CardContent>Content for the first card</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle size="sm">Second Card</CardTitle>
                </CardHeader>
                <CardContent>Content for the second card</CardContent>
              </Card>
            </CardGroup>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3">Auto-Fit Card Grid</h3>
            <CardGrid autoFit minWidth="200px" gap="gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle size="sm">Card {i}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    Auto-fit card content
                  </CardContent>
                </Card>
              ))}
            </CardGrid>
          </div>
        </div>
      </section>

      {/* Dashboard Example */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Dashboard Example</h2>
        <div className="space-y-6">
          <CardGrid columns={{ xs: 1, sm: 2, lg: 4 }} gap="gap-6">
            <MetricCard
              title="Revenue"
              value="$24,320"
              trend={{ value: "12%", direction: "up", label: "vs last month" }}
              icon={<DollarSign className="h-5 w-5" />}
            />
            <MetricCard
              title="Users"
              value="1,234"
              trend={{ value: "3%", direction: "up", label: "new users" }}
              icon={<Users className="h-5 w-5" />}
            />
            <StatsCard
              title="Orders"
              value="645"
              change={{ value: "-2%", direction: "down" }}
              icon={<ShoppingCart className="h-5 w-5" />}
            />
            <StatsCard
              title="Products"
              value="89"
              change={{ value: "+5", direction: "up" }}
              icon={<Package className="h-5 w-5" />}
            />
          </CardGrid>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <SummaryCard
                title="Financial Overview"
                description="Current period"
                metrics={[
                  { label: "Revenue", value: "$12,345", color: "success" },
                  { label: "Expenses", value: "$5,432", color: "danger" },
                  { label: "Profit", value: "$6,913", color: "success" },
                ]}
                action={{
                  label: "View Full Report",
                  onClick: () => alert("View report clicked!")
                }}
              />
            </div>
            <ActionCard
              title="Tasks Pending"
              description="You have 3 important tasks to complete"
              status="warning"
              actionLabel="View Tasks"
              onAction={() => alert("View tasks clicked!")}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">New user registered</p>
                      <p className="text-sm text-muted-foreground">John Doe created a new account</p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">2h ago</div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">New order placed</p>
                      <p className="text-sm text-muted-foreground">Order #12345 was created</p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">3h ago</div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Settings className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Settings updated</p>
                      <p className="text-sm text-muted-foreground">System settings were modified</p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">5h ago</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">View All Activity</Button>
              </CardFooter>
            </Card>
            
            <div className="space-y-6">
              <InfoCard
                title="System Update"
                description="A new version is available for installation."
                type="info"
                actions={<Button size="sm">Update Now</Button>}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <Users className="h-5 w-5 mb-1" />
                      <span>Users</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <ShoppingCart className="h-5 w-5 mb-1" />
                      <span>Orders</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <Package className="h-5 w-5 mb-1" />
                      <span>Products</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col">
                      <Settings className="h-5 w-5 mb-1" />
                      <span>Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 