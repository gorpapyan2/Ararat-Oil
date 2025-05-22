/**
 * Unified card component system
 * 
 * This module exports a comprehensive set of card components designed to 
 * provide a consistent UI experience throughout the application.
 * 
 * @example
 * ```tsx
 * import { 
 *   Card, 
 *   CardHeader, 
 *   CardTitle, 
 *   MetricCard, 
 *   CardGrid 
 * } from "@/core/components/ui/cards";
 * ```
 */

// Base Card Components
export * from "./card";

// Specialized Card Components
export * from "./metric-card";
export * from "./action-card";
export * from "./stats-card";
export * from "./summary-card";
export * from "./info-card";

// Layout Components
export * from "./card-grid";

// Types
export type {
  CardBaseProps,
  CardHeaderProps,
  CardFooterProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardMediaProps,
  CardActionsProps,
  MetricCardProps,
  ActionCardProps,
  StatsCardProps,
  SummaryCardProps,
  InfoCardProps,
} from "./types"; 