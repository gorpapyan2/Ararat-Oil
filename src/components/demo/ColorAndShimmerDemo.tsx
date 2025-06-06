import React, { useState } from 'react';
import { 
  ShimmerCard, 
  ShimmerText, 
  ShimmerTitle, 
  ShimmerAvatar, 
  ShimmerButton,
  ShimmerIcon,
  ShimmerNavCard,
  ShimmerDashboardCard,
  ShimmerStats
} from '@/shared/components/ui';

export const ColorAndShimmerDemo: React.FC = () => {
  const [showShimmer, setShowShimmer] = useState(false);
  const [shimmerVariant, setShimmerVariant] = useState<'default' | 'pulse' | 'wave'>('default');

  return (
    <div className="w-full space-y-12 p-8 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-professional bg-clip-text text-transparent">
            Professional Color System & Shimmer Loading
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Enterprise-grade color palette and loading animations designed for professional fuel management applications.
          </p>
        </div>

        {/* Color Showcase */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Professional Color Palette
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Corporate Colors */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-muted-foreground">Corporate Identity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-corporate-navy border border-border"></div>
                  <div>
                    <p className="font-medium text-sm">Corporate Navy</p>
                    <p className="text-xs text-muted-foreground">Primary Brand</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-steel-blue border border-border"></div>
                  <div>
                    <p className="font-medium text-sm">Steel Blue</p>
                    <p className="text-xs text-muted-foreground">Secondary Brand</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fuel Management Colors */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-muted-foreground">Fuel Operations</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-fuel-red border border-border"></div>
                  <div>
                    <p className="font-medium text-sm">Fuel Red</p>
                    <p className="text-xs text-muted-foreground">Critical Operations</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-fuel-orange border border-border"></div>
                  <div>
                    <p className="font-medium text-sm">Professional Orange</p>
                    <p className="text-xs text-muted-foreground">Warnings & Alerts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Energy & Analytics */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-muted-foreground">Energy & Analytics</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-energy-green border border-border"></div>
                  <div>
                    <p className="font-medium text-sm">Energy Green</p>
                    <p className="text-xs text-muted-foreground">Success & Growth</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-electric-blue border border-border"></div>
                  <div>
                    <p className="font-medium text-sm">Electric Blue</p>
                    <p className="text-xs text-muted-foreground">Data & Analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Gradients */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-24 rounded-xl gradient-professional flex items-center justify-center">
              <span className="text-white font-medium">Corporate Gradient</span>
            </div>
            <div className="h-24 rounded-xl gradient-fuel-professional flex items-center justify-center">
              <span className="text-white font-medium">Fuel Operations</span>
            </div>
            <div className="h-24 rounded-xl gradient-energy-professional flex items-center justify-center">
              <span className="text-white font-medium">Energy Analytics</span>
            </div>
          </div>
        </section>

        {/* Shimmer Loading Demo */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Professional Loading System</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setShowShimmer(!showShimmer)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {showShimmer ? 'Show Content' : 'Show Loading'}
              </button>
              <select
                value={shimmerVariant}
                onChange={(e) => setShimmerVariant(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="default">Shimmer</option>
                <option value="pulse">Pulse</option>
                <option value="wave">Wave</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showShimmer ? (
              <>
                <ShimmerCard variant={shimmerVariant} size="lg" />
                <ShimmerNavCard variant={shimmerVariant} />
                <ShimmerDashboardCard variant={shimmerVariant} />
                <div className="space-y-3">
                  <ShimmerTitle variant={shimmerVariant} />
                  <ShimmerText variant={shimmerVariant} width="80%" />
                  <ShimmerText variant={shimmerVariant} width="60%" />
                </div>
                <div className="flex items-center gap-4">
                  <ShimmerAvatar variant={shimmerVariant} size="lg" />
                  <div className="space-y-2 flex-1">
                    <ShimmerText variant={shimmerVariant} width="70%" />
                    <ShimmerText variant={shimmerVariant} width="50%" />
                  </div>
                </div>
                <div className="space-y-4">
                  <ShimmerButton variant={shimmerVariant} />
                  <ShimmerButton variant={shimmerVariant} size="sm" />
                  <div className="flex gap-2">
                    <ShimmerIcon variant={shimmerVariant} />
                    <ShimmerIcon variant={shimmerVariant} />
                    <ShimmerIcon variant={shimmerVariant} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="card p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">FL</span>
                  </div>
                  <h3 className="text-lg font-semibold">Fuel Levels</h3>
                  <p className="text-muted-foreground text-sm">Monitor real-time fuel inventory across all stations.</p>
                  <div className="flex justify-between text-sm">
                    <span>Current</span>
                    <span className="font-semibold text-energy-green">98.5%</span>
                  </div>
                </div>
                
                <div className="card p-6 space-y-4">
                  <div className="w-12 h-12 bg-fuel-red rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">SA</span>
                  </div>
                  <h3 className="text-lg font-semibold">Sales Analytics</h3>
                  <p className="text-muted-foreground text-sm">Track sales performance and revenue trends.</p>
                  <div className="flex justify-between text-sm">
                    <span>Today</span>
                    <span className="font-semibold text-primary">$24,580</span>
                  </div>
                </div>
                
                <div className="card p-6 space-y-4">
                  <div className="w-12 h-12 bg-electric-blue rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">EM</span>
                  </div>
                  <h3 className="text-lg font-semibold">Employee Management</h3>
                  <p className="text-muted-foreground text-sm">Manage staff schedules and performance.</p>
                  <div className="flex justify-between text-sm">
                    <span>Active</span>
                    <span className="font-semibold text-energy-green">12 Staff</span>
                  </div>
                </div>
                
                <div className="card p-4 space-y-3">
                  <h4 className="font-medium">System Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Server Status</span>
                      <span className="text-energy-green">Online</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Database</span>
                      <span className="text-energy-green">Connected</span>
                    </div>
                  </div>
                </div>
                
                <div className="card p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-steel-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">JS</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">John Smith</p>
                      <p className="text-xs text-muted-foreground">Station Manager</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last login: 2 hours ago
                  </div>
                </div>
                
                <div className="card p-4 space-y-3">
                  <div className="flex gap-2">
                    <button className="btn btn-primary flex-1 text-sm py-2">
                      New Sale
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary flex-1 text-sm py-2">
                      Reports
                    </button>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                      <span className="text-primary-foreground text-xs">⚙</span>
                    </div>
                    <div className="w-6 h-6 bg-fuel-red rounded flex items-center justify-center">
                      <span className="text-white text-xs">⚡</span>
                    </div>
                    <div className="w-6 h-6 bg-energy-green rounded flex items-center justify-center">
                      <span className="text-white text-xs">📊</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Animation Speed Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Animation Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Fast Loading</h3>
              <ShimmerCard variant="default" speed="fast" />
              <p className="text-sm text-muted-foreground">1s duration - Quick feedback</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Standard Loading</h3>
              <ShimmerCard variant="default" speed="normal" />
              <p className="text-sm text-muted-foreground">2s duration - Balanced experience</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Relaxed Loading</h3>
              <ShimmerCard variant="default" speed="slow" />
              <p className="text-sm text-muted-foreground">3s duration - Calm experience</p>
            </div>
          </div>
        </section>

        {/* Professional Statistics */}
        <section>
          <h2 className="text-2xl font-semibold mb-8">Professional Statistics Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6 text-center space-y-2">
              <div className="text-2xl font-bold text-primary">$847.2K</div>
              <div className="text-sm text-muted-foreground">Monthly Revenue</div>
              <div className="text-xs text-energy-green">+12.5% from last month</div>
            </div>
            <div className="card p-6 text-center space-y-2">
              <div className="text-2xl font-bold text-fuel-red">98.7%</div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
              <div className="text-xs text-energy-green">Excellent performance</div>
            </div>
            <div className="card p-6 text-center space-y-2">
              <div className="text-2xl font-bold text-electric-blue">2,341</div>
              <div className="text-sm text-muted-foreground">Daily Transactions</div>
              <div className="text-xs text-energy-green">+8.3% increase</div>
            </div>
            <div className="card p-6 text-center space-y-2">
              <div className="text-2xl font-bold text-energy-green">45</div>
              <div className="text-sm text-muted-foreground">Active Employees</div>
              <div className="text-xs text-muted-foreground">All stations covered</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}; 