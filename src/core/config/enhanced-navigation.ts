import { 
  NavigationItem, 
  NavigationCategoryConfig, 
  NavigationCategory,
  QuickAction 
} from '@/core/types/navigation';
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
  ShoppingCart,
  CalendarDays,
  UserCheck,
  Gauge,
  Database,
  Package,
  PiggyBank,
  Truck,
  Wrench,
  PieChart,
  Activity,
  Target,
  Calculator,
  Receipt,
  Banknote,
  Clock,
  Shield,
  Droplets
} from 'lucide-react';

// Navigation categories configuration with Armenian translations
export const enhancedNavigationCategories: NavigationCategoryConfig[] = [
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
  },
  {
    id: 'reports',
    title: 'Reports',
    titleAm: 'Հաշվետվություններ',
    description: 'Analytics and reporting',
    descriptionAm: 'Վերլուծություն և հաշվետվություն',
    icon: FileText,
    color: 'from-purple-500 to-purple-600',
    priority: 5
  },
  {
    id: 'settings',
    title: 'Settings',
    titleAm: 'Կարգավորումներ',
    description: 'System configuration',
    descriptionAm: 'Համակարգի կազմաձևում',
    icon: Settings,
    color: 'from-gray-500 to-gray-600',
    priority: 6
  }
];

