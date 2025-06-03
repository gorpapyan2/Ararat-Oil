import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Zap, Star, Clock, TrendingUp, Users, Activity, ArrowRight, Bookmark, Eye, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils';
import { Input } from '@/core/components/ui/input';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/primitives/badge';
import { PageHeader } from '@/core/components/ui/page-header';
import { FeatureCard } from '@/core/components/ui/FeatureCard';
import { featuresConfig, getFeaturesByCategory, getAllCategories } from '@/core/config/features';
import { NavigationCategory, NavigationFeature, FeatureCategory } from '@/core/types/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';

type ViewMode = 'grid' | 'list' | 'compact';
type SortMode = 'name' | 'category' | 'status' | 'recent' | 'priority';

export function NavigationPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NavigationCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('category');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Get categories properly typed
  const categories = getAllCategories();

  // Filter and sort features
  const filteredFeatures = useMemo(() => {
    let features = featuresConfig.features;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      features = features.filter(feature => 
        feature.title.toLowerCase().includes(query) ||
        feature.description.toLowerCase().includes(query) ||
        feature.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      features = features.filter(feature => feature.category === selectedCategory);
    }

    // Sort features
    features.sort((a, b) => {
      switch (sortMode) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'priority':
          return (b.priority || 0) - (a.priority || 0);
        default:
          return 0;
      }
    });

    return features;
  }, [searchQuery, selectedCategory, sortMode]);

  // Group features by category for organized display
  const groupedFeatures = useMemo(() => {
    const groups: Record<string, NavigationFeature[]> = {};
    
    if (selectedCategory === 'all') {
      categories.forEach(category => {
        const categoryFeatures = getFeaturesByCategory(category.id);
        if (categoryFeatures.length > 0) {
          groups[category.id] = categoryFeatures;
        }
      });
    } else {
      groups[selectedCategory] = filteredFeatures;
    }

    return groups;
  }, [selectedCategory, filteredFeatures, categories]);

  // Category stats
  const categoryStats = useMemo(() => {
    return categories.map(category => {
      const features = getFeaturesByCategory(category.id);
      const activeCount = features.filter(f => f.status === 'active').length;
      
      return {
        category: category.id,
        title: category.title,
        icon: category.icon,
        color: category.color,
        total: features.length,
        active: activeCount,
        percentage: features.length > 0 ? Math.round((activeCount / features.length) * 100) : 0
      };
    });
  }, [categories]);

  const getCategoryDisplayName = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.title || category;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'overview': return '📊';
      case 'operations': return '⚙️';
      case 'finance': return '💰';
      case 'management': return '👥';
      case 'reports': return '📈';
      case 'settings': return '⚙️';
      default: return '📁';
    }
  };

  const toggleFavorite = (featureId: string) => {
    setFavorites(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const quickStats = useMemo(() => {
    const totalFeatures = featuresConfig.features.length;
    const activeFeatures = featuresConfig.features.filter(f => f.status === 'active').length;
    const totalSubFeatures = featuresConfig.features.reduce((acc, f) => acc + (f.children?.length || 0), 0);
    const categoriesCount = categories.length;

    return {
      totalFeatures,
      activeFeatures,
      totalSubFeatures,
      categoriesCount,
      activePercentage: Math.round((activeFeatures / totalFeatures) * 100)
    };
  }, [categories]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-teal-600/5 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-teal-600/10">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium">
                <Layers className="w-4 h-4" />
                Navigation Center
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
                Business Control Hub
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Streamlined access to all business modules and features. Manage operations, finances, and analytics from your unified control center.
              </p>
            </motion.div>

            {/* Quick Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-6"
            >
              <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-xl mx-auto mb-2">
                    <Grid className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{quickStats.totalFeatures}</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Total Features</div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-xl mx-auto mb-2">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{quickStats.activeFeatures}</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Active Systems</div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-xl mx-auto mb-2">
                    <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{quickStats.categoriesCount}</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Categories</div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/10 rounded-xl mx-auto mb-2">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{quickStats.totalSubFeatures}</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Sub-modules</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search and Controls */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search features, modules, or capabilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-3"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'compact' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('compact')}
                    className="h-8 px-3"
                  >
                    <Layers className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button
                  variant={showFilters ? 'default' : 'outline'}
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-10"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    {/* Categories */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant={selectedCategory === 'all' ? 'default' : 'outline'}
                          className="cursor-pointer hover:bg-blue-500 hover:text-white transition-colors"
                          onClick={() => setSelectedCategory('all')}
                        >
                          All Categories
                        </Badge>
                        {categories.map(category => (
                          <Badge
                            key={category.id}
                            variant={selectedCategory === category.id ? 'default' : 'outline'}
                            className="cursor-pointer hover:bg-blue-500 hover:text-white transition-colors"
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            {getCategoryIcon(category.id)} {category.title}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sort by</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: 'category', label: 'Category' },
                          { value: 'name', label: 'Name' },
                          { value: 'status', label: 'Status' },
                          { value: 'priority', label: 'Priority' }
                        ].map(option => (
                          <Badge
                            key={option.value}
                            variant={sortMode === option.value ? 'default' : 'outline'}
                            className="cursor-pointer hover:bg-blue-500 hover:text-white transition-colors"
                            onClick={() => setSortMode(option.value as SortMode)}
                          >
                            {option.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Results Info */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Results</label>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span>
                          Showing <span className="font-medium text-slate-900 dark:text-white">{filteredFeatures.length}</span> of <span className="font-medium">{featuresConfig.features.length}</span> features
                        </span>
                        {filteredFeatures.length !== featuresConfig.features.length && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedCategory('all');
                              setShowFilters(false);
                            }}
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Category Overview */}
        {selectedCategory === 'all' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Feature Categories</h2>
              <p className="text-slate-600 dark:text-slate-400">Explore features organized by business function</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categoryStats.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="group border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => setSelectedCategory(category.category)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${category.color} text-white`}>
                          {typeof category.icon === 'string' ? (
                            <span className="text-lg sm:text-xl">{getCategoryIcon(category.category)}</span>
                          ) : (
                            <category.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        {category.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          {category.active} of {category.total} active
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-10 sm:w-12 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${category.color} transition-all duration-500`}
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            {category.percentage}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Features Display */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {selectedCategory === 'all' ? (
            // Show features by categories
            <div className="space-y-8">
              {Object.entries(groupedFeatures).map(([category, features]) => {
                if (features.length === 0) return null;
                
                const categoryData = categories.find(c => c.id === category);
                const stats = categoryStats.find(s => s.category === category);
                
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${categoryData?.color || 'from-gray-500 to-gray-600'} text-white`}>
                          {categoryData?.icon && typeof categoryData.icon !== 'string' ? (
                            <categoryData.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <span className="text-sm sm:text-base">{getCategoryIcon(category)}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                            {getCategoryDisplayName(category)}
                          </h3>
                          {stats && (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {stats.active} of {stats.total} features active
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCategory(category as NavigationCategory)}
                        className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                      >
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <div className={cn(
                      "grid gap-4",
                      viewMode === 'grid' && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                      viewMode === 'list' && "grid-cols-1",
                      viewMode === 'compact' && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    )}>
                      {features.slice(0, viewMode === 'compact' ? 8 : 6).map((feature, index) => (
                        <motion.div
                          key={feature.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <FeatureCard
                            feature={feature}
                            size={viewMode === 'compact' ? 'small' : viewMode === 'list' ? 'small' : 'medium'}
                            showDescription={viewMode !== 'compact'}
                            className="h-full"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            // Show filtered results for specific category
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    ← Back to all categories
                  </Button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {filteredFeatures.length} features found
                </p>
              </div>

              <div className={cn(
                "grid gap-4",
                viewMode === 'grid' && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                viewMode === 'list' && "grid-cols-1",
                viewMode === 'compact' && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              )}>
                {filteredFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FeatureCard
                      feature={feature}
                      size={viewMode === 'compact' ? 'small' : viewMode === 'list' ? 'small' : 'medium'}
                      showDescription={viewMode !== 'compact'}
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.section>

        {/* Empty State */}
        {filteredFeatures.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-6"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No features found</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                We couldn't find any features matching your search criteria. Try adjusting your filters or search terms.
              </p>
            </div>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setShowFilters(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Clear all filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 