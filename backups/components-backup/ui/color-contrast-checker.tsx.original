import * as React from "react";
import { checkColorContrast } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Switch } from "./switch";

interface ColorContrastCheckerProps {
  initialForeground?: string;
  initialBackground?: string;
}

/**
 * A component for checking color contrast according to WCAG AA standards
 */
export function ColorContrastChecker({
  initialForeground = "#000000",
  initialBackground = "#ffffff",
}: ColorContrastCheckerProps) {
  const [foreground, setForeground] = React.useState(initialForeground);
  const [background, setBackground] = React.useState(initialBackground);
  const [isLargeText, setIsLargeText] = React.useState(false);

  const { ratio, passesAA } = checkColorContrast(
    foreground,
    background,
    isLargeText,
  );

  const handleForegroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForeground(e.target.value);
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackground(e.target.value);
  };

  const handleSwitchColors = () => {
    const temp = foreground;
    setForeground(background);
    setBackground(temp);
  };

  return (
    <div className="p-4 border rounded-md space-y-4">
      <h2 className="text-lg font-semibold">Color Contrast Checker</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="foreground-color">Text Color</Label>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 border rounded"
              style={{ backgroundColor: foreground }}
              aria-hidden="true"
            />
            <Input
              id="foreground-color"
              type="text"
              value={foreground}
              onChange={handleForegroundChange}
              placeholder="#000000"
              aria-describedby="foreground-hint"
            />
          </div>
          <p id="foreground-hint" className="text-xs text-muted-foreground">
            Enter a hex color code or CSS color value
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="background-color">Background Color</Label>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 border rounded"
              style={{ backgroundColor: background }}
              aria-hidden="true"
            />
            <Input
              id="background-color"
              type="text"
              value={background}
              onChange={handleBackgroundChange}
              placeholder="#ffffff"
              aria-describedby="background-hint"
            />
          </div>
          <p id="background-hint" className="text-xs text-muted-foreground">
            Enter a hex color code or CSS color value
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="large-text" className="cursor-pointer">
          Large Text (18pt+ or 14pt+ bold)
        </Label>
        <Switch
          id="large-text"
          checked={isLargeText}
          onCheckedChange={setIsLargeText}
        />
      </div>

      <Button onClick={handleSwitchColors} variant="outline" className="w-full">
        Switch Colors
      </Button>

      <div
        className="border rounded-md p-8 text-center"
        style={{
          backgroundColor: background,
          color: foreground,
        }}
      >
        <p className={isLargeText ? "text-2xl" : "text-base"}>Sample Text</p>
      </div>

      <div className="bg-muted p-4 rounded-md">
        <div className="flex justify-between items-center">
          <p>Contrast Ratio: {ratio}:1</p>
          <div
            className={`px-3 py-1 rounded-full ${
              passesAA
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
            role="status"
          >
            {passesAA ? "WCAG AA Pass" : "WCAG AA Fail"}
          </div>
        </div>

        <div className="mt-2 text-sm">
          <p>
            Required ratio for {isLargeText ? "large" : "normal"} text:{" "}
            {isLargeText ? "3" : "4.5"}:1
          </p>
        </div>
      </div>
    </div>
  );
}
