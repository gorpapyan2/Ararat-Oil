import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  UserCheck, 
  Clock, 
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Target,
  Building2,
  DollarSign
} from 'lucide-react';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { DashboardGrid } from '@/components/ui/dashboard-grid';
import { CardContainer } from '@/components/ui/card-container';
import { cn } from '@/shared/utils';

const EmployeesMainPage: React.FC = () => {
  const { t } = useTranslation();

  const employeeStats = [
    {
      title: t('modules.employees.totalEmployees'),
      value: '47',
      change: '+3',
      trend: 'up' as const,
      icon: Users,
      description: 'Ընդհանուր աշխատակիցներ',
      color: 'blue' as const
    },
    {
      title: t('modules.employees.onDuty'),
      value: '28',
      change: '+5',
      trend: 'up' as const,
      icon: UserCheck,
      description: 'Հիմա ծառայության մեջ',
      color: 'green' as const
    },
    {
      title: t('modules.employees.departments'),
      value: '8',
      change: '0',
      trend: 'neutral' as const,
      icon: Building2,
      description: 'Ակտիվ բաժիններ',
      color: 'purple' as const
    },
    {
      title: 'Միջին աշխատավարձ',
      value: '₽ 85K',
      change: '+8.2%',
      trend: 'up' as const,
      icon: DollarSign,
      description: 'Այս ամիս',
      color: 'orange' as const
    }
  ];

  const quickActions = [
    {
      title: t('quickActions.addEmployee'),
      description: 'Ավելացնել նոր աշխատակից',
      icon: UserPlus,
      color: 'bg-green-500 hover:bg-green-600',
      iconColor: 'text-white'
    },
    {
      title: 'Ներկայության հաշվարկ',
      description: 'Ստուգել աշխատակիցների ներկայությունը',
      icon: Clock,
      color: 'bg-blue-500 hover:bg-blue-600',
      iconColor: 'text-white'
    },
    {
      title: 'Հաշվետվություն',
      description: 'Աշխատակիցների հաշվետվություն',
      icon: Target,
      color: 'bg-purple-500 hover:bg-purple-600',
      iconColor: 'text-white'
    },
    {
      title: 'Բաժիններ',
      description: 'Կառավարել բաժինների կառուցվածքը',
      icon: Building2,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      iconColor: 'text-white'
    },
    {
      title: 'Գնահատականներ',
      description: 'Աշխատակիցների կատարողականի գնահատում',
      icon: Award,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      iconColor: 'text-white'
    },
    {
      title: 'Աշխատավարձ',
      description: 'Աշխատավարձի կառավարում',
      icon: DollarSign,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      iconColor: 'text-white'
    }
  ];

  const employees = [
    {
      id: '1',
      name: 'Արամ Գրիգորյան',
      position: 'Հերթափոխության վերակացու',
      department: 'Վառելիքի լցում',
      email: 'aram.grigoryan@araratoil.am',
      phone: '+374 77 123456',
      status: 'active',
      shift: 'Առավոտյան',
      avatar: '',
      startDate: '2020-03-15',
      location: 'Կայան #1'
    },
    {
      id: '2',
      name: 'Նաիրա Մանուկյան',
      position: 'Հաշվապահ',
      department: 'Ֆինանսներ',
      email: 'naira.manukyan@araratoil.am',
      phone: '+374 77 234567',
      status: 'active',
      shift: 'Կեսօրյան',
      avatar: '',
      startDate: '2019-08-22',
      location: 'Գրասենյակ'
    },
    {
      id: '3',
      name: 'Վարդան Ավագյան',
      position: 'Անվտանգության մասնագետ',
      department: 'Անվտանգություն',
      email: 'vardan.avagyan@araratoil.am',
      phone: '+374 77 345678',
      status: 'on_leave',
      shift: 'Գիշերային',
      avatar: '',
      startDate: '2021-01-10',
      location: 'Կայան #2'
    },
    {
      id: '4',
      name: 'Մարիամ Հակոբյան',
      position: 'Վաճառքի մասնագետ',
      department: 'Վաճառք',
      email: 'mariam.hakobyan@araratoil.am',
      phone: '+374 77 456789',
      status: 'active',
      shift: 'Առավոտյան',
      avatar: '',
      startDate: '2022-06-05',
      location: 'Կայան #1'
    },
    {
      id: '5',
      name: 'Սարգիս Պետրոսյան',
      position: 'Պահեստային ղեկավար',
      department: 'Լոգիստիկա',
      email: 'sargis.petrosyan@araratoil.am',
      phone: '+374 77 567890',
      status: 'active',
      shift: 'Կեսօրյան',
      avatar: '',
      startDate: '2018-11-30',
      location: 'Պահեստ'
    },
    {
      id: '6',
      name: 'Աննա Գալստյան',
      position: 'Մարդկային ռեսուրսների մասնագետ',
      department: 'HR',
      email: 'anna.galstyan@araratoil.am',
      phone: '+374 77 678901',
      status: 'active',
      shift: 'Հիմնական',
      avatar: '',
      startDate: '2020-09-12',
      location: 'Գրասենյակ'
    }
  ];

  const departments = [
    { name: 'Վառելիքի լցում', count: 15, color: 'bg-blue-100 text-blue-800' },
    { name: 'Ֆինանսներ', count: 8, color: 'bg-green-100 text-green-800' },
    { name: 'Անվտանգություն', count: 6, color: 'bg-red-100 text-red-800' },
    { name: 'Վաճառք', count: 9, color: 'bg-purple-100 text-purple-800' },
    { name: 'Լոգիստիկա', count: 4, color: 'bg-orange-100 text-orange-800' },
    { name: 'HR', count: 3, color: 'bg-pink-100 text-pink-800' },
    { name: 'IT', count: 2, color: 'bg-indigo-100 text-indigo-800' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ակտիվ';
      case 'on_leave':
        return 'Արձակուրդում';
      case 'inactive':
        return 'Ոչ ակտիվ';
      default:
        return status;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Header */}
        <div className="page-header-container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('modules.employees.title')}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {t('modules.employees.description')}
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
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <UserPlus className="mr-2 h-5 w-5" />
                {t('quickActions.addEmployee')}
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <DashboardGrid>
          {employeeStats.map((stat, index) => (
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
                <Briefcase className="mr-2 h-6 w-6" />
                Արագ գործողություններ
              </CardTitle>
              <CardDescription>
                Աշխատակիցների կառավարման հիմնական գործողություններ
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Employees List */}
          <div className="lg:col-span-3">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Users className="mr-2 h-6 w-6" />
                  Աշխատակիցների ցանկ
                </CardTitle>
                <CardDescription>
                  Բոլոր աշխատակիցների մանրամասն տեղեկություններ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {getInitials(employee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-semibold text-lg">{employee.name}</h3>
                              <Badge className={getStatusColor(employee.status)}>
                                {getStatusText(employee.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{employee.position}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span>{employee.department}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{employee.shift}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{employee.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{employee.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{employee.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Departments & Stats */}
          <div className="space-y-6">
            {/* Departments */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Building2 className="mr-2 h-6 w-6" />
                  Բաժիններ
                </CardTitle>
                <CardDescription>
                  Բաժինների և աշխատակիցների բաշխումը
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departments.map((dept, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-card/30 backdrop-blur-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="font-medium">{dept.name}</span>
                      </div>
                      <Badge className={dept.color}>
                        {dept.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <TrendingUp className="mr-2 h-6 w-6" />
                  Վիճակագրություն
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-sm text-green-700">Ներկայության մակարդակ</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">4.2</div>
                    <div className="text-sm text-blue-700">Միջին գնահատական</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-purple-700">Նոր աշխատակիցներ (այս ամիս)</div>
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
                <Award className="mr-2 h-6 w-6" />
                Կատարողականի ակնարկ
              </CardTitle>
              <CardDescription>
                Աշխատակիցների արդյունավետության վերլուծություն
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-green-700">Աշխատակիցների բավարարվածություն</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">8.5%</div>
                  <div className="text-sm text-blue-700">Գործունեության թուլացում</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">15</div>
                  <div className="text-sm text-purple-700">Ակտիվ ուսուցման ծրագրեր</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">98%</div>
                  <div className="text-sm text-orange-700">Ուսուցման ավարտման տոկոս</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContainer>
      </div>
    </div>
  );
};

export default EmployeesMainPage; 