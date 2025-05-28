import * as React from "react";
import { Input } from "./input";
import { formatInputCurrency, parseCurrencyInput } from "@/shared/utils";

interface CurrencyInputProps
  extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  value?: number;
  onChange?: (value: number) => void;
  symbol?: string;
  className?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value = 0, onChange, symbol = "֏", className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>("");

    // Update the display value when the numeric value changes
    React.useEffect(() => {
      setDisplayValue(formatInputCurrency(value));
    }, [value]);

    // Handle changes to the input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Remove any non-numeric characters for processing
      const numericValue = parseCurrencyInput(inputValue);

      // Update the display value
      setDisplayValue(inputValue);

      // Call the onChange handler with the numeric value
      if (onChange) {
        onChange(numericValue);
      }
    };

    // When input loses focus, format the value properly
    const handleBlur = () => {
      setDisplayValue(formatInputCurrency(value));
    };

    return (
      <div className="relative flex h-10 w-full rounded-md border border-input bg-gray-50 ring-offset-background">
        {symbol && (
          <span className="flex items-center px-3 text-muted-foreground">
            {symbol}
          </span>
        )}
        <Input
          type="text"
          ref={ref}
          className="flex-1 border-0 bg-transparent rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          inputMode="numeric"
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
