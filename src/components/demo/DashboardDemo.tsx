import React, { useState } from "react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import {
  BarChart3,
  CalendarDays,
  Droplet,
  Car,
  TrendingUp,
  DollarSign,
  Search,
  Menu,
  Bell,
  User,
  Settings,
  Fuel,
  ArrowRightLeft,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DashboardDemo() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Demo metrics data
  const metrics = [
    { label: "Total Sales", value: "27,835 ֏", icon: DollarSign, change: "+5.3%", isUp: true },
    { label: "Fuel Volume", value: "1,256 L", icon: Droplet, change: "-2.1%", isUp: false },
    { label: "Transactions", value: "184", icon: ArrowRightLeft, change: "+12.4%", isUp: true },
    { label: "Vehicles Served", value: "96", icon: Car, change: "+3.8%", isUp: true },
  ];
  
  // Demo activity data
  const recentActivity = [
    { id: 1, action: "Fuel Supply Added", date: "Today, 10:32 AM", user: "Emma S.", amount: "2500L Diesel", status: "completed" },
    { id: 2, action: "Payment Received", date: "Today, 09:15 AM", user: "John D.", amount: "15,400 ֏", status: "completed" },
    { id: 3, action: "Tank Level Updated", date: "Yesterday", user: "Anna M.", amount: "Gas Tank #2", status: "warning" },
    { id: 4, action: "Maintenance Scheduled", date: "Yesterday", user: "Robert K.", amount: "Pump #3", status: "pending" },
  ];
  
  // Demo fuel inventory
  const inventory = [
    { id: 1, name: "Diesel", level: 45, capacity: 20000, warning: false },
    { id: 2, name: "Regular", level: 22, capacity: 27000, warning: true },
    { id: 3, name: "Premium", level: 78, capacity: 21000, warning: false },
    { id: 4, name: "Gas", level: 65, capacity: 27000, warning: false },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - hidden on mobile */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold text-primary">AraraTOil</h1>
        </div>
        
        <nav className="p-4 space-y-1">
          <NavItem icon={BarChart3} label="Dashboard" isActive />
          <NavItem icon={Fuel} label="Fuel Supplies" />
          <NavItem icon={Car} label="Sales" />
          <NavItem icon={CalendarDays} label="Schedule" />
          <NavItem icon={TrendingUp} label="Reports" />
          <NavItem icon={Settings} label="Settings" />
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <User size={16} />
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@araratoil.com</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-card/50 sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={20} />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <h2 className="text-lg font-medium">Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 h-9 md:w-64 lg:w-80"
              />
            </div>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <ThemeSwitcher />
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Fuel Station Overview</h1>
              <p className="text-muted-foreground">
                Monitor your station's performance and inventory
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md">
                <CalendarDays size={14} />
                <span>Today, May 30, 2023</span>
              </div>
              
              <Button className="gap-2">
                <TrendingUp size={16} />
                <span>View Reports</span>
              </Button>
            </div>
          </div>
          
          {/* Metrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, i) => (
              <Card key={i} className="p-4 dashboard-card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <metric.icon size={20} />
                  </div>
                </div>
                <div className={cn(
                  "text-xs flex items-center gap-1 mt-3",
                  metric.isUp ? "text-success" : "text-destructive"
                )}>
                  <TrendingUp size={14} className={!metric.isUp ? "rotate-180" : ""} />
                  <span>{metric.change} from last week</span>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fuel inventory */}
            <Card className="col-span-1 dashboard-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Fuel Inventory</h3>
                <Button variant="outline" size="sm">
                  <Filter size={14} className="mr-1" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-4">
                {inventory.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className={item.warning ? "text-warning" : ""}>
                        {item.level}% 
                        {item.warning && 
                          <span className="ml-2 px-1.5 py-0.5 rounded-sm bg-warning/20 text-warning text-xs">Low</span>
                        }
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          item.level < 25 ? "bg-destructive" : 
                          item.level < 50 ? "bg-warning" : "bg-success"
                        )}
                        style={{ width: `${item.level}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(item.capacity * item.level / 100).toLocaleString()} / {item.capacity.toLocaleString()} liters
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">View All Tanks</Button>
              </div>
            </Card>
            
            {/* Recent activity */}
            <Card className="col-span-1 lg:col-span-2 dashboard-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Recent Activity</h3>
                <Button variant="link" size="sm" className="text-primary">
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      {activity.action.includes("Fuel") ? <Droplet size={16} /> :
                       activity.action.includes("Payment") ? <DollarSign size={16} /> :
                       activity.action.includes("Tank") ? <GasPump size={16} /> :
                       <Settings size={16} />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.user} • {activity.date}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{activity.amount}</span>
                          <Badge variant={
                            activity.status === "completed" ? "default" :
                            activity.status === "warning" ? "outline" : "secondary"
                          } className={
                            activity.status === "completed" ? "bg-success/10 text-success hover:bg-success/20 border-success/20" :
                            activity.status === "warning" ? "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20" :
                            "bg-muted text-muted-foreground"
                          }>
                            {activity.status === "completed" ? "Completed" :
                             activity.status === "warning" ? "Warning" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
      
      {/* Mobile overlay when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Mobile bottom navigation */}
      <div className="md:hidden mobile-nav">
        <MobileNavItem icon={BarChart3} label="Dashboard" isActive />
        <MobileNavItem icon={Fuel} label="Supplies" />
        <MobileNavItem icon={Car} label="Sales" />
        <MobileNavItem icon={Settings} label="More" />
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}

function NavItem({ icon: Icon, label, isActive }: NavItemProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive 
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}>
      <Icon size={18} />
      <span>{label}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
      )}
    </div>
  );
}

function MobileNavItem({ icon: Icon, label, isActive }: NavItemProps) {
  return (
    <div className={cn(
      "mobile-nav-item",
      isActive && "active"
    )}>
      <Icon size={20} />
      <span>{label}</span>
    </div>
  );
}
