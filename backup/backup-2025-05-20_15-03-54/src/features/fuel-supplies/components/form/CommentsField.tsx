import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/core/components/ui/form';
import { Textarea } from '@/core/components/ui/textarea';
import { Control } from "react-hook-form";

interface CommentsFieldProps {
  control: Control<any>;
}

export function CommentsField({ control }: CommentsFieldProps) {
  return (
    <FormField
      control={control}
      name="comments"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-medium">Comments</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder="Optional comments about the fuel supply"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
