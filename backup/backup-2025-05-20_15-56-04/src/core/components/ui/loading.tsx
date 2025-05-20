import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/shared/utils';

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Variant of the loading component
   * - 'default': Simple spinner only
   * - 'fullscreen': Centered on the screen with optional text
   * - 'inline': Inline with other content
   * - 'page': Full page height with text centered
   */
  variant?: 'default' | 'fullscreen' | 'inline' | 'page';
  
  /**
   * Optional text to display with the loading spinner
   */
  text?: string;
  
  /**
   * Size of the spinner in pixels
   * @default 24
   */
  size?: number;
}

/**
 * Loading component for showing loading states
 */
export function Loading({ 
  className, 
  variant = 'default',
  text,
  size = 24,
  ...props 
}: LoadingProps) {
  // Classes based on variant
  const containerClasses = {
    default: 'flex items-center justify-center p-4',
    fullscreen: 'fixed inset-0 flex items-center justify-center bg-background/80 z-50',
    inline: 'inline-flex items-center justify-center',
    page: 'flex flex-col items-center justify-center min-h-[60vh]',
  };

  return (
    <div 
      className={cn(containerClasses[variant], className)}
      role="status"
      aria-label={text || 'Loading'}
      {...props}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader2 
          className="animate-spin" 
          size={size}
        />
        {text && (
          <p className="text-sm text-muted-foreground">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
