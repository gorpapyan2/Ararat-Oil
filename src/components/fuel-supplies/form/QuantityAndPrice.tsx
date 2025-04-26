import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, useWatch } from "react-hook-form";
import { useMemo } from "react";
import { CurrencyField } from "@/components/form-fields/CurrencyField";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useTranslation } from "react-i18next";

interface QuantityAndPriceProps {
  control: Control<any>;
  totalCost: number;
  maxQuantity?: number;
  selectedTank?: { name: string; current_level: number; capacity: number; };
}

export function QuantityAndPrice({
  control,
  totalCost,
  maxQuantity,
  selectedTank,
}: QuantityAndPriceProps) {
  const { t } = useTranslation();
  
  // Watch for quantity changes
  const quantityValue = useWatch({
    control,
    name: "quantity_liters",
    defaultValue: 0
  });
  
  // Watch for price changes
  const priceValue = useWatch({
    control,
    name: "price_per_liter",
    defaultValue: 0
  });
  
  // Compute explanatory string and visual percentage for tank
  const tankStatus = useMemo(() => {
    if (!selectedTank) {
      return { percentage: 0, str: '', color: '', isFull: false };
    }

    const currentLevel = Number(selectedTank.current_level) || 0;
    const capacity = Number(selectedTank.capacity) || 1; // Avoid division by zero
    const supplyQuantity = Number(quantityValue) || 0;
    const afterSupply = currentLevel + supplyQuantity;
    
    // Calculate percentages
    const currentPercentage = (currentLevel / capacity) * 100;
    const afterPercentage = (afterSupply / capacity) * 100;

    // Check if tank will be over capacity
    const isOverCapacity = afterSupply > capacity;
    const overAmount = isOverCapacity ? afterSupply - capacity : 0;
    const barColor = isOverCapacity 
      ? 'bg-red-500' 
      : afterPercentage > 90 
        ? 'bg-amber-500'
        : 'bg-green-500';
        
    // Explanatory string
    const statusStr = isOverCapacity
      ? `Warning: Over capacity by ${overAmount.toFixed(1)} liters!`
      : `Current: ${currentLevel.toFixed(1)}L → After: ${afterSupply.toFixed(1)}L (${afterPercentage.toFixed(1)}% of capacity)`;
      
    return {
      percentage: afterPercentage,
      str: statusStr,
      color: barColor,
      isFull: isOverCapacity
    };
  }, [selectedTank, quantityValue]);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <FormField control={control} name="quantity_liters" rules={{
          required: "Quantity is required",
          min: {
            value: 0,
            message: "Quantity must be positive"
          }
        }} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Quantity (Liters)
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                step="any" 
                value={field.value || ""}
                onChange={e => {
                  field.onChange(e.target.valueAsNumber || 0);
                }} 
              />
            </FormControl>
            
            {selectedTank && (
              <div className="mt-2">
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${tankStatus.color}`}
                    style={{ width: `${Math.min(tankStatus.percentage, 100)}%` }}
                  ></div>
                </div>
                <div className={`text-xs mt-1 transition-all duration-500 flex items-center ${tankStatus.isFull ? "text-red-500" : "text-muted-foreground"}`}>
                  {tankStatus.str}
                </div>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <CurrencyField
        control={control}
        name="price_per_liter"
        label={t("fuelSupplies.pricePerLiter")}
        placeholder="0"
        required
        min={0}
      />

      <FormField
        control={control}
        name="total_cost"
        render={({ field }) => (
          <FormItem className="cursor-not-allowed bg-gray-500/40 font-semibold">
            <FormLabel className="text-base font-medium">{t("fuelSupplies.totalCost")}</FormLabel>
            <FormControl>
              <CurrencyInput
                value={totalCost}
                onChange={field.onChange}
                disabled={true}
                symbol="֏"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
