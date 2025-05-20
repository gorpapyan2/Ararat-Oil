import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks";
import { useRenderCount } from "@/utils/performance";

// UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Switch } from '@/core/components/ui/switch';
import { Label } from '@/core/components/ui/label';
import { Separator } from '@/core/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/core/components/ui/radio-group';

// Icons
import {
  Lock,
  Eye,
  Globe,
  Users,
  UserCog,
  Activity,
  Shield,
  FileText,
  Trash2
} from "lucide-react";

function PrivacySettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Log render count in development
  useRenderCount("PrivacySettings");
  
  // Privacy states
  const [privacy, setPrivacy] = useState({
    // Profile visibility
    profileVisibility: "followers",
    
    // Activity settings
    activityVisibility: "followers",
    showOnlineStatus: true,
    shareActivity: true,
    
    // Data collection
    allowUsageData: true,
    allowErrorReporting: true,
    allowPersonalization: true,
    
    // Cookie preferences
    necessaryCookies: true, // Always true, can't be changed
    preferenceCookies: true,
    statisticsCookies: true,
    marketingCookies: false,
    
    // Third party integrations
    allowThirdPartySharing: false,
    allowExternalLogins: true,
  });

  // Update privacy setting (boolean)
  const updatePrivacySwitch = (key: keyof typeof privacy) => (checked: boolean) => {
    setPrivacy({
      ...privacy,
      [key]: checked
    });
  };
  
  // Update privacy setting (string)
  const updatePrivacySelect = (key: keyof typeof privacy) => (value: string) => {
    setPrivacy({
      ...privacy,
      [key]: value
    });
  };

  // Handle form submission
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to backend
    toast({
      title: "Privacy settings updated",
      description: "Your privacy preferences have been updated successfully.",
    });
  };
  
  // Handle account deletion request
  const handleDeleteAccountRequest = () => {
    // This would typically open a modal for confirmation
    // and potentially require password verification
    toast({
      title: "Account deletion requested",
      description: "Please check your email for confirmation steps.",
      variant: "destructive"
    });
  };

  return (
    <form onSubmit={handleSave}>
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.privacy.title")}</CardTitle>
          <CardDescription>
            {t("settings.privacy.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Visibility */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                {t("settings.privacy.profileVisibility")}
              </h3>
            </div>
            
            <RadioGroup
              value={privacy.profileVisibility}
              onValueChange={updatePrivacySelect("profileVisibility")}
              className="space-y-3"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="public" id="profile-public" />
                <Label htmlFor="profile-public" className="flex flex-col">
                  <span className="font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {t("settings.privacy.public")}
                  </span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.publicDescription")}
                  </span>
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="followers" id="profile-followers" />
                <Label htmlFor="profile-followers" className="flex flex-col">
                  <span className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t("settings.privacy.followers")}
                  </span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.followersDescription")}
                  </span>
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="private" id="profile-private" />
                <Label htmlFor="profile-private" className="flex flex-col">
                  <span className="font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {t("settings.privacy.private")}
                  </span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.privateDescription")}
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          {/* Activity Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                {t("settings.privacy.activitySettings")}
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="activity-visibility">
                  {t("settings.privacy.activityVisibility")}
                </Label>
                <Select 
                  onValueChange={updatePrivacySelect("activityVisibility")}
                  value={privacy.activityVisibility}
                >
                  <SelectTrigger id="activity-visibility">
                    <SelectValue placeholder={t("settings.privacy.selectVisibility")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {t("settings.privacy.public")}
                      </span>
                    </SelectItem>
                    <SelectItem value="followers">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {t("settings.privacy.followers")}
                      </span>
                    </SelectItem>
                    <SelectItem value="private">
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        {t("settings.privacy.private")}
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {t("settings.privacy.activityVisibilityDescription")}
                </p>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="showOnlineStatus" className="flex flex-col space-y-1">
                  <span>{t("settings.privacy.showOnlineStatus")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.showOnlineStatusDescription")}
                  </span>
                </Label>
                <Switch
                  id="showOnlineStatus"
                  checked={privacy.showOnlineStatus}
                  onCheckedChange={updatePrivacySwitch("showOnlineStatus")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="shareActivity" className="flex flex-col space-y-1">
                  <span>{t("settings.privacy.shareActivity")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.shareActivityDescription")}
                  </span>
                </Label>
                <Switch
                  id="shareActivity"
                  checked={privacy.shareActivity}
                  onCheckedChange={updatePrivacySwitch("shareActivity")}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Data Collection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                {t("settings.privacy.dataCollection")}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="allowUsageData" className="flex flex-col space-y-1">
                  <span>{t("settings.privacy.allowUsageData")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.allowUsageDataDescription")}
                  </span>
                </Label>
                <Switch
                  id="allowUsageData"
                  checked={privacy.allowUsageData}
                  onCheckedChange={updatePrivacySwitch("allowUsageData")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="allowErrorReporting" className="flex flex-col space-y-1">
                  <span>{t("settings.privacy.allowErrorReporting")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.allowErrorReportingDescription")}
                  </span>
                </Label>
                <Switch
                  id="allowErrorReporting"
                  checked={privacy.allowErrorReporting}
                  onCheckedChange={updatePrivacySwitch("allowErrorReporting")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="allowPersonalization" className="flex flex-col space-y-1">
                  <span>{t("settings.privacy.allowPersonalization")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.allowPersonalizationDescription")}
                  </span>
                </Label>
                <Switch
                  id="allowPersonalization"
                  checked={privacy.allowPersonalization}
                  onCheckedChange={updatePrivacySwitch("allowPersonalization")}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Cookie Preferences */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {t("settings.privacy.cookiePreferences")}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="necessaryCookies" className="flex flex-col space-y-1">
                  <span>{t("settings.privacy.necessaryCookies")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.necessaryCookiesDescription")}
                  </span>
                </Label>
                <Switch
                  id="necessaryCookies"
                  checked={privacy.necessaryCookies}
                  disabled={true}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="preferenceCookies" className="flex flex-col space-y-1">
                  <span>{t("settings.privacy.preferenceCookies")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.preferenceCookiesDescription")}
                  </span>
                </Label>
                <Switch
                  id="preferenceCookies"
                  checked={privacy.preferenceCookies}
                  onCheckedChange={updatePrivacySwitch("preferenceCookies")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="statisticsCookies" className="flex flex-col space-y-1">
                  <span>{t("settings.privacy.statisticsCookies")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.statisticsCookiesDescription")}
                  </span>
                </Label>
                <Switch
                  id="statisticsCookies"
                  checked={privacy.statisticsCookies}
                  onCheckedChange={updatePrivacySwitch("statisticsCookies")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketingCookies" className="flex flex-col space-y-1">
                  <span>{t("settings.privacy.marketingCookies")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.marketingCookiesDescription")}
                  </span>
                </Label>
                <Switch
                  id="marketingCookies"
                  checked={privacy.marketingCookies}
                  onCheckedChange={updatePrivacySwitch("marketingCookies")}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Third Party Integrations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                {t("settings.privacy.thirdPartyIntegrations")}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="allowThirdPartySharing" className="flex flex-col space-y-1">
                  <span>{t("settings.privacy.allowThirdPartySharing")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.allowThirdPartySharingDescription")}
                  </span>
                </Label>
                <Switch
                  id="allowThirdPartySharing"
                  checked={privacy.allowThirdPartySharing}
                  onCheckedChange={updatePrivacySwitch("allowThirdPartySharing")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="allowExternalLogins" className="flex flex-col space-y-1">
                  <span>{t("settings.privacy.allowExternalLogins")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.privacy.allowExternalLoginsDescription")}
                  </span>
                </Label>
                <Switch
                  id="allowExternalLogins"
                  checked={privacy.allowExternalLogins}
                  onCheckedChange={updatePrivacySwitch("allowExternalLogins")}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Account Deletion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2 text-destructive">
                <Trash2 className="h-4 w-4" />
                {t("settings.privacy.accountDeletion")}
              </h3>
            </div>
            
            <div className="bg-destructive/10 dark:bg-destructive/20 rounded-lg p-4 border border-destructive/20">
              <p className="text-sm mb-4">{t("settings.privacy.accountDeletionWarning")}</p>
              <Button
                variant="destructive"
                onClick={handleDeleteAccountRequest}
                type="button"
              >
                {t("settings.privacy.requestAccountDeletion")}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">
            {t("common.saveChanges")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

// Export a memoized version for better performance
export default memo(PrivacySettings); 