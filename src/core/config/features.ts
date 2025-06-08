
import { NavigationConfig, NavigationFeature } from '@/core/types/navigation';
import { navigationItems, navigationCategories } from './navigation';

// Convert navigation items to features format for backward compatibility
const convertToFeatures = (items: typeof navigationItems): NavigationFeature[] => {
  return items.flatMap(item => {
    const feature: NavigationFeature = {
      id: item.id,
      title: item.title,
      titleAm: item.descriptionAm ? item.title : undefined,
      description: item.description,
      descriptionAm: item.descriptionAm,
      icon: item.icon!,
      path: item.href,
      color: 'from-blue-500 to-blue-600',
      status: 'active',
      category: getCategoryForItem(item.id),
      metrics: getMetricsForItem(item.id),
      tags: getTagsForItem(item.id)
    };

    if (item.children) {
      feature.children = convertToFeatures(item.children);
    }

    return [feature];
  });
};

const getCategoryForItem = (id: string): string => {
  if (id.startsWith('management') || id === 'shifts' || id === 'employees') return 'management';
  if (id.startsWith('finance') || ['sales', 'expenses', 'revenue', 'payment-methods'].includes(id)) return 'finance';
  if (id.startsWith('fuel') || ['tanks', 'fuel-supplies', 'fuel-prices', 'fuel-types', 'filling-systems', 'providers'].includes(id)) return 'fuel';
  if (id === 'dashboard') return 'overview';
  return 'other';
};

const getMetricsForItem = (id: string) => {
  const metrics: Record<string, { label: string; value: string; trend?: string; color?: string }[]> = {
    'dashboard': [{ label: 'Active Systems', value: '8/10', trend: 'up' }],
    'management': [{ label: 'Total Staff', value: '45', trend: 'up' }],
    'finance': [{ label: 'Monthly Revenue', value: '$125K', trend: 'up' }],
    'fuel-management': [{ label: 'Active Tanks', value: '8/10', trend: 'up' }]
  };
  return metrics[id];
};

const getTagsForItem = (id: string): string[] => {
  const tags: Record<string, string[]> = {
    'dashboard': ['analytics', 'real-time', 'overview'],
    'management': ['management', 'staff', 'operations'],
    'finance': ['finance', 'revenue', 'expenses'],
    'fuel-management': ['operations', 'inventory', 'critical']
  };
  return tags[id] || [];
};

export const featuresConfig: NavigationConfig = {
  categories: navigationCategories,
  features: convertToFeatures(navigationItems),
  main: {
    categories: navigationCategories
  }
};

export const getFeaturesByCategory = (category: string) => 
  featuresConfig.features?.filter(feature => feature.category === category) || [];

export const getFeatureById = (id: string) => 
  featuresConfig.features?.find(feature => feature.id === id);

export const getAllCategories = () => featuresConfig.categories || [];
