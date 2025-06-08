
import { LucideIcon } from 'lucide-react';

export type IconType = LucideIcon | React.ComponentType<{ className?: string }>;

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon?: IconType;
  description?: string;
  isActive?: boolean;
  badge?: string | number;
  children?: NavigationItem[];
  roles?: string[];
  permissions?: string[];
  name?: string; // Add for backward compatibility
}

export interface NavigationFeature {
  id: string;
  title: string;
  description?: string;
  icon: IconType;
  path: string;
  color: string;
  status: string;
  metrics?: {
    label: string;
    value: string;
    color?: string;
    trend?: string;
  };
  tags?: string[];
  children?: NavigationFeature[];
}

export interface QuickAction {
  id: string;
  title: string;
  description?: string;
  icon: IconType;
  href: string;
  color?: string;
  roles?: string[];
  permissions?: string[];
}

export interface NavigationCategory {
  id: string;
  title: string;
  description?: string;
  icon?: IconType;
  items: NavigationItem[];
  roles?: string[];
  permissions?: string[];
}

export interface NavigationCategoryConfig {
  id?: string; // Add for backward compatibility
  categories: NavigationCategory[];
  quickActions?: QuickAction[];
}

export interface NavigationConfig {
  main: NavigationCategoryConfig;
  settings?: NavigationCategoryConfig;
  admin?: NavigationCategoryConfig;
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface NavigationState {
  currentPath: string;
  breadcrumbs: BreadcrumbItem[];
  activeCategory?: string;
  activeItem?: string;
}
