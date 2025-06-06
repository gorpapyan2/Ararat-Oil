import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Label } from "@/core/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { Switch } from "@/core/components/ui/switch";
import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";
import { Palette, Monitor } from 'lucide-react';
import { useTheme } from "@/hooks";
import { useToast } from "@/hooks";
import { Palette as LucidePalette, Sun, Moon, Globe, Type, Layout } from "lucide-react";

interface ThemePreferences {
  mode: "light" | "dark" | "system";
  colorScheme: string;
  fontSize: string;
  density: string;
  animations: boolean;
  language: string;
}

export function ThemeSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = React.useState(false);

  const [preferences, setPreferences] = React.useState<ThemePreferences>({
    mode: (theme as "light" | "dark" | "system") || "system",
    colorScheme: "default",
    fontSize: "medium",
    density: "comfortable",
    animations: true,
    language: "en",
  });

  const handlePreferenceChange = <T extends keyof ThemePreferences>(
    key: T,
    value: ThemePreferences[T]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Apply theme changes immediately
    if (key === "mode") {
      setTheme(value as "light" | "dark" | "system");
    }
  };

  const savePreferences = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: t("settings.themeUpdated", "Theme settings updated"),
        description: t("settings.themeUpdatedDescription", "Your theme preferences have been saved."),
      });
    } catch (error) {
      toast({
        title: t("common.error", "Error"),
        description: t("settings.themeUpdateError", "Failed to update theme settings."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const themeOptions = [
    {
      value: "light",
      label: t("theme.light", "Light"),
      icon: <Sun className="h-4 w-4" />,
      description: t("theme.lightDescription", "Light theme for day use"),
    },
    {
      value: "dark",
      label: t("theme.dark", "Dark"),
      icon: <Moon className="h-4 w-4" />,
      description: t("theme.darkDescription", "Dark theme for night use"),
    },
    {
      value: "system",
      label: t("theme.system", "System"),
      icon: <Monitor className="h-4 w-4" />,
      description: t("theme.systemDescription", "Use system preference"),
    },
  ];

  const colorSchemes = [
    { value: "default", label: "Ararat Oil Blue" },
    { value: "green", label: "Forest Green" },
    { value: "orange", label: "Energy Orange" },
    { value: "purple", label: "Deep Purple" },
    { value: "red", label: "Alert Red" },
  ];

  const fontSizes = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium (Recommended)" },
    { value: "large", label: "Large" },
    { value: "x-large", label: "Extra Large" },
  ];

  const densityOptions = [
    { value: "compact", label: "Compact" },
    { value: "comfortable", label: "Comfortable (Recommended)" },
    { value: "spacious", label: "Spacious" },
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "pt", label: "Português" },
    { value: "ar", label: "العربية" },
  ];

  return (
    <div className="space-y-6">
      {/* Theme Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t("settings.appearance", "Appearance")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">
              {t("settings.themeMode", "Theme Mode")}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              {themeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`
                    cursor-pointer rounded-lg border p-4 hover:bg-accent/50 transition-colors
                    ${preferences.mode === option.value ? "border-primary bg-accent" : "border-border"}
                  `}
                  onClick={() => handlePreferenceChange("mode", option.value as any)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {option.icon}
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {t("settings.colorScheme", "Color Scheme")}
              </Label>
              <Select
                value={preferences.colorScheme}
                onValueChange={(value) => handlePreferenceChange("colorScheme", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorSchemes.map((scheme) => (
                    <SelectItem key={scheme.value} value={scheme.value}>
                      {scheme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  {t("settings.animations", "Enable Animations")}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t("settings.animationsDescription", "Use smooth transitions and animations")}
                </p>
              </div>
              <Switch
                checked={preferences.animations}
                onCheckedChange={(checked) => handlePreferenceChange("animations", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography & Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            {t("settings.typography", "Typography & Layout")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                <Type className="h-4 w-4 inline mr-2" />
                {t("settings.fontSize", "Font Size")}
              </Label>
              <Select
                value={preferences.fontSize}
                onValueChange={(value) => handlePreferenceChange("fontSize", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                <Layout className="h-4 w-4 inline mr-2" />
                {t("settings.density", "Content Density")}
              </Label>
              <Select
                value={preferences.density}
                onValueChange={(value) => handlePreferenceChange("density", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {densityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t("settings.localization", "Localization")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t("settings.language", "Language")}
            </Label>
            <Select
              value={preferences.language}
              onValueChange={(value) => handlePreferenceChange("language", value)}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {t("settings.languageNote", "Language changes will take effect after page refresh")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={isLoading}>
          {isLoading 
            ? t("common.saving", "Saving...") 
            : t("common.save", "Save Theme Settings")
          }
        </Button>
      </div>
    </div>
  );
} 