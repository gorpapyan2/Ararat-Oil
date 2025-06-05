import { LucideIcon } from "lucide-react";
import { BarChart3, Users, Settings, CreditCard, CalendarClock, Database, Bug, Grid3X3 } from "lucide-react";
import {
  IconGasStation,
  IconUser,
  IconReport,
  IconReceipt,
  IconCash,
  IconChartLine,
  IconCoin,
  IconTank,
  type Icon,
} from "@/core/components/ui/icons";
import { useTranslation } from "react-i18next";
import { featuresConfig } from "@/core/config/features";
import type { NavItemConfig } from "@/shared/components/sidebar/SidebarNavSection";
import type { NavigationFeature } from "@/core/types/navigation";
import type React from "react";
import { 
  NavigationItem, 
  NavigationCategoryConfig, 
  NavigationCategory,
  QuickAction,
  IconType
} from '@/core/types/navigation';
import {
  LayoutDashboard,
  DollarSign,
  Fuel,
  FileText,
  TrendingUp,
  Wallet,
  ShoppingCart,
  CalendarDays,
  UserCheck,
  Gauge,
  Package,
  PiggyBank,
  Building,
  Truck,
  Wrench,
  PieChart,
  Activity,
  Target,
  Calculator,
  Banknote,
  FuelIcon,
  Factory,
  MapPin,
  Clock,
  Shield
} from 'lucide-react';

/**
 * Hook that provides navigation configuration for the sidebar
 *
 * @returns Object containing navigation sections with their routes
 */
export const useSidebarNavConfig = () => {
  const { t } = useTranslation();

  // Ensure some common sidebar translation keys are registered for extraction
  t("sidebar.expandSidebar", "Expand sidebar");
  t("sidebar.collapseSidebar", "Collapse sidebar");
  t("sidebar.collapse", "Collapse");
  t("sidebar.hasSubmenu", "Has submenu");

  // Helper: recursively build NavItemConfig from NavigationFeature
  const buildNavItem = (feature: NavigationFeature): NavItemConfig => {
    let iconComponent: React.ElementType;

    if (typeof feature.icon === "string") {
      // If the icon is a plain string (emoji), fall back to a default icon
      iconComponent = BarChart3;
    } else if (feature.icon) {
      iconComponent = feature.icon as unknown as React.ElementType;
    } else {
      iconComponent = BarChart3;
    }

    return {
      to: feature.path,
      icon: iconComponent,
      label: feature.title,
      children: feature.children?.map(buildNavItem),
    };
  };

  // Group features by category while preserving optional priority / alphabetical order
  const navSections: Record<string, NavItemConfig[]> = {};

  // Sort features by optional priority then title for consistency
  const sortedFeatures = [...featuresConfig.features].sort((a, b) => {
    const prioDiff = (a.priority ?? 0) - (b.priority ?? 0);
    if (prioDiff !== 0) return prioDiff;
    return a.title.localeCompare(b.title);
  });

  sortedFeatures.forEach((feature) => {
    const sectionKey = feature.category;
    if (!navSections[sectionKey]) navSections[sectionKey] = [];
    navSections[sectionKey].push(buildNavItem(feature));
  });

  // Return generated sections – caller (Sidebar) will iterate via Object.entries()
  return navSections;
};

export interface LegacyNavigationItem {
  to: string;
  icon: IconType;
  label: string;
  children?: LegacyNavigationItem[];
}