// Comprehensive navigation structure with Armenian translations
export const enhancedNavigationStructure: NavigationItem[] = [
  {
    id: 'overview',
    name: 'Dashboard',
    nameAm: 'Կառավարման վահանակ',
    icon: LayoutDashboard,
    path: '/',
    description: 'Main dashboard overview',
    descriptionAm: 'Հիմնական վահանակի ակնարկ'
  },
  {
    id: 'management',
    name: 'Management',
    nameAm: 'Կառավարում',
    icon: Users,
    path: '/management',
    description: 'Staff and operations management',
    descriptionAm: 'Անձնակազմի և գործառնությունների կառավարում',
    children: [
      {
        id: 'management.shifts',
        name: 'Shifts',
        nameAm: 'Հերթափոխություններ',
        icon: CalendarDays,
        path: '/management/shifts',
        description: 'Employee shift management',
        descriptionAm: 'Աշխատակիցների հերթափոխությունների կառավարում'
      },
      {
        id: 'management.employees',
        name: 'Employees',
        nameAm: 'Աշխատակիցներ',
        icon: UserCheck,
        path: '/management/employees',
        description: 'Staff management',
        descriptionAm: 'Անձնակազմի կառավարում'
      }
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    nameAm: 'Ֆինանսներ',
    icon: DollarSign,
    path: '/finance',
    description: 'Financial management and analytics',
    descriptionAm: 'Ֆինանսական կառավարում և վերլուծություն',
    children: [
      {
        id: 'finance.dashboard',
        name: 'Finance Dashboard',
        nameAm: 'Ֆինանսական վահանակ',
        icon: BarChart3,
        path: '/finance/dashboard',
        description: 'Overview/analytics',
        descriptionAm: 'Ակնարկ/վերլուծություն'
      },
      {
        id: 'finance.sales',
        name: 'Sales',
        nameAm: 'Վաճառք',
        icon: TrendingUp,
        path: '/finance/sales',
        description: 'Transaction tracking',
        descriptionAm: 'Գործարքների հետևում'
      },
      {
        id: 'finance.expenses',
        name: 'Expenses',
        nameAm: 'Ծախսեր',
        icon: CreditCard,
        path: '/finance/expenses',
        description: 'Cost management',
        descriptionAm: 'Ծախսերի կառավարում'
      },
      {
        id: 'finance.revenue',
        name: 'Revenue',
        nameAm: 'Եկամուտ',
        icon: Wallet,
        path: '/finance/revenue',
        description: 'Income tracking',
        descriptionAm: 'Եկամտի հետևում'
      },
      {
        id: 'finance.payment-methods',
        name: 'Payment Methods',
        nameAm: 'Վճարման մեթոդներ',
        icon: Banknote,
        path: '/finance/payment-methods',
        description: 'Payment processing options',
        descriptionAm: 'Վճարման մշակման տարբերակներ'
      }
    ]
  },
  {
    id: 'fuel',
    name: 'Fuel Management',
    nameAm: 'Վառելիքի կառավարում',
    icon: Fuel,
    path: '/fuel-management',
    description: 'Fuel inventory and operations',
    descriptionAm: 'Վառելիքի պաշարներ և գործառնություններ',
    children: [
      {
        id: 'fuel.dashboard',
        name: 'Fuel Dashboard',
        nameAm: 'Վառելիքի վահանակ',
        icon: Gauge,
        path: '/fuel-management/dashboard',
        description: 'Fuel analytics overview',
        descriptionAm: 'Վառելիքի վերլուծության ակնարկ'
      },
      {
        id: 'fuel.tanks',
        name: 'Tanks',
        nameAm: 'Ցիստեռներ',
        icon: Database,
        path: '/fuel-management/tanks',
        description: 'Storage tank management',
        descriptionAm: 'Պահման ցիստեռների կառավարում'
      },
      {
        id: 'fuel.supplies',
        name: 'Fuel Supplies',
        nameAm: 'Վառելիքի մատակարարում',
        icon: Package,
        path: '/fuel-management/fuel-supplies',
        description: 'Inventory management',
        descriptionAm: 'Պաշարների կառավարում'
      },
      {
        id: 'fuel.prices',
        name: 'Fuel Prices',
        nameAm: 'Վառելիքի գներ',
        icon: PiggyBank,
        path: '/fuel-management/prices',
        description: 'Pricing management',
        descriptionAm: 'Գնակառուցման կառավարում'
      },
      {
        id: 'fuel.types',
        name: 'Fuel Types',
        nameAm: 'Վառելիքի տիպեր',
        icon: Droplets,
        path: '/fuel-management/fuel-types',
        description: 'Product catalog',
        descriptionAm: 'Ապրանքների կատալոգ'
      },
      {
        id: 'fuel.filling-systems',
        name: 'Filling Systems',
        nameAm: 'Վառելիքի համակարգեր',
        icon: Wrench,
        path: '/fuel-management/filling-systems',
        description: 'Pump/dispenser management',
        descriptionAm: 'Պոմպերի/բաշխիչների կառավարում'
      },
      {
        id: 'fuel.providers',
        name: 'Petrol Providers',
        nameAm: 'Բենզինի մատակարարներ',
        icon: Truck,
        path: '/fuel-management/providers',
        description: 'Supplier management',
        descriptionAm: 'Մատակարարների կառավարում'
      }
    ]
  },
  {
    id: 'reports',
    name: 'Reports',
    nameAm: 'Հաշվետվություններ',
    icon: FileText,
    path: '/reports',
    description: 'Analytics and reporting',
    descriptionAm: 'Վերլուծություն և հաշվետվություն'
  },
  {
    id: 'settings',
    name: 'Settings',
    nameAm: 'Կարգավորումներ',
    icon: Settings,
    path: '/settings',
    description: 'System configuration',
    descriptionAm: 'Համակարգի կազմաձևում'
  }
];

// Quick actions for enhanced navigation
export const enhancedQuickActions: QuickAction[] = [
  {
    id: 'new-sale',
    name: 'New Sale',
    nameAm: 'Նոր վաճառք',
    icon: ShoppingCart,
    path: '/finance/sales/new',
    description: 'Record a new transaction',
    descriptionAm: 'Գրանցել նոր գործարք',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'check-tanks',
    name: 'Check Tanks',
    nameAm: 'Ստուգել ցիստեռները',
    icon: Database,
    path: '/fuel-management/tanks',
    description: 'Monitor fuel levels',
    descriptionAm: 'Վերահսկել վառելիքի մակարդակները',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'add-expense',
    name: 'Add Expense',
    nameAm: 'Ավելացնել ծախս',
    icon: Receipt,
    path: '/finance/expenses/new',
    description: 'Record new expense',
    descriptionAm: 'Գրանցել նոր ծախս',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'shift-management',
    name: 'Manage Shifts',
    nameAm: 'Կառավարել հերթափոխությունները',
    icon: Clock,
    path: '/management/shifts',
    description: 'Schedule employee shifts',
    descriptionAm: 'Պլանավորել աշխատակիցների հերթափոխությունները',
    color: 'from-purple-500 to-purple-600'
  }
];

// Utility functions
export const getEnhancedNavigationItemById = (id: string): NavigationItem | undefined => {
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
  return findItem(enhancedNavigationStructure);
};

export const getEnhancedNavigationItemsByCategory = (categoryId: NavigationCategory): NavigationItem[] => {
  return enhancedNavigationStructure.filter(item => item.id.startsWith(categoryId));
};

export const buildEnhancedBreadcrumbs = (path: string): NavigationItem[] => {
  const breadcrumbs: NavigationItem[] = [];
  const findPath = (items: NavigationItem[], currentPath: NavigationItem[]): boolean => {
    for (const item of items) {
      const newPath = [...currentPath, item];
      if (item.path === path) {
        breadcrumbs.push(...newPath);
        return true;
      }
      if (item.children && findPath(item.children, newPath)) {
        return true;
      }
    }
    return false;
  };
  findPath(enhancedNavigationStructure, []);
  return breadcrumbs;
};

export const searchEnhancedNavigationItems = (query: string, language: 'en' | 'am' = 'en'): NavigationItem[] => {
  const results: NavigationItem[] = [];
  const normalizedQuery = query.toLowerCase().trim();
  
  const searchInItems = (items: NavigationItem[]) => {
    for (const item of items) {
      const name = language === 'am' ? (item.nameAm || item.name) : item.name;
      const description = language === 'am' ? (item.descriptionAm || item.description) : item.description;
      
      if (
        name.toLowerCase().includes(normalizedQuery) ||
        (description && description.toLowerCase().includes(normalizedQuery))
      ) {
        results.push(item);
      }
      
      if (item.children) {
        searchInItems(item.children);
      }
    }
  };
  
  searchInItems(enhancedNavigationStructure);
  return results;
};

export const getEnhancedFavoriteItems = (favoriteIds: string[]): NavigationItem[] => {
  return favoriteIds.map(id => getEnhancedNavigationItemById(id)).filter(Boolean) as NavigationItem[];
};

export const getEnhancedModuleStats = (moduleId: NavigationCategory): { total: number; accessible: number } => {
  const moduleItems = getEnhancedNavigationItemsByCategory(moduleId);
  const total = moduleItems.reduce((acc, item) => acc + (item.children?.length || 1), 0);
  return { total, accessible: total }; // Assuming all items are accessible for now
}; 