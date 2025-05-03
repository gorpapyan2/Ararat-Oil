import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardMedia,
  CardActions,
} from "@/components/ui/card";
import {
  MetricCard,
  StatsCard,
  ActionCard,
  SummaryCard,
  CardGrid,
} from "@/components/ui/composed/cards";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Package,
  ServerIcon,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

export function CardComponentsTester() {
  return (
    <div className="space-y-12 px-4 py-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Basic Card Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Standard card component</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is a basic card with default styling.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>

          <Card variant="outline">
            <CardHeader>
              <CardTitle>Outline Card</CardTitle>
              <CardDescription>Subtle border styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has an outline style with transparent background.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Enhanced shadow effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has increased elevation with more pronounced shadow.</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="subtle">
            <CardHeader>
              <CardTitle>Subtle Card</CardTitle>
              <CardDescription>Muted background style</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has a subtle muted background and no border.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Title Size Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle size="sm">Small Title</CardTitle>
              <CardDescription>Smaller title for compact cards</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card with small title variant.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle size="md">Medium Title</CardTitle>
              <CardDescription>Default title size</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card with medium (default) title variant.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle size="lg">Large Title</CardTitle>
              <CardDescription>Larger title for emphasis</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card with large title variant.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Footer Alignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Start Aligned</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card with footer aligned to the start (left).</p>
            </CardContent>
            <CardFooter align="start">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Center Aligned</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card with footer centered.</p>
            </CardContent>
            <CardFooter align="center">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Space Between</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card with footer using space-between.</p>
            </CardContent>
            <CardFooter align="between">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>End Aligned</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card with footer aligned to the end (right).</p>
            </CardContent>
            <CardFooter align="end">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Media Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardMedia className="bg-muted h-48 flex items-center justify-center">
              <span className="text-muted-foreground">Image Placeholder</span>
            </CardMedia>
            <CardHeader>
              <CardTitle>Media Card</CardTitle>
              <CardDescription>Card with media content at the top</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card includes a media section for images or other media content.</p>
            </CardContent>
            <CardActions>
              <Button variant="ghost" size="sm">View</Button>
              <Button size="sm">Download</Button>
            </CardActions>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Stats Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value="$45,231.89"
            change={{
              value: "20.1%",
              direction: "up"
            }}
            icon={<DollarSign className="w-4 h-4" />}
          />

          <StatsCard
            title="New Customers"
            value="1,234"
            change={{
              value: "4.3%",
              direction: "down"
            }}
            icon={<Users className="w-4 h-4" />}
          />

          <StatsCard
            title="Active Users"
            value="573"
            change={{
              value: "12%",
              direction: "up"
            }}
            icon={<Users className="w-4 h-4" />}
          />

          <StatsCard
            title="Conversion Rate"
            value="3.2%"
            change={{
              value: "0.2%",
              direction: "neutral"
            }}
            icon={<BarChart3 className="w-4 h-4" />}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Metric Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Monthly Sales"
            value="$12,234"
            description="Total sales for current month"
            icon={<DollarSign className="w-5 h-5" />}
            trend={{
              value: "+12.5%",
              positive: true,
              label: "vs last month"
            }}
          />

          <MetricCard
            title="New Orders"
            value="342"
            description="Orders this week"
            icon={<Package className="w-5 h-5" />}
            trend={{
              value: "-4.2%",
              positive: false,
              label: "vs last week"
            }}
          />

          <MetricCard
            title="Loading Example"
            value="0"
            description="This card shows a loading state"
            icon={<Calendar className="w-5 h-5" />}
            loading={true}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Action Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="System Status"
            description="All systems are operating normally"
            status="success"
            actionLabel="View Status Page"
            onAction={() => console.log("View status clicked")}
            icon={<CheckCircle className="w-4 h-4" />}
          />

          <ActionCard
            title="Updates Available"
            description="12 packages need updating"
            status="warning"
            actionLabel="View Updates"
            onAction={() => console.log("View updates clicked")}
            icon={<AlertTriangle className="w-4 h-4" />}
          />

          <ActionCard
            title="API Documentation"
            description="Check the latest API changes"
            status="info"
            actionLabel="Read Docs"
            onAction={() => console.log("Read docs clicked")}
            icon={<Info className="w-4 h-4" />}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Summary Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryCard
            title="Sales Overview"
            metrics={[
              { label: "Total Orders", value: "1,234", color: "default" },
              { label: "Revenue", value: "$12,345", color: "success" },
              { label: "Refunds", value: "$1,234", color: "danger" },
              { label: "Conversion Rate", value: "3.2%", color: "warning" },
              { label: "Average Order", value: "$94", color: "default" },
            ]}
            action={{
              label: "View Report",
              onClick: () => console.log("View report clicked")
            }}
          />

          <SummaryCard
            title="Server Status"
            metrics={[
              { label: "Uptime", value: "99.9%", color: "success" },
              { label: "Response Time", value: "124ms", color: "default" },
              { label: "CPU Usage", value: "42%", color: "warning" },
              { label: "Memory", value: "3.2GB/8GB", color: "default" },
              { label: "Requests/sec", value: "236", color: "default" },
            ]}
            action={{
              label: "View Details",
              onClick: () => console.log("View details clicked")
            }}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Card Grid</h2>
        <CardGrid
          metrics={[
            {
              title: "Total Revenue",
              value: "$45,231",
              description: "Monthly revenue",
              icon: <DollarSign className="w-4 h-4" />
            },
            {
              title: "New Customers",
              value: "342",
              description: "This month",
              icon: <Users className="w-4 h-4" />
            },
            {
              title: "Growth Rate",
              value: "12.5%",
              description: "Compared to last month",
              icon: <TrendingUp className="w-4 h-4" />
            },
            {
              title: "Active Users",
              value: "1,234",
              description: "Currently online",
              icon: <Users className="w-4 h-4" />
            },
          ]}
        />
      </section>
    </div>
  );
} 