
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
  // Compute explanatory string
  const quantityHint = useMemo(() => {
    if (!selectedTank || typeof maxQuantity !== "number") return "";
    return `Tank "${selectedTank.name}": Current = ${selectedTank.current_level}L / Capacity = ${selectedTank.capacity}L. Max allowed: ${maxQuantity}L.`;
  }, [selectedTank, maxQuantity]);

  return (
    <div className="grid grid-cols-3 gap-4 items-end">
      <FormField control={control} name="quantity_liters" rules={{
        required: "Quantity is required",
        min: {
          value: 0,
          message: "Quantity must be positive"
        },
        ...(typeof maxQuantity === "number"
          ? {
              max: {
                value: maxQuantity,
                message: `Cannot add more than available tank space (${maxQuantity}L)`
              }
            } : {}
        )
      }} render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-medium">
            Quantity (Liters)
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              min="0"
              {...(typeof maxQuantity === "number" ? { max: maxQuantity } : {})}
              {...field}
              onChange={e => {
                // Clamp the value if it exceeds max
                let val = e.target.valueAsNumber || undefined;
                if (typeof maxQuantity === "number" && typeof val === "number" && val > maxQuantity) {
                  val = maxQuantity;
                }
                field.onChange(val);
              }}
            />
          </FormControl>
          {quantityHint && (
            <div className="text-xs text-muted-foreground mt-1">{quantityHint}</div>
          )}
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={control} name="price_per_liter" rules={{
        required: "Price is required",
        min: {
          value: 0,
          message: "Price must be positive"
        }
      }} render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-medium">
            Price per Liter
          </FormLabel>
          <FormControl>
            <Input type="number" min="0" {...field} onChange={e => {
              field.onChange(e.target.valueAsNumber || undefined);
            }} />
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
              value={totalCost}
              className="cursor-not-allowed bg-gray-500"
            />
          </FormControl>
        </FormItem>
      )} />
    </div>
  );
}