export const navigationConfig: LegacyNavigationItem[] = [
  {
    to: "/dashboard",
    icon: BarChart3,
    label: "dashboard",
  },
  {
    to: "/management",
    icon: Users,
    label: "management",
    children: [
      {
        to: "/management/shifts",
        icon: CalendarClock,
        label: "shifts",
      },
      {
        to: "/management/employees",
        icon: Users,
        label: "employees",
      },
    ],
  },
  {
    to: "/finance",
    icon: CreditCard,
    label: "finance",
    children: [
      {
        to: "/finance/dashboard",
        icon: BarChart3,
        label: "finance_dashboard",
      },
      {
        to: "/finance/sales",
        icon: TrendingUp,
        label: "sales",
      },
      {
        to: "/finance/expenses",
        icon: CreditCard,
        label: "expenses",
      },
      {
        to: "/finance/revenue",
        icon: Wallet,
        label: "revenue",
      },
      {
        to: "/finance/payment-methods",
        icon: Banknote,
        label: "payment_methods",
      },
    ],
  },
  {
    to: "/fuel-management",
    icon: Fuel,
    label: "fuel_management",
    children: [
      {
        to: "/fuel-management/dashboard",
        icon: BarChart3,
        label: "fuel_dashboard",
      },
      {
        to: "/fuel-management/tanks",
        icon: Database,
        label: "tanks",
      },
      {
        to: "/fuel-management/fuel-supplies",
        icon: Package,
        label: "fuel_supplies",
      },
      {
        to: "/fuel-management/prices",
        icon: PiggyBank,
        label: "fuel_prices",
      },
      {
        to: "/fuel-management/fuel-types",
        icon: Fuel,
        label: "fuel_types",
      },
      {
        to: "/fuel-management/filling-systems",
        icon: Wrench,
        label: "filling_systems",
      },
      {
        to: "/fuel-management/providers",
        icon: Truck,
        label: "providers",
      },
    ],
  },
];

// Navigation categories configuration with Armenian translations - focused on 3 main modules
export const navigationCategories: NavigationCategoryConfig[] = [
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
    color: 'from-gray-500 to-gray-600',
    priority: 2
  },
  {
    id: 'finance',
    title: 'Finance',
    titleAm: 'Ֆինանսներ',
    description: 'Financial management and analytics',
    descriptionAm: 'Ֆինանսական կառավարում և վերլուծություն',
    icon: DollarSign,
    color: 'from-green-500 to-green-600',
    priority: 3
  },
  {
    id: 'fuel',
    title: 'Fuel Management',
    titleAm: 'Վառելիքի կառավարում',
    description: 'Fuel inventory and operations',
    descriptionAm: 'Վառելիքի պաշարներ և գործառնություններ',
    icon: Fuel,
    color: 'from-blue-500 to-blue-600',
    priority: 4
  }
];

// Comprehensive navigation structure with Armenian translations - focused on 3 main modules
export const navigationStructure: NavigationItem[] = [
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
        description: 'Staff management and profiles',
        descriptionAm: 'Անձնակազմի կառավարում և պրոֆիլներ'
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
        description: 'Financial overview and analytics',
        descriptionAm: 'Ֆինանսական ակնարկ և վերլուծություն'
      },
      {
        id: 'finance.sales',
        name: 'Sales',
        nameAm: 'Վաճառք',
        icon: TrendingUp,
        path: '/finance/sales',
        description: 'Sales tracking and management',
        descriptionAm: 'Վաճառքի հետևում և կառավարում'
      },
      {
        id: 'finance.expenses',
        name: 'Expenses',
        nameAm: 'Ծախսեր',
        icon: CreditCard,
        path: '/finance/expenses',
        description: 'Expense tracking and management',
        descriptionAm: 'Ծախսերի հետևում և կառավարում'
      },
      {
        id: 'finance.revenue',
        name: 'Revenue',
        nameAm: 'Եկամուտ',
        icon: Wallet,
        path: '/finance/revenue',
        description: 'Revenue tracking and analysis',
        descriptionAm: 'Եկամտի հետևում և վերլուծություն'
      },
      {
        id: 'finance.payments',
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
        descriptionAm: 'Պահանջարկի ցիստեռների կառավարում'
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
        icon: Fuel,
        path: '/fuel-management/fuel-types',
        description: 'Product catalog',
        descriptionAm: 'Ապրանքների կատալոգ'
      },
      {
        id: 'fuel.filling',
        name: 'Filling Systems',
        nameAm: 'Վառելիքի համակարգեր',
        icon: Wrench,
        path: '/fuel-management/filling-systems',
        description: 'Pump and dispenser management',
        descriptionAm: 'Պոմպերի և բաշխիչների կառավարում'
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
  }
];

