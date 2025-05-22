/**
 * Shared types and interfaces for the card component system
 */
import * as React from "react";

/**
 * Common Card Component Props
 */
export interface CardBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the card is currently loading
   */
  isLoading?: boolean;

  /**
   * Card variant
   */
  variant?: "default" | "outline" | "ghost" | "elevated";

  /**
   * Card size
   */
  size?: "sm" | "md" | "lg";

  /**
   * Whether to display a hover effect
   */
  hover?: boolean;

  /**
   * Whether the card is interactive (clickable)
   */
  interactive?: boolean;

  /**
   * Whether the card is disabled
   */
  disabled?: boolean;

  /**
   * Card border radius
   */
  radius?: "none" | "sm" | "md" | "lg" | "full";
}

/**
 * Card Header Props
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to add padding to the header
   * @default true
   */
  padded?: boolean;

  /**
   * Whether to add a border to the bottom of the header
   * @default false
   */
  bordered?: boolean;
}

/**
 * Card Footer Props
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to add padding to the footer
   * @default true
   */
  padded?: boolean;

  /**
   * Whether to add a border to the top of the footer
   * @default false
   */
  bordered?: boolean;

  /**
   * Footer alignment
   * @default "left"
   */
  align?: "left" | "center" | "right" | "between";
}

/**
 * Card Title Props
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Title size
   * @default "default"
   */
  size?: "sm" | "default" | "lg" | "xl";

  /**
   * HTML heading level (h1-h6)
   * @default 'h3'
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * Card Description Props
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * Description size
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
}

/**
 * Card Content Props
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to add padding to the content
   * @default true
   */
  padded?: boolean;
}

/**
 * Card Media Props
 */
export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Media position
   * @default "top"
   */
  position?: "top" | "bottom";

  /**
   * Media aspect ratio
   * @default "16:9"
   */
  aspectRatio?: "1:1" | "16:9" | "4:3" | "3:2" | "2:1";
}

/**
 * Card Actions Props
 */
export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to add padding to the actions
   * @default true
   */
  padded?: boolean;

  /**
   * Actions alignment
   * @default "left"
   */
  align?: "left" | "center" | "right" | "between";
}

/**
 * Metric Card Props
 */
export interface MetricCardProps extends CardBaseProps {
  /**
   * Card title
   */
  title: string;

  /**
   * Main metric value
   */
  value: string | number;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Icon to display
   */
  icon?: React.ReactNode;

  /**
   * Trend data
   */
  trend?: {
    value: string | number;
    direction?: "up" | "down" | "neutral";
    label?: string;
  };

  /**
   * Footer content
   */
  footer?: React.ReactNode;

  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * Action Card Props
 */
export interface ActionCardProps extends CardBaseProps {
  /**
   * Card title
   */
  title: string;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Icon to display
   */
  icon?: React.ReactNode;

  /**
   * Status indicator
   */
  status?: "success" | "warning" | "error" | "info" | "muted";

  /**
   * Action button label
   */
  actionLabel?: string;

  /**
   * Action button click handler
   */
  onAction?: () => void;

  /**
   * Action href (alternative to onAction)
   */
  actionHref?: string;
}

/**
 * Stats Card Props
 */
export interface StatsCardProps extends CardBaseProps {
  /**
   * Card title
   */
  title: string;

  /**
   * Main statistic value
   */
  value: string | number;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Icon to display
   */
  icon?: React.ReactNode;

  /**
   * Change data
   */
  change?: {
    value: string | number;
    direction?: "up" | "down" | "neutral";
  };

  /**
   * Footer content
   */
  footer?: React.ReactNode;
}

/**
 * Summary Card Props
 */
export interface SummaryCardProps extends CardBaseProps {
  /**
   * Card title
   */
  title: string;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Array of metrics to display
   */
  metrics?: Array<{
    label: string;
    value: string | number;
    color?: "default" | "muted" | "success" | "warning" | "danger";
  }>;

  /**
   * Action configuration
   */
  action?: {
    label: string;
    onClick: () => void;
    href?: string;
  };

  /**
   * Footer content
   */
  footer?: React.ReactNode;
}

/**
 * Info Card Props
 */
export interface InfoCardProps extends CardBaseProps {
  /**
   * Card title
   */
  title: string;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Icon to display
   */
  icon?: React.ReactNode;

  /**
   * Info type for theming
   */
  type?: "default" | "info" | "success" | "warning" | "error";

  /**
   * Actions for the card
   */
  actions?: React.ReactNode;
} 