import { LucideIcon } from "lucide-react";
import { type Icon } from "@/core/components/ui/icons";

export type NavigationCategory = 
  | 'overview'
  | 'operations'
  | 'finance'
  | 'management'
  | 'reports'
  | 'settings'
  | 'development';

export type FeatureStatus = 'active' | 'beta' | 'coming-soon' | 'deprecated' | 'maintenance';

export type MetricTrend = 'up' | 'down' | 'stable';

export interface FeatureMetric {
  label: string;
  value: string | number;
  trend?: MetricTrend;
  percentage?: number;
  icon?: LucideIcon;
}

export interface NavigationFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon | string;
  path: string;
  color: string;
  category: NavigationCategory;
  status: FeatureStatus;
  tags?: string[];
  metrics?: FeatureMetric[];
  children?: NavigationFeature[];
  permissions?: string[];
  isNew?: boolean;
  priority?: number;
  lastUpdated?: Date;
  estimatedTime?: string;
  requiredRole?: string[];
}

export interface FeatureCategory {
  id: NavigationCategory;
  title: string;
  description: string;
  icon: LucideIcon | string;
  color: string;
  features: NavigationFeature[];
}

export interface NavigationConfig {
  categories: FeatureCategory[];
  features: NavigationFeature[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon | string;
  current?: boolean;
}

export interface PageBreadcrumbs {
  items: BreadcrumbItem[];
  showHome?: boolean;
  separator?: string;
}

// Search and Filter Types
export interface FeatureSearchFilters {
  category?: NavigationCategory | 'all';
  status?: FeatureStatus | 'all';
  tags?: string[];
  searchQuery?: string;
  sortBy?: 'name' | 'category' | 'status' | 'priority' | 'updated';
  sortOrder?: 'asc' | 'desc';
}

export interface FeatureSearchResult {
  features: NavigationFeature[];
  totalCount: number;
  categories: Record<NavigationCategory, number>;
  tags: Record<string, number>;
}

// Business Logic Types
export interface FeatureAnalytics {
  featureId: string;
  viewCount: number;
  lastAccessed: Date;
  averageSessionTime: number;
  userFeedback: number;
  popularityScore: number;
}

export interface UserPermissions {
  features: string[];
  categories: NavigationCategory[];
  roles: string[];
  isAdmin: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon | string;
  action: () => void;
  shortcut?: string;
  category: string;
}

export interface NavigationState {
  currentFeature?: string;
  currentCategory?: NavigationCategory;
  recentFeatures: string[];
  favoriteFeatures: string[];
  quickActions: QuickAction[];
  breadcrumbs: BreadcrumbItem[];
}

// UI Component Props
export interface FeatureCardProps {
  feature: NavigationFeature;
  size?: 'small' | 'medium' | 'large';
  showMetrics?: boolean;
  showDescription?: boolean;
  showTags?: boolean;
  showStatus?: boolean;
  onClick?: (feature: NavigationFeature) => void;
  className?: string;
}

export interface CategorySectionProps {
  category: FeatureCategory;
  features: NavigationFeature[];
  viewMode?: 'grid' | 'list';
  showStats?: boolean;
  className?: string;
}

export interface NavigationSearchProps {
  filters: FeatureSearchFilters;
  onFiltersChange: (filters: FeatureSearchFilters) => void;
  results: FeatureSearchResult;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

// Advanced Feature Types
export interface FeatureWorkflow {
  id: string;
  name: string;
  description: string;
  steps: FeatureWorkflowStep[];
  category: NavigationCategory;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface FeatureWorkflowStep {
  id: string;
  title: string;
  description: string;
  featureId: string;
  order: number;
  required: boolean;
  completed?: boolean;
}

export interface FeatureIntegration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'database' | 'file' | 'service';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync?: Date;
  config: Record<string, any>;
}

export interface FeatureNotification {
  id: string;
  featureId: string;
  type: 'update' | 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url?: string;
    handler?: () => void;
  };
}

// Utility Types
export type FeatureMap = Record<string, NavigationFeature>;
export type CategoryMap = Record<NavigationCategory, FeatureCategory>;
export type StatusMap = Record<FeatureStatus, NavigationFeature[]>;

// Export utility type guards
export const isNavigationFeature = (obj: any): obj is NavigationFeature => {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string';
};

export const isFeatureCategory = (obj: any): obj is FeatureCategory => {
  return obj && typeof obj.id === 'string' && Array.isArray(obj.features);
};

export const isValidCategory = (category: string): category is NavigationCategory => {
  return ['overview', 'operations', 'finance', 'management', 'reports', 'settings', 'development'].includes(category);
};

export const isValidStatus = (status: string): status is FeatureStatus => {
  return ['active', 'beta', 'coming-soon', 'deprecated', 'maintenance'].includes(status);
}; 