import React from "react";
import { cn } from "@/shared/utils";

/**
 * Props for CardGrid component
 */
export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns at different breakpoints
   * Default is 1 column on mobile, 2 on tablet, 3 on desktop
   */
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };

  /**
   * Gap between grid items (uses Tailwind gap classes)
   * @default "gap-4"
   */
  gap?: string;

  /**
   * Auto-fit cards to available space instead of using fixed column count
   */
  autoFit?: boolean;

  /**
   * Min width for auto-fit cards (only used when autoFit is true)
   * @default "250px"
   */
  minWidth?: string;
}

/**
 * CardGrid component for arranging cards in a responsive grid layout
 */
export const CardGrid = React.forwardRef<HTMLDivElement, CardGridProps>(
  (
    {
      children,
      className,
      columns = { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
      gap = "gap-4",
      autoFit = false,
      minWidth = "250px",
      ...props
    },
    ref
  ) => {
    // Determine grid template columns based on props
    const gridCols = autoFit
      ? `grid-cols-[repeat(auto-fit,minmax(${minWidth},1fr))]`
      : cn(
          columns.xs && `grid-cols-${columns.xs}`,
          columns.sm && `sm:grid-cols-${columns.sm}`,
          columns.md && `md:grid-cols-${columns.md}`,
          columns.lg && `lg:grid-cols-${columns.lg}`,
          columns.xl && `xl:grid-cols-${columns.xl}`
        );

    return (
      <div
        ref={ref}
        className={cn("grid w-full", gridCols, gap, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardGrid.displayName = "CardGrid";

/**
 * Props for CardGroup component
 */
export interface CardGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Gap between cards
   * @default "gap-4"
   */
  gap?: string;

  /**
   * Direction of the card layout
   * @default "vertical"
   */
  direction?: "horizontal" | "vertical";

  /**
   * If true, cards will be joined together visually
   * @default false
   */
  joined?: boolean;
}

/**
 * CardGroup component for displaying related cards with consistent styling
 */
export const CardGroup = React.forwardRef<HTMLDivElement, CardGroupProps>(
  (
    {
      children,
      className,
      gap = "gap-4",
      direction = "vertical",
      joined = false,
      ...props
    },
    ref
  ) => {
    const containerClasses = cn(
      direction === "horizontal" ? "flex flex-row" : "flex flex-col",
      !joined && gap,
      joined && "overflow-hidden rounded-lg",
      className
    );

    // Add special styling to children if they're joined
    const childrenWithProps = joined
      ? React.Children.map(children, (child, index) => {
          // Skip non-element children
          if (!React.isValidElement(child)) return child;

          // Create joined styles based on position
          const joinedStyles = cn(
            "rounded-none border",
            index !== 0 &&
              (direction === "horizontal" ? "border-l-0" : "border-t-0"),
            // Add rounded corners to first and last elements
            index === 0 &&
              (direction === "horizontal" ? "rounded-l-lg" : "rounded-t-lg"),
            index === React.Children.count(children) - 1 &&
              (direction === "horizontal" ? "rounded-r-lg" : "rounded-b-lg")
          );

          // Type-safe clone with proper typing for className and variant props
          return React.cloneElement(child, {
            className: cn(child.props.className, joinedStyles),
            variant: "outline",
          } as React.HTMLAttributes<HTMLElement> & { variant: string });
        })
      : children;

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {childrenWithProps}
      </div>
    );
  }
);

CardGroup.displayName = "CardGroup";
