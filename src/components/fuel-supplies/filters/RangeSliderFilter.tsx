
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface RangeSliderFilterProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue: (value: number) => string;
}

export function RangeSliderFilter({
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
}: RangeSliderFilterProps) {
  const [localMin, setLocalMin] = useState(value[0].toString());
  const [localMax, setLocalMax] = useState(value[1].toString());

  // Update local values when props change
  useEffect(() => {
    setLocalMin(value[0].toString());
    setLocalMax(value[1].toString());
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    onChange([newValue[0], newValue[1]]);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = e.target.value;
    setLocalMin(newMin);
    
    if (newMin === "") return;
    
    const numericValue = Number(newMin);
    if (!isNaN(numericValue) && numericValue >= min && numericValue <= value[1]) {
      onChange([numericValue, value[1]]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = e.target.value;
    setLocalMax(newMax);
    
    if (newMax === "") return;
    
    const numericValue = Number(newMax);
    if (!isNaN(numericValue) && numericValue >= value[0] && numericValue <= max) {
      onChange([value[0], numericValue]);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-xs">{label}</Label>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value[0], value[1]]}
        onValueChange={handleSliderChange}
        className="mt-6"
      />
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col flex-1">
          <span className="text-xs text-muted-foreground mb-1">Min</span>
          <Input
            type="text"
            value={localMin}
            onChange={handleMinChange}
            onBlur={() => {
              if (localMin === "" || isNaN(Number(localMin))) {
                setLocalMin(value[0].toString());
              }
            }}
            className="h-8"
          />
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-xs text-muted-foreground mb-1">Max</span>
          <Input
            type="text"
            value={localMax}
            onChange={handleMaxChange}
            onBlur={() => {
              if (localMax === "" || isNaN(Number(localMax))) {
                setLocalMax(value[1].toString());
              }
            }}
            className="h-8"
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatValue(value[0])}</span>
        <span>{formatValue(value[1])}</span>
      </div>
    </div>
  );
}
