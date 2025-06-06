import React from 'react';
import { cn } from '@/shared/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu';
import { Button } from '@/core/components/ui/button';
import { 
  Settings, 
  User, 
  HelpCircle, 
  Palette, 
  Shield, 
  Bell,
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/core/hooks/useAuth';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';

interface SettingsDropdownProps {
  className?: string;
}

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  className
}) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'hover:bg-accent hover:text-accent-foreground',
            'transition-all duration-200',
            className
          )}
          aria-label="Settings and options"
        >
          <Settings className="h-4 w-4 text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end"
        className={cn(
          'w-64 bg-card border-border shadow-xl',
          'backdrop-blur-sm'
        )}
      >
        <DropdownMenuLabel className="text-foreground">
          Settings & Options
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem 
          className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <Shield className="mr-2 h-4 w-4" />
          <span>Security</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border" />
        
        {/* Theme Toggle Section */}
        <div className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Palette className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Theme</span>
            </div>
            <ThemeToggle variant="dropdown" size="sm" />
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem 
          className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className={cn(
            "hover:bg-status-critical/10 text-status-critical hover:text-status-critical",
            "cursor-pointer"
          )}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 