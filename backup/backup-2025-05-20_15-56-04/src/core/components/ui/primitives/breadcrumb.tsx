import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/utils";
import { ChevronRight, Home } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/core/components/ui/tooltip';
import { motion, AnimatePresence } from "framer-motion";

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: {
    name: string;
    href: string;
    isCurrent?: boolean;
    icon?: React.ReactNode;
  }[];
  separator?: React.ReactNode;
  maxItems?: number;
}

export function Breadcrumb({ 
  segments, 
  className, 
  separator,
  maxItems = 3,
  ...props 
}: BreadcrumbProps) {
  // Show only the first and last few segments on small screens to prevent overflow
  const visibleSegments = segments.length > maxItems
    ? [...segments.slice(0, 1), ...segments.slice(-Math.max(1, maxItems - 1))] 
    : segments;
  
  const hasHiddenSegments = segments.length > maxItems;
  const hiddenSegments = hasHiddenSegments ? segments.slice(1, -Math.max(1, maxItems - 1)) : [];
  
  // Animation variants
  const containerVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        when: "beforeChildren"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    initial: {
      opacity: 0,
      x: -5
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      x: 5,
      transition: {
        duration: 0.1
      }
    }
  };

  // Safely render an icon or use a default Home icon
  const renderIcon = (icon: React.ReactNode) => {
    if (!icon) return <Home className="h-4 w-4" />;
    return icon;
  };

  // Custom separator or default chevron
  const Separator = () => (
    <span className="mx-1 flex items-center text-muted-foreground">
      {separator || <ChevronRight className="h-4 w-4" aria-hidden="true" />}
    </span>
  );
  
  return (
    <nav 
      className={cn("flex", className)} 
      aria-label="Breadcrumb" 
      {...props}
    >
      <motion.ol 
        className="inline-flex items-center flex-nowrap overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent hover:scrollbar-thumb-muted/20"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Always render the first segment (usually Home) */}
        {segments.length > 0 && (
          <motion.li 
            key={segments[0].href} 
            className="inline-flex items-center shrink-0"
            variants={itemVariants}
          >
            <Link
              to={segments[0].href}
              className={cn(
                "text-sm font-medium flex items-center transition-colors duration-200",
                "text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-1.5 py-1"
              )}
              aria-label={segments[0].name}
            >
              {renderIcon(segments[0].icon)}
              <span className="sr-only md:not-sr-only md:ml-1.5">{segments[0].name}</span>
            </Link>
          </motion.li>
        )}

        {/* Show ellipsis for hidden segments with tooltip */}
        {hasHiddenSegments && (
          <motion.li 
            className="inline-flex items-center shrink-0"
            variants={itemVariants}
          >
            <Separator />
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <span className="text-sm font-medium text-muted-foreground px-1 cursor-default select-none hover:text-foreground">
                    •••
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="max-w-xs p-2">
                  <div className="flex flex-col space-y-1 text-xs">
                    <p className="text-muted-foreground font-medium pb-1 border-b">Hidden paths</p>
                    {hiddenSegments.map((segment) => (
                      <Link 
                        key={segment.href}
                        to={segment.href} 
                        className="hover:text-foreground text-muted-foreground py-1 px-2 rounded hover:bg-muted/50 transition-colors"
                      >
                        {segment.name}
                      </Link>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.li>
        )}

        {/* Show the visible segments after the first one */}
        <AnimatePresence mode="wait">
          {visibleSegments.slice(hasHiddenSegments ? 0 : 1).map((segment) => (
            <motion.li 
              key={segment.href} 
              className="inline-flex items-center shrink-0"
              variants={itemVariants}
              layout
            >
              <Separator />
              {segment.isCurrent ? (
                <span
                  className={cn(
                    "text-sm font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-none px-1.5 py-1",
                    "text-foreground rounded-md bg-muted/40"
                  )}
                  aria-current="page"
                  title={segment.name}
                >
                  {segment.name}
                </span>
              ) : (
                <Link
                  to={segment.href}
                  className={cn(
                    "text-sm font-medium text-muted-foreground hover:text-foreground truncate max-w-[100px] sm:max-w-[200px] md:max-w-none px-1.5 py-1",
                    "transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "hover:bg-muted/30"
                  )}
                  title={segment.name}
                >
                  {segment.name}
                </Link>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ol>
    </nav>
  );
}
