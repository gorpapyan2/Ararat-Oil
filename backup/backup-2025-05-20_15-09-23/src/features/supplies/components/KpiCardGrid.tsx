import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/primitives/card';
import { Progress } from '@/core/components/ui/primitives/progress';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { SuppliesSummary } from '../types';
import { Droplet, DollarSign, Calendar, Gauge } from 'lucide-react';

interface KpiCardGridProps {
  summary: SuppliesSummary;
  isLoading?: boolean;
}

export function KpiCardGrid({ summary, isLoading }: KpiCardGridProps) {
  const { t } = useTranslation();
  const tankLevelPercentage = (summary.currentTankLevel / summary.tankCapacity) * 100;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('supplies.totalLiters', 'Total Liters')}
            </CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold"
            >
              {summary.totalLiters.toLocaleString()}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('supplies.totalCost', 'Total Cost')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold"
            >
              ${summary.totalCost.toLocaleString()}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('supplies.lastDelivery', 'Last Delivery')}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold"
            >
              {format(new Date(summary.lastDelivery), 'MMM d, yyyy')}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('supplies.tankLevel', 'Tank Level')}
            </CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold"
              >
                {tankLevelPercentage.toFixed(1)}%
              </motion.div>
              <Progress value={tankLevelPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {summary.currentTankLevel.toLocaleString()} / {summary.tankCapacity.toLocaleString()} L
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
} 