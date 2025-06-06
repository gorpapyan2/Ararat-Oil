import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Button } from '@/core/components/ui/button';
import { 
  Users, 
  Clock, 
  Calendar, 
  Activity, 
  TrendingUp, 
  AlertCircle,
  Play,
  Square,
  Plus,
  Settings,
  BarChart3,
  History,
  UserCheck,
  Timer
} from 'lucide-react';
import { cn } from '@/shared/utils';

const ShiftsMainPage: React.FC = () => {
  const { t } = useTranslation();

  const shiftStats = [
    {
      title: t('modules.shifts.currentShift'),
      value: '12A - ԱՄ',
      change: '+2.5%',
      trend: 'up' as const,
      icon: Clock,
      description: 'Ընթացիկ հերթափոխություն',
      color: 'blue' as const
    },
    {
      title: t('modules.shifts.totalShifts'),
      value: '24',
      change: '+8.1%',
      trend: 'up' as const,
      icon: Calendar,
      description: 'Այս ամիս',
      color: 'green' as const
    },
    {
      title: t('modules.shifts.activeShifts'),
      value: '3',
      change: '0%',
      trend: 'neutral' as const,
      icon: Activity,
      description: 'Հիմա ակտիվ',
      color: 'orange' as const
    },
    {
      title: 'Ծածկույթ',
      value: '94%',
      change: '+1.2%',
      trend: 'up' as const,
      icon: Users,
      description: 'Աշխատակիցների ծածկույթ',
      color: 'purple' as const
    }
  ];

  const quickActions = [
    {
      title: t('quickActions.openShift'),
      description: 'Բացել նոր հերթափոխություն',
      icon: Play,
      color: 'bg-green-500 hover:bg-green-600',
      iconColor: 'text-white'
    },
    {
      title: t('quickActions.closeShift'),
      description: 'Փակել ընթացիկ հերթափոխությունը',
      icon: Square,
      color: 'bg-red-500 hover:bg-red-600',
      iconColor: 'text-white'
    },
    {
      title: 'Ժամանակացույց',
      description: 'Կառավարել հերթափոխությունների ժամանակացույցը',
      icon: Calendar,
      color: 'bg-blue-500 hover:bg-blue-600',
      iconColor: 'text-white'
    },
    {
      title: 'Աշխատակիցներ',
      description: 'Կառավարել հերթափոխության աշխատակիցներին',
      icon: UserCheck,
      color: 'bg-purple-500 hover:bg-purple-600',
      iconColor: 'text-white'
    },
    {
      title: 'Հաշվետվություն',
      description: 'Հերթափոխության հաշվետվություն',
      icon: BarChart3,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      iconColor: 'text-white'
    },
    {
      title: 'Կարգավորումներ',
      description: 'Հերթափոխության կարգավորումներ',
      icon: Settings,
      color: 'bg-gray-500 hover:bg-gray-600',
      iconColor: 'text-white'
    }
  ];

  const activeShifts = [
    {
      id: '1',
      name: 'Առավոտյան հերթափոխություն',
      time: '06:00 - 14:00',
      employees: 5,
      supervisor: 'Արամ Գրիգորյան',
      status: 'active' as const,
      sales: '₽ 125,000',
      location: 'Կայան #1'
    },
    {
      id: '2',
      name: 'Կեսօրյան հերթափոխություն',
      time: '14:00 - 22:00',
      employees: 4,
      supervisor: 'Նաիրա Մանուկյան',
      status: 'active' as const,
      sales: '₽ 89,500',
      location: 'Կայան #2'
    },
    {
      id: '3',
      name: 'Գիշերային հերթափոխություն',
      time: '22:00 - 06:00',
      employees: 3,
      supervisor: 'Վարդան Ավագյան',
      status: 'pending' as const,
      sales: '₽ 0',
      location: 'Կայան #1'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      action: 'Հերթափոխություն բացվել է',
      details: 'Առավոտյան հերթափոխություն - Կայան #1',
      time: '06:00',
      type: 'shift_open',
      user: 'Արամ Գրիգորյան'
    },
    {
      id: '2',
      action: 'Հերթափոխություն փակվել է',
      details: 'Գիշերային հերթափոխություն - Կայան #2',
      time: '06:00',
      type: 'shift_close',
      user: 'Սարգիս Պետրոսյան'
    },
    {
      id: '3',
      action: 'Նոր աշխատակից ավելացվել է',
      details: 'Մարիամ Հակոբյան - Առավոտյան հերթափոխություն',
      time: '05:45',
      type: 'employee_added',
      user: 'Նաիրա Մանուկյան'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ակտիվ';
      case 'pending':
        return 'Սպասող';
      case 'completed':
        return 'Ավարտված';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <div className="page-header-container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('modules.shifts.title')}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {t('modules.shifts.description')}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="lg" className="glass-effect">
                <History className="mr-2 h-5 w-5" />
                Պատմություն
              </Button>
              <Button size="lg" className="glass-effect bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="mr-2 h-5 w-5" />
                Նոր հերթափոխություն
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shiftStats.map((stat, index) => (
            <Card key={index} className="card-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Activity className="mr-2 h-6 w-6" />
                Արագ գործողություններ
              </CardTitle>
              <CardDescription>
                Հերթափոխությունների կառավարման հիմնական գործողություններ
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
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Shifts */}
          <div className="lg:col-span-2">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Clock className="mr-2 h-6 w-6" />
                  Ակտիվ հերթափոխություններ
                </CardTitle>
                <CardDescription>
                  Ընթացիկ և նախատեսված հերթափոխություններ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <Timer className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{shift.name}</h3>
                            <p className="text-sm text-muted-foreground">{shift.time}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(shift.status)}>
                          {getStatusText(shift.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Վերակացու</p>
                          <p className="font-medium">{shift.supervisor}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Աշխատակիցներ</p>
                          <p className="font-medium">{shift.employees}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Վաճառք</p>
                          <p className="font-medium">{shift.sales}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Գտնվելու վայր</p>
                          <p className="font-medium">{shift.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div>
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <History className="mr-2 h-6 w-6" />
                  Վերջին գործունեություն
                </CardTitle>
                <CardDescription>
                  Հերթափոխությունների գործունեության վերջին իրադարձություններ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-3 rounded-lg border border-border/30 bg-card/30 backdrop-blur-sm"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-1.5 rounded-full bg-blue-100">
                          <Activity className="h-3 w-3 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.details}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground">{activity.user}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="space-y-6">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="mr-2 h-6 w-6" />
                Կատարողականի ակնարկ
              </CardTitle>
              <CardDescription>
                Հերթափոխությունների արդյունավետության վերլուծություն
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-sm text-green-700">Ժամանակի պահպանում</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">₽ 2.1M</div>
                  <div className="text-sm text-blue-700">Ամսական վաճառք</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <div className="text-sm text-purple-700">Աշխատակիցների բավարարվածություն</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">15.2%</div>
                  <div className="text-sm text-orange-700">Արդյունավետության բարելավում</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShiftsMainPage; 