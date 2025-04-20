
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";

interface StockInputsProps {
  control: Control<any>;
  onStockChange: () => void;
}

export function StockInputs({ control, onStockChange }: StockInputsProps) {
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
                onChange={(e) => {
                  field.onChange(e);
                  setTimeout(onStockChange, 0);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="received"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Received</FormLabel>
            <FormControl>
              <Input 
                type="number"
                className="h-12 text-base"
                {...field} 
                onChange={(e) => {
                  field.onChange(e);
                  setTimeout(onStockChange, 0);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="sold"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Sold</FormLabel>
            <FormControl>
              <Input 
                type="number"
                className="h-12 text-base"
                {...field} 
                onChange={(e) => {
                  field.onChange(e);
                  setTimeout(onStockChange, 0);
                }}
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
                className="h-12 text-base bg-muted"
                {...field} 
                readOnly
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
