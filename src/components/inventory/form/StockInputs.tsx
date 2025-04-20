
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";

interface StockInputsProps {
  control: Control<any>;
}

export function StockInputs({ control }: StockInputsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="opening_stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Opening Stock</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                className="h-12 text-base"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="closing_stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Closing Stock</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                className="h-12 text-base"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
