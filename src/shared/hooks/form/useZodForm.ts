import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { z } from "zod";

/**
 * Options for the useZodForm hook
 */
export interface UseZodFormOptions<TSchema extends z.ZodSchema> extends Omit<UseFormProps<z.infer<TSchema>>, 'resolver'> {
  /**
   * The Zod schema to validate against
   */
  schema: TSchema;
}

/**
 * A hook that integrates react-hook-form with Zod validation
 * 
 * @param options Configuration options including schema and form options
 * @returns The react-hook-form methods with Zod validation
 */
export function useZodForm<TSchema extends z.ZodSchema>({
  schema,
  ...formOptions
}: UseZodFormOptions<TSchema>): UseFormReturn<z.infer<TSchema>> {
  return useForm<z.infer<TSchema>>({
    ...formOptions,
    resolver: zodResolver(schema),
  });
}
