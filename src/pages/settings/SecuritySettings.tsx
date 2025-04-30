import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useRenderCount } from "@/utils/performance";

// UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui-custom/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Icons
import {
  Lock,
  Shield,
  KeyRound,
  Smartphone,
  Mail,
  AlertTriangle,
  Clock,
  History,
  LogOut,
  ExternalLink,
} from "lucide-react";

// Hooks and utilities
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Password schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Current password is required",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }).regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  }).regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  }).regex(/[0-9]/, {
    message: "Password must contain at least one number",
  }).regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

// Device type for session list
type SessionDevice = {
  id: string;
  deviceName: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  browser: string;
  ip: string;
};

// Mock data for sessions
const mockSessions: SessionDevice[] = [
  {
    id: "session-1",
    deviceName: "Windows PC",
    location: "London, UK",
    lastActive: "Now",
    isCurrent: true,
    browser: "Chrome 122.0.6261.112",
    ip: "192.168.1.1",
  },
  {
    id: "session-2",
    deviceName: "iPhone 14",
    location: "New York, USA",
    lastActive: "2 hours ago",
    isCurrent: false,
    browser: "Safari 17.2",
    ip: "192.168.1.2",
  },
  {
    id: "session-3",
    deviceName: "Macbook Pro",
    location: "Paris, France",
    lastActive: "Yesterday",
    isCurrent: false,
    browser: "Firefox 124.0",
    ip: "192.168.1.3",
  },
];

function SecuritySettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Log render count in development
  useRenderCount("SecuritySettings");
  
  // Security states
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    twoFactorMethod: "app", // "app" | "sms" | "email"
    passwordLessLogin: false,
    rememberDevices: true,
    loginNotifications: true,
    securityAlerts: true,
    inactiveTimeout: "30", // minutes until session timeout
    sessions: mockSessions,
    showRecoveryCodes: false,
  });

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update security setting (boolean)
  const updateSecuritySwitch = (key: keyof typeof security) => (checked: boolean) => {
    setSecurity({
      ...security,
      [key]: checked
    });
    
    // Special case for 2FA toggle
    if (key === "twoFactorEnabled" && checked) {
      // In a real app, this would trigger the 2FA setup flow
      toast({
        title: "Two-factor authentication enabled",
        description: "You'll now need to verify your identity when logging in.",
      });
    }
  };
  
  // Update security setting (string)
  const updateSecuritySelect = (key: keyof typeof security) => (value: string) => {
    setSecurity({
      ...security,
      [key]: value
    });
  };

  // Handle password form submission
  const onPasswordSubmit = (data: z.infer<typeof passwordFormSchema>) => {
    // In a real app, this would call an API to change the password
    console.log("Password change submitted:", data);
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    
    // Reset form
    passwordForm.reset();
  };
  
  // Handle session logout
  const handleSessionLogout = (sessionId: string) => {
    // Filter out the session we want to remove
    const updatedSessions = security.sessions.filter(
      session => session.id !== sessionId
    );
    
    setSecurity({
      ...security,
      sessions: updatedSessions
    });
    
    toast({
      title: "Device logged out",
      description: "The device has been logged out successfully.",
    });
  };
  
  // Handle logout all sessions
  const handleLogoutAllSessions = () => {
    // Keep only the current session
    const updatedSessions = security.sessions.filter(
      session => session.isCurrent
    );
    
    setSecurity({
      ...security,
      sessions: updatedSessions
    });
    
    toast({
      title: "All devices logged out",
      description: "All other devices have been logged out successfully.",
    });
  };
  
  // Recovery codes (mock data - in a real app these would be generated securely)
  const recoveryCodes = [
    "ABCD-EFGH-IJKL-MNOP",
    "QRST-UVWX-YZ12-3456",
    "7890-ABCD-EFGH-IJKL",
    "MNOP-QRST-UVWX-YZ12",
    "3456-7890-ABCD-EFGH",
    "IJKL-MNOP-QRST-UVWX",
  ];

  return (
    <div className="space-y-8">
      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t("settings.security.password")}
          </CardTitle>
          <CardDescription>
            {t("settings.security.passwordDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form 
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} 
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("settings.security.currentPassword")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("settings.security.newPassword")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {t("settings.security.passwordRequirements")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("settings.security.confirmPassword")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit">
                {t("settings.security.updatePassword")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("settings.security.twoFactorAuth")}
          </CardTitle>
          <CardDescription>
            {t("settings.security.twoFactorDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="twoFactorEnabled" className="flex flex-col space-y-1">
              <span>{t("settings.security.enableTwoFactor")}</span>
              <span className="font-normal text-xs text-muted-foreground">
                {t("settings.security.enableTwoFactorDescription")}
              </span>
            </Label>
            <Switch
              id="twoFactorEnabled"
              checked={security.twoFactorEnabled}
              onCheckedChange={updateSecuritySwitch("twoFactorEnabled")}
            />
          </div>
          
          {security.twoFactorEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="twoFactorMethod">
                  {t("settings.security.twoFactorMethod")}
                </Label>
                <Select 
                  onValueChange={updateSecuritySelect("twoFactorMethod")}
                  value={security.twoFactorMethod}
                >
                  <SelectTrigger id="twoFactorMethod">
                    <SelectValue placeholder={t("settings.security.selectMethod")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="app">
                      <span className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        {t("settings.security.authenticatorApp")}
                      </span>
                    </SelectItem>
                    <SelectItem value="sms">
                      <span className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        {t("settings.security.smsMethod")}
                      </span>
                    </SelectItem>
                    <SelectItem value="email">
                      <span className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {t("settings.security.emailMethod")}
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {security.twoFactorMethod === "app" && (
                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                  <div className="text-sm font-medium">
                    {t("settings.security.setupAuthenticator")}
                  </div>
                  
                  <div className="flex justify-center py-2">
                    {/* This would be an actual QR code in a real app */}
                    <div className="h-48 w-48 border-2 border-dashed rounded-lg flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">
                        {t("settings.security.qrCodePlaceholder")}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {t("settings.security.scanQrCodeInstructions")}
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="verificationCode">
                      {t("settings.security.verificationCode")}
                    </Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="verificationCode"
                        placeholder="123456" 
                        className="max-w-[200px]"
                      />
                      <Button variant="secondary">
                        {t("settings.security.verify")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <Accordion type="single" collapsible>
                <AccordionItem value="recovery-codes">
                  <AccordionTrigger className="text-sm">
                    {t("settings.security.recoveryCodes")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        {t("settings.security.recoveryCodesDescription")}
                      </p>
                      
                      {security.showRecoveryCodes ? (
                        <div className="grid grid-cols-2 gap-2">
                          {recoveryCodes.map((code, index) => (
                            <div key={index} className="bg-muted rounded p-2 text-sm font-mono">
                              {code}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSecurity({...security, showRecoveryCodes: true})}
                        >
                          {t("settings.security.viewRecoveryCodes")}
                        </Button>
                      )}
                      
                      {security.showRecoveryCodes && (
                        <div className="pt-2">
                          <Button variant="outline" size="sm">
                            {t("settings.security.downloadCodes")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Login Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            {t("settings.security.loginSettings")}
          </CardTitle>
          <CardDescription>
            {t("settings.security.loginSettingsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="passwordLessLogin" className="flex flex-col space-y-1">
              <span>{t("settings.security.passwordLessLogin")}</span>
              <span className="font-normal text-xs text-muted-foreground">
                {t("settings.security.passwordLessLoginDescription")}
              </span>
            </Label>
            <Switch
              id="passwordLessLogin"
              checked={security.passwordLessLogin}
              onCheckedChange={updateSecuritySwitch("passwordLessLogin")}
              disabled={!security.twoFactorEnabled}
            />
          </div>
          
          {security.passwordLessLogin && !security.twoFactorEnabled && (
            <div className="rounded-lg bg-orange-50 dark:bg-orange-950/50 p-3 text-sm text-orange-600 dark:text-orange-400 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>{t("settings.security.twoFactorRequiredWarning")}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="rememberDevices" className="flex flex-col space-y-1">
              <span>{t("settings.security.rememberDevices")}</span>
              <span className="font-normal text-xs text-muted-foreground">
                {t("settings.security.rememberDevicesDescription")}
              </span>
            </Label>
            <Switch
              id="rememberDevices"
              checked={security.rememberDevices}
              onCheckedChange={updateSecuritySwitch("rememberDevices")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="inactiveTimeout">
              {t("settings.security.inactiveTimeout")}
            </Label>
            <Select 
              onValueChange={updateSecuritySelect("inactiveTimeout")}
              value={security.inactiveTimeout}
            >
              <SelectTrigger id="inactiveTimeout" className="w-full">
                <SelectValue placeholder={t("settings.security.selectTimeout")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t("settings.security.minutes", { count: 15 })}
                  </span>
                </SelectItem>
                <SelectItem value="30">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t("settings.security.minutes", { count: 30 })}
                  </span>
                </SelectItem>
                <SelectItem value="60">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t("settings.security.hour", { count: 1 })}
                  </span>
                </SelectItem>
                <SelectItem value="120">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t("settings.security.hours", { count: 2 })}
                  </span>
                </SelectItem>
                <SelectItem value="never">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t("settings.security.never")}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t("settings.security.inactiveTimeoutDescription")}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t("settings.security.notificationAlerts")}
          </CardTitle>
          <CardDescription>
            {t("settings.security.notificationAlertsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="loginNotifications" className="flex flex-col space-y-1">
              <span>{t("settings.security.loginNotifications")}</span>
              <span className="font-normal text-xs text-muted-foreground">
                {t("settings.security.loginNotificationsDescription")}
              </span>
            </Label>
            <Switch
              id="loginNotifications"
              checked={security.loginNotifications}
              onCheckedChange={updateSecuritySwitch("loginNotifications")}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="securityAlerts" className="flex flex-col space-y-1">
              <span>{t("settings.security.securityAlerts")}</span>
              <span className="font-normal text-xs text-muted-foreground">
                {t("settings.security.securityAlertsDescription")}
              </span>
            </Label>
            <Switch
              id="securityAlerts"
              checked={security.securityAlerts}
              onCheckedChange={updateSecuritySwitch("securityAlerts")}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {t("settings.security.activeSessions")}
          </CardTitle>
          <CardDescription>
            {t("settings.security.activeSessionsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {security.sessions.map(session => (
              <div 
                key={session.id} 
                className={`p-4 rounded-lg border ${
                  session.isCurrent ? "bg-muted/60" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      {session.deviceName}
                      {session.isCurrent && (
                        <span className="bg-green-500/20 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded">
                          {t("settings.security.currentDevice")}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>{session.browser}</span>
                      <span>•</span>
                      <span>{session.location}</span>
                    </div>
                  </div>
                  
                  {!session.isCurrent && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <LogOut className="h-4 w-4 mr-1" />
                          {t("settings.security.logout")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t("settings.security.confirmLogout")}</DialogTitle>
                          <DialogDescription>
                            {t("settings.security.confirmLogoutDescription")}
                          </DialogDescription>
                        </DialogHeader>
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
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            {t("common.cancel")}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleSessionLogout(session.id)}
                          >
                            {t("settings.security.logout")}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                
                <div className="text-xs flex items-center gap-1">
                  <span className="font-medium">
                    {t("settings.security.lastActive")}:
                  </span>
                  <span>{session.lastActive}</span>
                </div>
              </div>
            ))}
          </div>
          
          {security.sessions.length > 1 && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleLogoutAllSessions}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("settings.security.logoutAllOtherDevices")}
            </Button>
          )}
        </CardContent>
      </Card>
      
      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("settings.security.securityTips")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400" />
              <span>{t("settings.security.tip1")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400" />
              <span>{t("settings.security.tip2")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400" />
              <span>{t("settings.security.tip3")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400" />
              <span>{t("settings.security.tip4")}</span>
            </li>
          </ul>
          
          <div className="mt-4">
            <Button 
              variant="link" 
              className="p-0 h-auto flex items-center gap-1 text-sm"
            >
              {t("settings.security.learnMore")}
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Export a memoized version for better performance
export default memo(SecuritySettings); 