import { LucideIcon } from "lucide-react";
import { type Icon } from "@/core/components/ui/icons";

// Better type definition for icons that supports both systems
export type IconType = LucideIcon | Icon | React.ComponentType<{ className?: string }> | string;

export type NavigationCategory = 
  | 'overview'
  | 'operations'
  | 'finance'
  | 'management'
  | 'reports'
  | 'settings'
  | 'development'
  | 'fuel';

export type FeatureStatus = 'active' | 'beta' | 'coming-soon' | 'deprecated' | 'maintenance';

export type MetricTrend = 'up' | 'down' | 'stable';

// Navigation structure interfaces
export interface NavigationItem {
  id: string;
  name: string;
  nameAm?: string;
  icon: IconType;
  path: string;
  description?: string;
  descriptionAm?: string;
  children?: NavigationItem[];
  category?: NavigationCategory;
  priority?: number;
  permissions?: string[];
}

export interface NavigationCategoryConfig {
  id: NavigationCategory;
  title: string;
  titleAm?: string;
  description: string;
  descriptionAm?: string;
  icon: IconType;
  color: string;
  priority: number;
}

export interface FeatureMetric {
  label: string;
  value: string | number;
  trend?: MetricTrend;
  percentage?: number;
  icon?: IconType;
}

export interface NavigationFeature {
  id: string;
  title: string;
  description: string;
  icon: IconType;
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
  icon: IconType;
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
  icon?: IconType;
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
  name?: string;
  nameAm?: string;
  description?: string;
  icon: IconType;
  action: () => void;
  shortcut?: string;
  category: string;
  path?: string;
  color?: string;
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
  config: Record<string, unknown>;
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
export const isNavigationFeature = (obj: unknown): obj is NavigationFeature => {
  return obj !== null && typeof obj === 'object' && 'id' in obj && 'title' in obj && 
         typeof (obj as Record<string, unknown>).id === 'string' && 
         typeof (obj as Record<string, unknown>).title === 'string';
};

export const isFeatureCategory = (obj: unknown): obj is FeatureCategory => {
  return obj !== null && typeof obj === 'object' && 'id' in obj && 'features' in obj &&
         typeof (obj as Record<string, unknown>).id === 'string' && 
         Array.isArray((obj as Record<string, unknown>).features);
};

export const isValidCategory = (category: string): category is NavigationCategory => {
  return ['overview', 'operations', 'finance', 'management', 'reports', 'settings', 'development', 'fuel'].includes(category);
};

export const isValidStatus = (status: string): status is FeatureStatus => {
  return ['active', 'beta', 'coming-soon', 'deprecated', 'maintenance'].includes(status);
}; 