import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks";
import { useRenderCount } from "@/utils/performance";

// UI components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/core/components/ui/primitives/card";
import { Separator } from '@/core/components/ui/separator';
import { Input } from "@/core/components/ui/primitives/input";
import { Button } from "@/core/components/ui/primitives/button";
import { Label } from '@/core/components/ui/label';

// Icons
import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/ui/avatar';
import { 
  Upload,
  UserRound, 
  Mail, 
  Phone, 
  MapPin,
  Building
} from "lucide-react";

function AccountSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Log render count in development
  useRenderCount("AccountSettings");
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, San Francisco, CA 94105",
    company: "Acme Inc.",
    avatarUrl: "",
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to backend
    toast({
      title: "Account updated",
      description: "Your account information has been updated successfully.",
    });
  };

  return (
    <form onSubmit={handleSave}>
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.account.title")}</CardTitle>
          <CardDescription>
            {t("settings.account.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 sm:items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userData.avatarUrl} alt={userData.name} />
              <AvatarFallback className="text-2xl">
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-sm font-medium mb-2">{t("settings.account.profilePicture")}</h3>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  {t("settings.account.upload")}
                </Button>
                {userData.avatarUrl && (
                  <Button type="button" variant="outline" size="sm" className="text-destructive" 
                    onClick={() => setUserData(prev => ({ ...prev, avatarUrl: "" }))}>
                    {t("common.remove")}
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {t("settings.account.photoRequirements")}
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t("settings.account.personalInfo")}</h3>
            
            <div className="grid gap-4 py-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                  {t("settings.account.fullName")}
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  placeholder={t("settings.account.fullNamePlaceholder")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {t("settings.account.email")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  placeholder={t("settings.account.emailPlaceholder")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {t("settings.account.phone")}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  placeholder={t("settings.account.phonePlaceholder")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  {t("settings.account.company")}
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={userData.company}
                  onChange={handleInputChange}
                  placeholder={t("settings.account.companyPlaceholder")}
                />
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {t("settings.account.address")}
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  placeholder={t("settings.account.addressPlaceholder")}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t("settings.account.dangerZone")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.account.accountDeleteWarning")}
            </p>
            <Button 
              type="button"
              variant="destructive"
              onClick={() => {
                // Show confirmation dialog in a real app
                toast({
                  title: "Account deletion requested",
                  description: "Please check your email for confirmation.",
                  variant: "destructive",
                });
              }}
            >
              {t("settings.account.deleteAccount")}
            </Button>
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
export default memo(AccountSettings); 