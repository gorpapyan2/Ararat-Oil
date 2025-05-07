// Replace the variant "ghost" with "outline" which is a valid variant
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { SessionLogoutDialogStandardized } from '../settings/SessionLogoutDialogStandardized';
import { useState } from 'react';

export function SidebarFooter() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };
  
  return (
    <div className="sidebar-footer">
      {/* Fix the Button variant from "ghost" to "outline" */}
      <Button 
        variant="outline" // Changed from "ghost" to "outline"
        className="w-full justify-start font-normal"
        onClick={handleLogout}
        disabled={!session}
      >
        <LogOut className="h-4 w-4 mr-2" />
        {t('settings.logout')}
      </Button>
      
      <SessionLogoutDialogStandardized
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        onConfirm={() => {}}
        isLoading={false}
        confirmText={t('settings.confirmLogout')}
        cancelText={t('common.cancel')}
        title={t('settings.logout')}
        description={t('settings.logoutConfirmation')}
        confirmButtonProps={{
          className: 'bg-red-500 hover:bg-red-700 text-white',
        }}
      />
    </div>
  );
}
