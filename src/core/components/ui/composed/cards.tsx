/**
 * @deprecated Use components from @/core/components/ui/cards instead.
 * This file is kept for backward compatibility and will be removed in a future release.
 * Please update your imports to use the new card component system.
 */

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  MetricCard,
  ActionCard,
  StatsCard,
  SummaryCard
} from "@/core/components/ui/card";

// Re-export all components
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  MetricCard,
  ActionCard,
  StatsCard,
  SummaryCard
};

// Simply re-export the Cards component
export const Cards = () => null;
