
import { 
  LayoutDashboard,
  Users,
  DollarSign,
  Fuel,
  FileText,
  Settings,
  BarChart3,
  TrendingUp,
  CreditCard,
  Wallet,
  CalendarDays,
  UserCheck,
  Gauge,
  Database,
  Package,
  PiggyBank,
  Truck,
  Wrench,
  Banknote,
  Droplets
} from 'lucide-react';
import { NavigationItem, NavigationCategory, QuickAction } from '@/core/types/navigation';

// Core navigation structure with i18n keys
export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Main dashboard overview',
    descriptionAm: 'Հիմնական վահանակի ակնարկ'
  },
  {
    id: 'management',
    title: 'Management',
    href: '/management',
    icon: Users,
    description: 'Staff and operations management',
    descriptionAm: 'Անձնակազմի և գործառնությունների կառավարում',
    children: [
      {
        id: 'shifts',
        title: 'Shifts',
        href: '/management/shifts',
        icon: CalendarDays,
        description: 'Employee shift management',
        descriptionAm: 'Աշխատակիցների հերթափոխությունների կառավարում'
      },
      {
        id: 'employees',
        title: 'Employees',
        href: '/management/employees',
        icon: UserCheck,
        description: 'Staff management',
        descriptionAm: 'Անձնակազմի կառավարում'
      }
    ]
  },
  {
    id: 'finance',
    title: 'Finance',
    href: '/finance',
    icon: DollarSign,
    description: 'Financial management and analytics',
    descriptionAm: 'Ֆինանսական կառավարում և վերլուծություն',
    children: [
      {
        id: 'finance-dashboard',
        title: 'Finance Dashboard',
        href: '/finance/dashboard',
        icon: BarChart3,
        description: 'Financial overview and analytics',
        descriptionAm: 'Ֆինանսական ակնարկ և վերլուծություն'
      },
      {
        id: 'sales',
        title: 'Sales',
        href: '/finance/sales',
        icon: TrendingUp,
        description: 'Sales tracking and management',
        descriptionAm: 'Վաճառքի հետևում և կառավարում'
      },
      {
        id: 'expenses',
        title: 'Expenses',
        href: '/finance/expenses',
        icon: CreditCard,
        description: 'Expense tracking and management',
        descriptionAm: 'Ծախսերի հետևում և կառավարում'
      },
      {
        id: 'revenue',
        title: 'Revenue',
        href: '/finance/revenue',
        icon: Wallet,
        description: 'Revenue tracking and analysis',
        descriptionAm: 'Եկամտի հետևում և վերլուծություն'
      },
      {
        id: 'payment-methods',
        title: 'Payment Methods',
        href: '/finance/payment-methods',
        icon: Banknote,
        description: 'Payment processing options',
        descriptionAm: 'Վճարման մշակման տարբերակներ'
      }
    ]
  },
  {
    id: 'fuel-management',
    title: 'Fuel Management',
    href: '/fuel-management',
    icon: Fuel,
    description: 'Fuel inventory and operations',
    descriptionAm: 'Վառելիքի պաշարներ և գործառնություններ',
    children: [
      {
        id: 'fuel-dashboard',
        title: 'Fuel Dashboard',
        href: '/fuel-management/dashboard',
        icon: Gauge,
        description: 'Fuel analytics overview',
        descriptionAm: 'Վառելիքի վերլուծության ակնարկ'
      },
      {
        id: 'tanks',
        title: 'Tanks',
        href: '/fuel-management/tanks',
        icon: Database,
        description: 'Storage tank management',
        descriptionAm: 'Պահման ցիստեռների կառավարում'
      },
      {
        id: 'fuel-supplies',
        title: 'Fuel Supplies',
        href: '/fuel-management/fuel-supplies',
        icon: Package,
        description: 'Inventory management',
        descriptionAm: 'Պաշարների կառավարում'
      },
      {
        id: 'fuel-prices',
        title: 'Fuel Prices',
        href: '/fuel-management/prices',
        icon: PiggyBank,
        description: 'Pricing management',
        descriptionAm: 'Գնակառուցման կառավարում'
      },
      {
        id: 'fuel-types',
        title: 'Fuel Types',
        href: '/fuel-management/fuel-types',
        icon: Droplets,
        description: 'Product catalog',
        descriptionAm: 'Ապրանքների կատալոգ'
      },
      {
        id: 'filling-systems',
        title: 'Filling Systems',
        href: '/fuel-management/filling-systems',
        icon: Wrench,
        description: 'Pump and dispenser management',
        descriptionAm: 'Պոմպերի և բաշխիչների կառավարում'
      },
      {
        id: 'providers',
        title: 'Petrol Providers',
        href: '/fuel-management/providers',
        icon: Truck,
        description: 'Supplier management',
        descriptionAm: 'Մատակարարների կառավարում'
      }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    href: '/reports',
    icon: FileText,
    description: 'Analytics and reporting',
    descriptionAm: 'Վերլուծություն և հաշվետվություն'
  },
  {
    id: 'settings',
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'System configuration',
    descriptionAm: 'Համակարգի կազմաձևում'
  }
];

// Navigation categories
export const navigationCategories: NavigationCategory[] = [
  {
    id: 'overview',
    title: 'Overview',
    titleAm: 'Ընդհանուր',
    description: 'Dashboard and system overview',
    descriptionAm: 'Կառավարման վահանակ և համակարգի ակնարկ',
    icon: LayoutDashboard,
    color: 'from-blue-500 to-blue-600',
    priority: 1
  },
  {
    id: 'management',
    title: 'Management',
    titleAm: 'Կառավարում',
    description: 'Staff and shift management',
    descriptionAm: 'Անձնակազմի և հերթափոխությունների կառավարում',
    icon: Users,
    color: 'from-green-500 to-green-600',
    priority: 2
  },
  {
    id: 'finance',
    title: 'Finance',
    titleAm: 'Ֆինանսներ',
    description: 'Financial management and analytics',
    descriptionAm: 'Ֆինանսական կառավարում և վերլուծություն',
    icon: DollarSign,
    color: 'from-emerald-500 to-emerald-600',
    priority: 3
  },
  {
    id: 'fuel',
    title: 'Fuel Management',
    titleAm: 'Վառելիքի կառավարում',
    description: 'Fuel inventory and operations',
    descriptionAm: 'Վառելիքի պաշարներ և գործառնություններ',
    icon: Fuel,
    color: 'from-orange-500 to-orange-600',
    priority: 4
  }
];

// Utility functions
export const getNavigationItemById = (id: string): NavigationItem | undefined => {
  const findItem = (items: NavigationItem[]): NavigationItem | undefined => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItem(item.children);
        if (found) return found;
      }
    }
    return undefined;
  };
  return findItem(navigationItems);
};

export const buildBreadcrumbs = (path: string): NavigationItem[] => {
  const breadcrumbs: NavigationItem[] = [];
  const findPath = (items: NavigationItem[], currentPath: NavigationItem[]): boolean => {
    for (const item of items) {
      const newPath = [...currentPath, item];
      if (item.href === path) {
        breadcrumbs.push(...newPath);
        return true;
      }
      if (item.children && findPath(item.children, newPath)) {
        return true;
      }
    }
    return false;
  };
  findPath(navigationItems, []);
  return breadcrumbs;
};
