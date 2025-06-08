import React, { useState, useEffect } from 'react';
import { cn } from '@/shared/utils';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Switch } from '@/core/components/ui/switch';

interface ColorContrastCheckerProps {
  primaryColor: string;
  secondaryColor: string;
  contrastRatio: number;
  isAccessible: boolean;
  onChangePrimaryColor: (color: string) => void;
  onChangeSecondaryColor: (color: string) => void;
}

export const ColorContrastChecker: React.FC<ColorContrastCheckerProps> = ({
  primaryColor,
  secondaryColor,
  contrastRatio,
  isAccessible,
  onChangePrimaryColor,
  onChangeSecondaryColor,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="primaryColor">Primary Color</Label>
        <Input
          type="color"
          id="primaryColor"
          value={primaryColor}
          onChange={(e) => onChangePrimaryColor(e.target.value)}
        />
        <Input
          type="text"
          value={primaryColor}
          onChange={(e) => onChangePrimaryColor(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="secondaryColor">Secondary Color</Label>
        <Input
          type="color"
          id="secondaryColor"
          value={secondaryColor}
          onChange={(e) => onChangeSecondaryColor(e.target.value)}
        />
        <Input
          type="text"
          value={secondaryColor}
          onChange={(e) => onChangeSecondaryColor(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <span>Contrast Ratio: {contrastRatio.toFixed(2)}</span>
        <Switch checked={isAccessible} disabled />
      </div>
      <div>
        <p>
          {isAccessible
            ? 'This color combination is accessible.'
            : 'This color combination is not accessible.'}
        </p>
      </div>
    </div>
  );
};
