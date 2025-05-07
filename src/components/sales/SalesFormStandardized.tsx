import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SalesController } from "./SalesController";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks";
import { useEffect } from "react";
import {
  Sale,
  Employee,
} from "@/types";
import {
  FormCurrencyInput,
  FormSelect,
} from "@/components/ui/composed/form-fields";
import { PriceAndEmployeeInputs } from "./form/PriceAndEmployeeInputs";
import { FillingSystemSelect } from "./form/FillingSystemSelect";

interface SalesFormStandardizedProps {
  sale?: Sale;
  onSubmit: (data: any) => Promise<boolean>;
  employees?: Employee[];
}

const formSchema = z.object({
  quantity: z.number({
    required_error: "Quantity is required.",
  }).min(0.01, "Quantity must be greater than 0"),
  unit_price: z.number({
    required_error: "Unit price is required.",
  }).min(1, "Price must be at least 1"),
  total_sales: z.number().optional(),
  employee_id: z.string({
    required_error: "Please select an employee.",
  }),
  filling_system_id: z.string({
    required_error: "Please select a filling system.",
  }),
  date: z.string().optional(),
  comments: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function SalesFormStandardized({
  sale,
  onSubmit,
  employees,
}: SalesFormStandardizedProps) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
      unit_price: 0,
      total_sales: 0,
      employee_id: "",
      filling_system_id: "",
      date: new Date().toISOString(),
      comments: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = form;

  useEffect(() => {
    if (sale) {
      setValue("quantity", sale.quantity);
      setValue("unit_price", sale.unit_price);
      setValue("total_sales", sale.total_sales);
      setValue("employee_id", sale.employee_id);
      setValue("filling_system_id", sale.filling_system_id);
      setValue("date", sale.date);
      if ('comments' in sale) {
        setValue('comments', sale.comments as string);
      }
    }
  }, [sale, setValue]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(async (data) => {
          const success = await onSubmit({
            ...data,
            total_sales: data.quantity * data.unit_price,
            id: sale?.id,
          });

          if (success) {
            toast({
              title: "Success",
              description: sale ? "Sale updated." : "Sale created.",
            });
          }
        })}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PriceAndEmployeeInputs control={control} employees={employees} />
        </div>

        <FillingSystemSelect control={control} />

        <FormField
          control={control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Comments" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
