import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface RangeSliderFilterProps {
  value: [number, number];
  min: number;
  max: number;
  step?: number;
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  label: string;
  unit?: string;
  className?: string;
}

export function RangeSliderFilter({
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue = (val) => val.toString(),
  label,
  unit,
  className = "",
}: RangeSliderFilterProps) {
  const [localValue, setLocalValue] = React.useState<[number, number]>(value);
  const [minInput, setMinInput] = React.useState<string>(
    value[0] ? value[0].toString() : "",
  );
  const [maxInput, setMaxInput] = React.useState<string>(
    value[1] ? value[1].toString() : "",
  );

  // Update local state when prop value changes
  React.useEffect(() => {
    setLocalValue(value);
    setMinInput(value[0] ? value[0].toString() : "");
    setMaxInput(value[1] ? value[1].toString() : "");
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    const range: [number, number] = [newValue[0], newValue[1]];
    setLocalValue(range);
    setMinInput(range[0].toString());
    setMaxInput(range[1].toString());
    onChange(range);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinInput(e.target.value);
    if (!isNaN(Number(e.target.value))) {
      const newMin = Number(e.target.value);
      if (newMin <= localValue[1]) {
        const newValue: [number, number] = [newMin, localValue[1]];
        setLocalValue(newValue);
        onChange(newValue);
      }
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInput(e.target.value);
    if (!isNaN(Number(e.target.value))) {
      const newMax = Number(e.target.value);
      if (newMax >= localValue[0]) {
        const newValue: [number, number] = [localValue[0], newMax];
        setLocalValue(newValue);
        onChange(newValue);
      }
    }
  };

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">
          {label}
        </label>
        <div className="flex items-center text-xs text-muted-foreground space-x-1">
          <span>Range:</span>
          <span>
            {formatValue(localValue[0])}
            {unit && ` ${unit}`} - {formatValue(localValue[1])}
            {unit && ` ${unit}`}
          </span>
        </div>
      </div>

      <Slider
        defaultValue={[min, max]}
        value={localValue}
        min={min}
        max={max}
        step={step}
        onValueChange={handleSliderChange}
        className="py-2"
      />

      <div className="flex space-x-2">
        <div className="w-full flex items-center space-x-2">
          <Input
            type="number"
            value={minInput}
            onChange={handleMinInputChange}
            className="h-9"
            placeholder={`Min ${unit || ""}`}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            value={maxInput}
            onChange={handleMaxInputChange}
            className="h-9"
            placeholder={`Max ${unit || ""}`}
          />
        </div>
      </div>
    </div>
  );
}
