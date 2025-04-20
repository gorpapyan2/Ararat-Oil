import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
interface QuantityAndPriceProps {
  control: Control<any>;
  totalCost: number;
}
export function QuantityAndPrice({
  control,
  totalCost
}: QuantityAndPriceProps) {
  return <div className="grid grid-cols-3 gap-4 items-end">
      <FormField control={control} name="quantity_liters" rules={{
      required: "Quantity is required",
      min: {
        value: 0,
        message: "Quantity must be positive"
      }
    }} render={({
      field
    }) => <FormItem>
            <FormLabel className="text-base font-medium">
              Quantity (Liters)
            </FormLabel>
            <FormControl>
              <Input type="number" min="0" {...field} onChange={e => {
          field.onChange(e.target.valueAsNumber || undefined);
        }} />
            </FormControl>
            <FormMessage />
          </FormItem>} />

      <FormField control={control} name="price_per_liter" rules={{
      required: "Price is required",
      min: {
        value: 0,
        message: "Price must be positive"
      }
    }} render={({
      field
    }) => <FormItem>
            <FormLabel className="text-base font-medium">
              Price per Liter
            </FormLabel>
            <FormControl>
              <Input type="number" min="0" {...field} onChange={e => {
          field.onChange(e.target.valueAsNumber || undefined);
        }} />
            </FormControl>
            <FormMessage />
          </FormItem>} />

      <FormField control={control} name="total_cost" render={({
      field
    }) => <FormItem>
            <FormLabel className="text-base font-medium">Total Cost</FormLabel>
            <FormControl>
              <Input type="number" readOnly value={totalCost} className="cursor-not-allowed bg-gray-500" />
            </FormControl>
          </FormItem>} />
    </div>;
}