// Quick actions for common tasks - updated to focus on the 3 main modules
export const quickActions: QuickAction[] = [
  {
    id: 'add-sale',
    title: 'New Sale',
    nameAm: 'Նոր վաճառք',
    icon: ShoppingCart,
    path: '/finance/sales/new',
    color: 'from-green-500 to-green-600',
    description: 'Record a new sale',
    action: () => window.location.href = '/finance/sales/new',
    category: 'finance'
  },
  {
    id: 'add-expense',
    title: 'Add Expense',
    nameAm: 'Ավելացնել ծախս',
    icon: CreditCard,
    path: '/finance/expenses/new',
    color: 'from-red-500 to-red-600',
    description: 'Record a new expense',
    action: () => window.location.href = '/finance/expenses/new',
    category: 'finance'
  },
  {
    id: 'check-inventory',
    title: 'Check Inventory',
    nameAm: 'Ստուգել պաշարները',
    icon: Package,
    path: '/fuel-management/fuel-supplies',
    color: 'from-blue-500 to-blue-600',
    description: 'View current inventory levels',
    action: () => window.location.href = '/fuel-management/fuel-supplies',
    category: 'fuel'
  },
  {
    id: 'update-prices',
    title: 'Update Prices',
    nameAm: 'Թարմացնել գները',
    icon: PiggyBank,
    path: '/fuel-management/prices',
    color: 'from-yellow-500 to-yellow-600',
    description: 'Update fuel prices',
    action: () => window.location.href = '/fuel-management/prices',
    category: 'fuel'
  },
  {
    id: 'schedule-shift',
    title: 'Schedule Shift',
    nameAm: 'Նշանակել հերթափոխություն',
    icon: Clock,
    path: '/management/shifts/new',
    color: 'from-purple-500 to-purple-600',
    description: 'Schedule employee shift',
    action: () => window.location.href = '/management/shifts/new',
    category: 'management'
  },
  {
    id: 'manage-employees',
    title: 'Manage Employees',
    nameAm: 'Կառավարել աշխատակիցներին',
    icon: Users,
    path: '/management/employees',
    color: 'from-indigo-500 to-indigo-600',
    description: 'Access employee management',
    action: () => window.location.href = '/management/employees',
    category: 'management'
  }
];

// Helper functions
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
  
  return findItem(navigationStructure);
};

export const getNavigationItemsByCategory = (categoryId: NavigationCategory): NavigationItem[] => {
  return navigationStructure.filter(item => item.id === categoryId || item.path.startsWith(`/${categoryId}`));
};

export const buildBreadcrumbs = (path: string): NavigationItem[] => {
  const breadcrumbs: NavigationItem[] = [];
  const pathSegments = path.split('/').filter(Boolean);
  
  let currentPath = '';
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;
    const item = getNavigationItemById(segment) || navigationStructure.find(nav => nav.path === currentPath);
    if (item) {
      breadcrumbs.push(item);
    }
  });
  
  return breadcrumbs;
};

export const searchNavigationItems = (query: string, language: 'en' | 'am' = 'en'): NavigationItem[] => {
  const results: NavigationItem[] = [];
  const searchQuery = query.toLowerCase();
  
  const searchInItems = (items: NavigationItem[]) => {
    items.forEach(item => {
      const name = language === 'am' ? (item.nameAm || item.name) : item.name;
      const description = language === 'am' ? (item.descriptionAm || item.description) : item.description;
      
      if (name?.toLowerCase().includes(searchQuery) || 
          (description && description.toLowerCase().includes(searchQuery))) {
        results.push(item);
      }
      
      if (item.children) {
        searchInItems(item.children);
      }
    });
  };
  
  searchInItems(navigationStructure);
  return results;
};

export const getFavoriteItems = (favoriteIds: string[]): NavigationItem[] => {
  return favoriteIds.map(id => getNavigationItemById(id)).filter(Boolean) as NavigationItem[];
};

export const getModuleStats = (moduleId: NavigationCategory): { total: number; accessible: number } => {
  const moduleItem = navigationStructure.find(item => item.id === moduleId);
  if (!moduleItem) return { total: 0, accessible: 0 };
  
  const total = moduleItem.children ? moduleItem.children.length : 0;
  const accessible = total; // For now, assume all are accessible
  
  return { total, accessible };
};
