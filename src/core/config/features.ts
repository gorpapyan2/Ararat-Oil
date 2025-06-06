import { 
  BarChart3, 
  Users, 
  Settings, 
  CreditCard, 
  CalendarClock, 
  Database, 
  Bug,
  DollarSign,
  TrendingUp,
  FileText,
  Wrench,
  Shield,
  Bell,
  Globe,
  Fuel,
  Truck,
  Package,
  Receipt,
  PieChart,
  Activity,
  Clock,
  Target
} from "lucide-react";
import {
  IconGasStation,
  IconUser,
  IconReport,
  IconReceipt,
  IconCash,
  IconChartLine,
  IconCoin,
  IconTank,
} from "@/core/components/ui/icons";
import { NavigationConfig } from '@/core/types/navigation';

export const featuresConfig: NavigationConfig = {
  categories: [
    {
      id: 'overview',
      title: 'Overview',
      titleAm: 'Ընդհանուր',
      description: 'Dashboard and main navigation features',
      descriptionAm: 'Կառավարման վահանակ և հիմնական նավիգացիայի գործառույթներ',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      features: []
    },
    {
      id: 'management',
      title: 'Management',
      titleAm: 'Կառավարում',
      description: 'Staff and shift management',
      descriptionAm: 'Անձնակազմի և հերթափոխությունների կառավարում',
      icon: Users,
      color: 'from-gray-500 to-gray-600',
      features: []
    },
    {
      id: 'finance',
      title: 'Finance',
      titleAm: 'Ֆինանսներ',
      description: 'Financial management and analytics',
      descriptionAm: 'Ֆինանսական կառավարում և վերլուծություն',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      features: []
    },
    {
      id: 'fuel',
      title: 'Fuel Management',
      titleAm: 'Վառելիքի կառավարում',
      description: 'Fuel inventory and operations',
      descriptionAm: 'Վառելիքի պաշարներ և գործառնություններ',
      icon: Fuel,
      color: 'from-blue-500 to-blue-600',
      features: []
    }
  ],
  features: [
    // Overview
    {
      id: 'dashboard',
      title: 'Dashboard',
      titleAm: 'Կառավարման վահանակ',
      description: 'Real-time business overview with key metrics and insights',
      descriptionAm: 'Հիմնական վահանակի ակնարկ',
      icon: BarChart3,
      path: '/',
      color: 'from-blue-500 to-blue-600',
      category: 'overview',
      status: 'active',
      metrics: [
        {
          label: 'Active Systems',
          value: '8/10',
          trend: 'up'
        }
      ],
      tags: ['analytics', 'real-time', 'overview']
    },

    // Management
    {
      id: 'management',
      title: 'Management',
      titleAm: 'Կառավարում',
      description: 'Staff and operations management',
      descriptionAm: 'Անձնակազմի և գործառնությունների կառավարում',
      icon: Users,
      path: '/management',
      color: 'from-gray-500 to-gray-600',
      category: 'management',
      status: 'active',
      children: [
        {
          id: 'shifts',
          title: 'Shifts',
          titleAm: 'Հերթափոխություններ',
          description: 'Employee shift scheduling and time tracking',
          descriptionAm: 'Աշխատակիցների հերթափոխությունների կառավարում',
          icon: CalendarClock,
          path: '/management/shifts',
          color: 'from-gray-500 to-gray-600',
          category: 'management',
          status: 'active'
        },
        {
          id: 'employees',
          title: 'Employees',
          titleAm: 'Աշխատակիցներ',
          description: 'Staff management and profiles',
          descriptionAm: 'Անձնակազմի կառավարում և պրոֆիլներ',
          icon: Users,
          path: '/management/employees',
          color: 'from-gray-500 to-gray-600',
          category: 'management',
          status: 'active'
        }
      ],
      metrics: [
        {
          label: 'Total Staff',
          value: '45',
          trend: 'up'
        }
      ],
      tags: ['management', 'staff', 'operations']
    },

    // Finance
    {
      id: 'finance',
      title: 'Finance',
      titleAm: 'Ֆինանսներ',
      description: 'Financial management and analytics',
      descriptionAm: 'Ֆինանսական կառավարում և վերլուծություն',
      icon: DollarSign,
      path: '/finance',
      color: 'from-green-500 to-green-600',
      category: 'finance',
      status: 'active',
      children: [
        {
          id: 'finance-dashboard',
          title: 'Finance Dashboard',
          titleAm: 'Ֆինանսական վահանակ',
          description: 'Financial overview and analytics',
          descriptionAm: 'Ֆինանսական ակնարկ և վերլուծություն',
          icon: BarChart3,
          path: '/finance/dashboard',
          color: 'from-green-500 to-green-600',
          category: 'finance',
          status: 'active'
        },
        {
          id: 'sales',
          title: 'Sales',
          titleAm: 'Վաճառք',
          description: 'Sales tracking and management',
          descriptionAm: 'Վաճառքի հետևում և կառավարում',
          icon: TrendingUp,
          path: '/finance/sales',
          color: 'from-green-500 to-green-600',
          category: 'finance',
          status: 'active'
        },
        {
          id: 'expenses',
          title: 'Expenses',
          titleAm: 'Ծախսեր',
          description: 'Expense tracking and management',
          descriptionAm: 'Ծախսերի հետևում և կառավարում',
          icon: Receipt,
          path: '/finance/expenses',
          color: 'from-green-500 to-green-600',
          category: 'finance',
          status: 'active'
        },
        {
          id: 'revenue',
          title: 'Revenue',
          titleAm: 'Եկամուտ',
          description: 'Revenue tracking and analysis',
          descriptionAm: 'Եկամտի հետևում և վերլուծություն',
          icon: DollarSign,
          path: '/finance/revenue',
          color: 'from-green-500 to-green-600',
          category: 'finance',
          status: 'active'
        },
        {
          id: 'payment-methods',
          title: 'Payment Methods',
          titleAm: 'Վճարման մեթոդներ',
          description: 'Payment processing options',
          descriptionAm: 'Վճարման մշակման տարբերակներ',
          icon: CreditCard,
          path: '/finance/payment-methods',
          color: 'from-green-500 to-green-600',
          category: 'finance',
          status: 'active'
        }
      ],
      metrics: [
        {
          label: 'Monthly Revenue',
          value: '$125K',
          trend: 'up'
        }
      ],
      tags: ['finance', 'revenue', 'expenses']
    },

    // Fuel Management
    {
      id: 'fuel-management',
      title: 'Fuel Management',
      titleAm: 'Վառելիքի կառավարում',
      description: 'Fuel inventory and operations',
      descriptionAm: 'Վառելիքի պաշարներ և գործառնություններ',
      icon: Fuel,
      path: '/fuel-management',
      color: 'from-blue-500 to-blue-600',
      category: 'fuel',
      status: 'active',
      children: [
        {
          id: 'fuel-dashboard',
          title: 'Fuel Dashboard',
          titleAm: 'Վառելիքի վահանակ',
          description: 'Fuel analytics overview',
          descriptionAm: 'Վառելիքի վերլուծության ակնարկ',
          icon: BarChart3,
          path: '/fuel-management/dashboard',
          color: 'from-blue-500 to-blue-600',
          category: 'fuel',
          status: 'active'
        },
        {
          id: 'tanks',
          title: 'Tanks',
          titleAm: 'Ցիստեռներ',
          description: 'Storage tank management',
          descriptionAm: 'Պահանջարկի ցիստեռների կառավարում',
          icon: Database,
          path: '/fuel-management/tanks',
          color: 'from-blue-500 to-blue-600',
          category: 'fuel',
          status: 'active'
        },
        {
          id: 'fuel-supplies',
          title: 'Fuel Supplies',
          titleAm: 'Վառելիքի մատակարարում',
          description: 'Inventory management',
          descriptionAm: 'Պաշարների կառավարում',
          icon: Package,
          path: '/fuel-management/fuel-supplies',
          color: 'from-blue-500 to-blue-600',
          category: 'fuel',
          status: 'active'
        },
        {
          id: 'fuel-prices',
          title: 'Fuel Prices',
          titleAm: 'Վառելիքի գներ',
          description: 'Pricing management',
          descriptionAm: 'Գնակառուցման կառավարում',
          icon: DollarSign,
          path: '/fuel-management/prices',
          color: 'from-blue-500 to-blue-600',
          category: 'fuel',
          status: 'active'
        },
        {
          id: 'fuel-types',
          title: 'Fuel Types',
          titleAm: 'Վառելիքի տիպեր',
          description: 'Product catalog',
          descriptionAm: 'Ապրանքների կատալոգ',
          icon: Fuel,
          path: '/fuel-management/fuel-types',
          color: 'from-blue-500 to-blue-600',
          category: 'fuel',
          status: 'active'
        },
        {
          id: 'filling-systems',
          title: 'Filling Systems',
          titleAm: 'Վառելիքի համակարգեր',
          description: 'Pump and dispenser management',
          descriptionAm: 'Պոմպերի և բաշխիչների կառավարում',
          icon: Wrench,
          path: '/fuel-management/filling-systems',
          color: 'from-blue-500 to-blue-600',
          category: 'fuel',
          status: 'active'
        },
        {
          id: 'providers',
          title: 'Petrol Providers',
          titleAm: 'Բենզինի մատակարարներ',
          description: 'Supplier management',
          descriptionAm: 'Մատակարարների կառավարում',
          icon: Truck,
          path: '/fuel-management/providers',
          color: 'from-blue-500 to-blue-600',
          category: 'fuel',
          status: 'active'
        }
      ],
      metrics: [
        {
          label: 'Active Tanks',
          value: '8/10',
          trend: 'up'
        }
      ],
      tags: ['operations', 'inventory', 'critical']
    }
  ]
};

export const getFeaturesByCategory = (category: string) => 
  featuresConfig.features.filter(feature => feature.category === category);

export const getFeatureById = (id: string) => 
  featuresConfig.features.find(feature => feature.id === id);

export const getAllCategories = () => featuresConfig.categories; 