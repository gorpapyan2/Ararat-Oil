import React, { useState } from 'react';
import { Settings, LogOut, Sun, Moon, Monitor, User } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useTheme } from '@/core/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { SessionLogoutDialogStandardized } from '@/features/auth/components/SessionLogoutDialogStandardized';
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

interface SettingsDropdownProps {
  className?: string;
}

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  className
}) => {
  const { logout, user, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    logout();
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return t('settings.light', 'Light');
      case 'dark':
        return t('settings.dark', 'Dark');
      case 'system':
        return t('settings.system', 'System');
      default:
        return t('settings.light', 'Light');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-9 w-9 rounded-md',
              'hover:bg-slate-100 dark:hover:bg-slate-800',
              'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              'transition-colors duration-200',
              className
            )}
            aria-label={t('settings.settings', 'Settings')}
          >
            <Settings className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.email || t('common.user', 'User')}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {t('settings.userSettings', 'User Settings')}
              </p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          {/* Theme Options */}
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('settings.theme', 'Theme')}
          </DropdownMenuLabel>
          
          <DropdownMenuItem
            onClick={() => setTheme('light')}
            className={cn(
              'flex items-center gap-2 cursor-pointer',
              theme === 'light' && 'bg-accent/50 text-accent-foreground'
            )}
          >
            <Sun className="h-4 w-4" />
            <span>{t('settings.light', 'Light')}</span>
            {theme === 'light' && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => setTheme('dark')}
            className={cn(
              'flex items-center gap-2 cursor-pointer',
              theme === 'dark' && 'bg-accent/50 text-accent-foreground'
            )}
          >
            <Moon className="h-4 w-4" />
            <span>{t('settings.dark', 'Dark')}</span>
            {theme === 'dark' && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => setTheme('system')}
            className={cn(
              'flex items-center gap-2 cursor-pointer',
              theme === 'system' && 'bg-accent/50 text-accent-foreground'
            )}
          >
            <Monitor className="h-4 w-4" />
            <span>{t('settings.system', 'System')}</span>
            {theme === 'system' && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Account Actions */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50"
          >
            <LogOut className="h-4 w-4" />
            <span>{t('settings.logout', 'Sign Out')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
      <SessionLogoutDialogStandardized
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        onConfirm={handleConfirmLogout}
        isLoading={isLoading}
        confirmText={t('settings.confirmLogout', 'Sign Out')}
        cancelText={t('common.cancel', 'Cancel')}
        title={t('settings.logout', 'Sign Out')}
        description={t('settings.logoutConfirmation', 'Are you sure you want to sign out?')}
        confirmButtonProps={{
          className: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
        }}
      />
    </>
  );
}; 