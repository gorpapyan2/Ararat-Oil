import * as React from "react";
import { cn } from "@/shared/utils";

/**
 * Interface for PageHeaderPrimitive component props
 */
export interface PageHeaderPrimitiveProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Forward ref to the root div element
   */
  ref?: React.ForwardedRef<HTMLDivElement>;
}

/**
 * Base primitive PageHeader component
 * Handles layout and structure without styling
 */
export const PageHeaderPrimitive = React.forwardRef<
  HTMLDivElement,
  PageHeaderPrimitiveProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(className)} {...props} />;
});
PageHeaderPrimitive.displayName = "PageHeaderPrimitive";

/**
 * Interface for PageHeaderTitlePrimitive component props
 */
export interface PageHeaderTitlePrimitiveProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Forward ref to the heading element
   */
  ref?: React.ForwardedRef<HTMLHeadingElement>;
  /**
   * HTML heading level (h1-h6)
   * @default 'h1'
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * Base primitive PageHeaderTitle component
 */
export const PageHeaderTitlePrimitive = React.forwardRef<
  HTMLHeadingElement,
  PageHeaderTitlePrimitiveProps
>(({ className, as: Comp = 'h1', ...props }, ref) => {
  return <Comp ref={ref} className={cn(className)} {...props} />;
});
PageHeaderTitlePrimitive.displayName = "PageHeaderTitlePrimitive";

/**
 * Interface for PageHeaderDescriptionPrimitive component props
 */
export interface PageHeaderDescriptionPrimitiveProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * Forward ref to the paragraph element
   */
  ref?: React.ForwardedRef<HTMLParagraphElement>;
}

/**
 * Base primitive PageHeaderDescription component
 */
export const PageHeaderDescriptionPrimitive = React.forwardRef<
  HTMLParagraphElement,
  PageHeaderDescriptionPrimitiveProps
>(({ className, ...props }, ref) => {
  return <p ref={ref} className={cn(className)} {...props} />;
});
PageHeaderDescriptionPrimitive.displayName = "PageHeaderDescriptionPrimitive";

/**
 * Interface for PageHeaderActionsPrimitive component props
 */
export interface PageHeaderActionsPrimitiveProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Forward ref to the actions div element
   */
  ref?: React.ForwardedRef<HTMLDivElement>;
}

/**
 * Base primitive PageHeaderActions component for buttons and actions
 */
export const PageHeaderActionsPrimitive = React.forwardRef<
  HTMLDivElement,
  PageHeaderActionsPrimitiveProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(className)} {...props} />;
});
PageHeaderActionsPrimitive.displayName = "PageHeaderActionsPrimitive";

/**
 * Interface for PageHeaderBreadcrumbsPrimitive component props
 */
export interface PageHeaderBreadcrumbsPrimitiveProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Forward ref to the breadcrumbs div element
   */
  ref?: React.ForwardedRef<HTMLDivElement>;
}

/**
 * Base primitive PageHeaderBreadcrumbs component
 */
export const PageHeaderBreadcrumbsPrimitive = React.forwardRef<
  HTMLDivElement,
  PageHeaderBreadcrumbsPrimitiveProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(className)} {...props} />;
});
PageHeaderBreadcrumbsPrimitive.displayName = "PageHeaderBreadcrumbsPrimitive"; 