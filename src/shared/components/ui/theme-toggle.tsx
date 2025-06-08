/**
 * Theme Toggle Component
 * 
 * Professional theme switcher with natural color integration
 * Supports light, dark, and system preferences
 */

import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Button } from '@/core/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function ThemeToggle({ 
  variant = 'dropdown', 
  size = 'default',
  className 
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Simple button variant (cycles through themes)
  if (variant === 'button') {
    const cycleTheme = () => {
      if (theme === 'light') setTheme('dark');
      else if (theme === 'dark') setTheme('system');
      else setTheme('light');
    };

    const getIcon = () => {
      if (theme === 'system') return <Monitor className="h-4 w-4" />;
      return resolvedTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
    };

    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={cycleTheme}
        className={`hover:bg-core-light dark:hover:bg-muted hover:scale-105 transition-all duration-300 text-core-secondary dark:text-muted-foreground hover:text-core-primary dark:hover:text-card-foreground ${className}`}
        aria-label={`Switch to ${
          theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
        } theme`}
      >
        <div className="relative">
          {getIcon()}
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-natural-accent dark:bg-accent opacity-0 group-hover:opacity-20 rounded-full blur-sm transition-opacity duration-300" />
        </div>
      </Button>
    );
  }

  // Dropdown variant (shows all options)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`hover:bg-core-light dark:hover:bg-muted hover:scale-105 transition-all duration-300 text-core-secondary dark:text-muted-foreground hover:text-core-primary dark:hover:text-card-foreground ${className}`}
          aria-label="Toggle theme"
        >
          <div className="relative">
            {resolvedTheme === 'dark' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            {theme === 'system' && (
              <Monitor className="absolute -bottom-0.5 -right-0.5 h-2 w-2 text-natural-accent dark:text-accent" />
            )}
            
            {/* Rotating animation for theme change */}
            <div className="absolute inset-0 bg-natural-accent dark:bg-accent opacity-0 group-hover:opacity-20 rounded-full blur-sm transition-opacity duration-300" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        className="bg-core-white dark:bg-card border border-core-tertiary dark:border-border shadow-xl backdrop-blur-sm"
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={`flex items-center gap-2 cursor-pointer transition-colors duration-200 text-core-primary dark:text-card-foreground hover:bg-core-light dark:hover:bg-muted ${
            theme === 'light' 
              ? 'bg-natural-accent/20 dark:bg-accent/20 text-core-primary dark:text-accent font-medium' 
              : ''
          }`}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && (
            <div className="ml-auto w-2 h-2 rounded-full bg-natural-accent dark:bg-accent animate-pulse" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-2 cursor-pointer transition-colors duration-200 text-core-primary dark:text-card-foreground hover:bg-core-light dark:hover:bg-muted ${
            theme === 'dark' 
              ? 'bg-natural-accent/20 dark:bg-accent/20 text-core-primary dark:text-accent font-medium' 
              : ''
          }`}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && (
            <div className="ml-auto w-2 h-2 rounded-full bg-natural-accent dark:bg-accent animate-pulse" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={`flex items-center gap-2 cursor-pointer transition-colors duration-200 text-core-primary dark:text-card-foreground hover:bg-core-light dark:hover:bg-muted ${
            theme === 'system' 
              ? 'bg-natural-accent/20 dark:bg-accent/20 text-core-primary dark:text-accent font-medium' 
              : ''
          }`}
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === 'system' && (
            <div className="ml-auto w-2 h-2 rounded-full bg-natural-accent dark:bg-accent animate-pulse" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 