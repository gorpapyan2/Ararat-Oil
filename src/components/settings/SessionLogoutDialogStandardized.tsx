import { ConfirmDialog } from "@/components/ui/composed/dialog";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface SessionDevice {
  id: string;
  deviceName: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  browser: string;
  ip: string;
}

interface SessionLogoutDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  session: SessionDevice;
}

export function SessionLogoutDialogStandardized({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  session,
}: SessionLogoutDialogStandardizedProps) {
  const { t } = useTranslation();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("settings.security.confirmLogout")}
      description={t("settings.security.confirmLogoutDescription")}
      onConfirm={onConfirm}
      isLoading={isLoading}
      confirmText={t("settings.security.logout")}
      cancelText={t("common.cancel")}
      confirmButtonProps={{ variant: "destructive" }}
    >
      <div className="space-y-2 py-2">
        <p className="text-sm">
          <strong>{t("settings.security.device")}:</strong> {session.deviceName}
        </p>
        <p className="text-sm">
          <strong>{t("settings.security.browser")}:</strong> {session.browser}
        </p>
        <p className="text-sm">
          <strong>{t("settings.security.location")}:</strong> {session.location}
        </p>
        <p className="text-sm">
          <strong>{t("settings.security.ip")}:</strong> {session.ip}
        </p>
      </div>
    </ConfirmDialog>
  );
} 