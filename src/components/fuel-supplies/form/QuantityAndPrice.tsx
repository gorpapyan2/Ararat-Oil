import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { useMemo } from "react";

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
  // Compute explanatory string and visual percentage for tank
  const tankStatus = useMemo(() => {
    if (!selectedTank || typeof maxQuantity !== "number")
      return { str: "", percentage: 0, isFull: false, color: "bg-muted" };
    const { name, current_level, capacity } = selectedTank;
    const remaining = maxQuantity;
    const percentFull = (Number(current_level) / Number(capacity)) * 100;
    let barColor = "bg-primary";
    if (percentFull > 90) barColor = "bg-red-500";
    else if (percentFull > 70) barColor = "bg-yellow-400";
    else if (percentFull > 40) barColor = "bg-green-400";
    return {
      str: `Tank "${name}": ${current_level}L / ${capacity}L • Free: ${remaining}L`,
      percentage: percentFull,
      isFull: percentFull >= 100,
      color: barColor,
    };
  }, [selectedTank, maxQuantity]);

  return (
    <div className="grid grid-cols-3 gap-6 items-end transition-all duration-200">
      <div className="flex flex-col gap-1">
        <FormField control={control} name="quantity_liters" rules={{
          required: "Quantity is required",
          min: {
            value: 0,
            message: "Quantity must be positive",
          },
          ...(typeof maxQuantity === "number"
            ? {
                max: {
                  value: maxQuantity,
                  message: `Cannot add more than tank's available space (${maxQuantity}L)`,
                },
              }
            : {}),
        }} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium flex items-center gap-2">
              Quantity (Liters)
              {tankStatus.isFull && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded font-semibold animate-pulse">Full</span>
              )}
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="any"
                value={field.value || ""}
                {...(typeof maxQuantity === "number" ? { max: maxQuantity } : {})}
                onChange={e => {
                  // Clamp the value if it exceeds max
                  let val = e.target.valueAsNumber || 0;
                  if (typeof maxQuantity === "number" && val > maxQuantity) {
                    val = maxQuantity;
                  }
                  field.onChange(val);
                }}
                className={tankStatus.isFull ? "border-red-500" : ""}
              />
            </FormControl>
            {/* Visual tank level (progress bar) */}
            {selectedTank && typeof maxQuantity === "number" && (
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

      <FormField control={control} name="price_per_liter" rules={{
        required: "Price is required",
        min: {
          value: 0,
          message: "Price must be positive"
        }
      }} render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-medium flex items-center gap-1">
            Price per Liter
            <span className="text-xs text-muted-foreground">(in $)</span>
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
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={control} name="total_cost" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-medium">Total Cost</FormLabel>
          <FormControl>
            <Input
              type="number"
              readOnly
              value={totalCost || 0}
              className="cursor-not-allowed bg-gray-500/40 font-semibold"
            />
          </FormControl>
        </FormItem>
      )} />
    </div>
  );
}
