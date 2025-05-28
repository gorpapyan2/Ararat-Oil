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
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/core/components/ui/primitives/radio-group";
import { Label } from "@/core/components/ui/label";
import { Separator } from "@/core/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/primitives/select";

// Icons
import { SunMedium, Moon, Laptop, Layout, Type, PanelLeft } from "lucide-react";

// Theme options
const themeOptions = [
  { id: "light", label: "Light", icon: <SunMedium className="h-4 w-4" /> },
  { id: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
  { id: "system", label: "System", icon: <Laptop className="h-4 w-4" /> },
];

// Layout options
const layoutOptions = [
  { id: "default", label: "Default" },
  { id: "compact", label: "Compact" },
  { id: "comfortable", label: "Comfortable" },
];

// Font size options
const fontSizeOptions = [
  { id: "sm", label: "Small" },
  { id: "md", label: "Medium" },
  { id: "lg", label: "Large" },
  { id: "xl", label: "Extra Large" },
];

// Sidebar position options
const sidebarPositionOptions = [
  { id: "left", label: "Left" },
  { id: "right", label: "Right" },
];

function AppearanceSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Log render count in development
  useRenderCount("AppearanceSettings");

  // State for appearance preferences
  const [theme, setTheme] = useState("system");
  const [layout, setLayout] = useState("default");
  const [fontSize, setFontSize] = useState("md");
  const [sidebarPosition, setSidebarPosition] = useState("left");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Handle form submission
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to backend and update theme context
    toast({
      title: "Appearance updated",
      description: "Your appearance settings have been updated successfully.",
    });
  };

  return (
    <form onSubmit={handleSave}>
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.appearance.title")}</CardTitle>
          <CardDescription>
            {t("settings.appearance.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <SunMedium className="h-4 w-4 text-muted-foreground" />
                {t("settings.appearance.theme")}
              </h3>
            </div>

            <RadioGroup
              value={theme}
              onValueChange={setTheme}
              className="grid grid-cols-3 gap-4"
            >
              {themeOptions.map((option) => (
                <div key={option.id}>
                  <RadioGroupItem
                    value={option.id}
                    id={`theme-${option.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`theme-${option.id}`}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    {option.icon}
                    <span className="mt-2">
                      {t(`settings.appearance.themes.${option.id}`)}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Layout and Typography */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Layout className="h-4 w-4 text-muted-foreground" />
              {t("settings.appearance.layoutAndTypography")}
            </h3>

            <div className="grid gap-4 py-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="layout" className="flex items-center gap-2">
                  <Layout className="h-4 w-4 text-muted-foreground" />
                  {t("settings.appearance.layout")}
                </Label>
                <Select value={layout} onValueChange={setLayout}>
                  <SelectTrigger id="layout">
                    <SelectValue
                      placeholder={t("settings.appearance.selectLayout")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {layoutOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {t(`settings.appearance.layouts.${option.id}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontSize" className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-muted-foreground" />
                  {t("settings.appearance.fontSize")}
                </Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger id="fontSize">
                    <SelectValue
                      placeholder={t("settings.appearance.selectFontSize")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizeOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {t(`settings.appearance.fontSizes.${option.id}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sidebarPosition"
                  className="flex items-center gap-2"
                >
                  <PanelLeft className="h-4 w-4 text-muted-foreground" />
                  {t("settings.appearance.sidebarPosition")}
                </Label>
                <Select
                  value={sidebarPosition}
                  onValueChange={setSidebarPosition}
                >
                  <SelectTrigger id="sidebarPosition">
                    <SelectValue
                      placeholder={t(
                        "settings.appearance.selectSidebarPosition"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {sidebarPositionOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {t(`settings.appearance.positions.${option.id}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex items-center">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="animations"
                    checked={animationsEnabled}
                    onChange={(e) => setAnimationsEnabled(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="animations" className="font-normal">
                    {t("settings.appearance.enableAnimations")}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Preview Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">
              {t("settings.appearance.preview")}
            </h3>
            <div className="rounded-md border-2 border-dashed border-muted p-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t("settings.appearance.previewDescription")}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">{t("common.saveChanges")}</Button>
        </CardFooter>
      </Card>
    </form>
  );
}

// Export a memoized version for better performance
export default memo(AppearanceSettings);
