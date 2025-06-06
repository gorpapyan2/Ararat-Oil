import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Target,
  Receipt,
  CreditCard,
  Fuel,
  Users,
  Calendar,
  BarChart3,
  Filter,
  Search,
  Download,
  RefreshCw,
  Zap,
  Clock
} from 'lucide-react';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { DashboardGrid } from '@/components/ui/dashboard-grid';
import { CardContainer } from '@/components/ui/card-container';
import { cn } from '@/shared/utils';

const SalesMainPage: React.FC = () => {
  const { t } = useTranslation();

  const salesStats = [
    {
      title: t('modules.sales.totalSales'),
      value: '₽ 2.4M',
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      description: 'Այս ամիս ընդհանուր վաճառք',
      color: 'green' as const
    },
    {
      title: t('modules.sales.todaySales'),
      value: '₽ 125K',
      change: '+8.2%',
      trend: 'up' as const,
      icon: ShoppingCart,
      description: 'Այսօրվա վաճառք',
      color: 'blue' as const
    },
    {
      title: 'Վաճառքի թիվ',
      value: '3,247',
      change: '+15.3%',
      trend: 'up' as const,
      icon: Receipt,
      description: 'Այս ամիս գործարքներ',
      color: 'purple' as const
    },
    {
      title: 'Միջին գործարք',
      value: '₽ 742',
      change: '-2.1%',
      trend: 'down' as const,
      icon: Target,
      description: 'Միջին գումար մեկ գործարքի',
      color: 'orange' as const
    }
  ];

  const fuelStats = [
    {
      fuel: 'ԱՀ-95',
      sold: '12,540 Լ',
      revenue: '₽ 850K',
      change: '+5.2%',
      color: 'bg-green-100 text-green-800'
    },
    {
      fuel: 'ԱՀ-92',
      sold: '8,320 Լ',
      revenue: '₽ 530K',
      change: '+3.8%',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      fuel: 'Դիզել',
      sold: '15,680 Լ',
      revenue: '₽ 940K',
      change: '+7.1%',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      fuel: 'Գազ',
      sold: '2,150 Լ',
      revenue: '₽ 95K',
      change: '+2.3%',
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  const quickActions = [
    {
      title: t('quickActions.recordSale'),
      description: 'Գրանցել նոր վաճառք',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
      iconColor: 'text-white'
    },
    {
      title: 'Վաճառքի հաշվետվություն',
      description: 'Ստեղծել վաճառքի հաշվետվություն',
      icon: BarChart3,
      color: 'bg-blue-500 hover:bg-blue-600',
      iconColor: 'text-white'
    },
    {
      title: 'Վճարման մեթոդներ',
      description: 'Կառավարել վճարման տարբերակները',
      icon: CreditCard,
      color: 'bg-purple-500 hover:bg-purple-600',
      iconColor: 'text-white'
    },
    {
      title: 'Գնային ցուցակ',
      description: 'Թարմացնել վառելիքի գները',
      icon: Fuel,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      iconColor: 'text-white'
    },
    {
      title: 'Հաճախորդներ',
      description: 'Կառավարել հաճախորդների տվյալները',
      icon: Users,
      color: 'bg-orange-500 hover:bg-orange-600',
      iconColor: 'text-white'
    },
    {
      title: 'Նպատակներ',
      description: 'Դիտել և սահմանել վաճառքի նպատակներ',
      icon: Target,
      color: 'bg-pink-500 hover:bg-pink-600',
      iconColor: 'text-white'
    }
  ];

  const recentSales = [
    {
      id: '001',
      time: '14:35',
      fuel: 'ԱՀ-95',
      amount: '45.5 Լ',
      price: '₽ 3,094',
      paymentMethod: 'Քարտ',
      station: 'Կայան #1',
      status: 'completed'
    },
    {
      id: '002',
      time: '14:28',
      fuel: 'Դիզել',
      amount: '62.0 Լ',
      price: '₽ 3,720',
      paymentMethod: 'Կանխիկ',
      station: 'Կայան #2',
      status: 'completed'
    },
    {
      id: '003',
      time: '14:22',
      fuel: 'ԱՀ-92',
      amount: '38.2 Լ',
      price: '₽ 2,292',
      paymentMethod: 'Քարտ',
      station: 'Կայան #1',
      status: 'completed'
    },
    {
      id: '004',
      time: '14:15',
      fuel: 'Գազ',
      amount: '25.0 Լ',
      price: '₽ 1,100',
      paymentMethod: 'Փոխանցում',
      station: 'Կայան #3',
      status: 'pending'
    },
    {
      id: '005',
      time: '14:08',
      fuel: 'ԱՀ-95',
      amount: '52.8 Լ',
      price: '₽ 3,590',
      paymentMethod: 'Քարտ',
      station: 'Կայան #2',
      status: 'completed'
    }
  ];

  const topPerformers = [
    { station: 'Կայան #1', sales: '₽ 485K', percentage: 32, trend: 'up' },
    { station: 'Կայան #2', sales: '₽ 420K', percentage: 28, trend: 'up' },
    { station: 'Կայան #3', sales: '₽ 315K', percentage: 21, trend: 'neutral' },
    { station: 'Կայան #4', sales: '₽ 285K', percentage: 19, trend: 'down' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Ավարտված';
      case 'pending':
        return 'Սպասվում է';
      case 'failed':
        return 'Ձախողված';
      default:
        return status;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <div className="page-header-container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {t('modules.sales.title')}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {t('modules.sales.description')}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="lg" className="glass-effect">
                <Search className="mr-2 h-5 w-5" />
                {t('common.search')}
              </Button>
              <Button variant="outline" size="lg" className="glass-effect">
                <Filter className="mr-2 h-5 w-5" />
                {t('common.filter')}
              </Button>
              <Button variant="outline" size="lg" className="glass-effect">
                <Download className="mr-2 h-5 w-5" />
                Արտահանել
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
                <Plus className="mr-2 h-5 w-5" />
                {t('quickActions.recordSale')}
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <DashboardGrid>
          {salesStats.map((stat, index) => (
            <DashboardCard
              key={index}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              trend={stat.trend}
              change={stat.change}
              color={stat.color}
            />
          ))}
        </DashboardGrid>

        {/* Quick Actions */}
        <CardContainer>
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Zap className="mr-2 h-6 w-6" />
                Արագ գործողություններ
              </CardTitle>
              <CardDescription>
                Վաճառքի կառավարման հիմնական գործողություններ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center space-y-2 glass-effect hover:shadow-lg transition-all duration-200"
                  >
                    <div className={cn("p-2 rounded-lg", action.color)}>
                      <action.icon className={cn("h-5 w-5", action.iconColor)} />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContainer>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Sales */}
          <div className="lg:col-span-2">
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-xl">
                      <Clock className="mr-2 h-6 w-6" />
                      Վերջին վաճառքներ
                    </CardTitle>
                    <CardDescription>
                      Այսօրվա վաճառքների մանրամասները
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSales.map((sale) => (
                    <div
                      key={sale.id}
                      className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 font-semibold">
                            #{sale.id}
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <span className="font-semibold text-lg">{sale.price}</span>
                              <Badge className={getStatusColor(sale.status)}>
                                {getStatusText(sale.status)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Fuel className="h-4 w-4" />
                                <span>{sale.fuel} • {sale.amount}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CreditCard className="h-4 w-4" />
                                <span>{sale.paymentMethod}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{sale.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>{sale.station}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Fuel Performance */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Fuel className="mr-2 h-6 w-6" />
                  Վառելիքի վաճառք
                </CardTitle>
                <CardDescription>
                  Վառելիքի տեսակների վաճառք
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fuelStats.map((fuel, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-border/30 bg-card/30 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{fuel.fuel}</span>
                        <Badge className={fuel.color}>
                          {fuel.change}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Վաճառված: {fuel.sold}
                        </div>
                        <div className="font-medium text-lg">
                          {fuel.revenue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Target className="mr-2 h-6 w-6" />
                  Լավագույն կայաններ
                </CardTitle>
                <CardDescription>
                  Այս ամիս առաջատար վաճառողներ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-card/30 backdrop-blur-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{performer.station}</div>
                          <div className="text-sm text-muted-foreground">{performer.percentage}% ընդհանուր վաճառքից</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{performer.sales}</div>
                        <div className="flex items-center justify-end">
                          {getTrendIcon(performer.trend)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Summary */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Calendar className="mr-2 h-6 w-6" />
                  Օրական ամփոփում
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">₽ 125K</div>
                    <div className="text-sm text-green-700">Այսօրվա վաճառք</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">247</div>
                    <div className="text-sm text-blue-700">Գործարքների քանակ</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">₽ 506</div>
                    <div className="text-sm text-purple-700">Միջին գործարք</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Overview */}
        <CardContainer>
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <BarChart3 className="mr-2 h-6 w-6" />
                Կատարողականի ակնարկ
              </CardTitle>
              <CardDescription>
                Վաճառքի արդյունավետության վերլուծություն
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">↗ 12.5%</div>
                  <div className="text-sm text-green-700">Ամսական աճ</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">₽ 85K</div>
                  <div className="text-sm text-blue-700">Օրական միջին</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">4.8/5</div>
                  <div className="text-sm text-purple-700">Հաճախորդների գոհունակություն</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">15 վրկ</div>
                  <div className="text-sm text-orange-700">Միջին սպասարկման ժամանակ</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContainer>
      </div>
    </div>
  );
};

export default SalesMainPage; 