import React from 'react';
import { z } from 'zod';
import { FormDialog } from '@/shared/components/common/dialog/FormDialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/core/components/ui/primitives/form';
import { Input } from '@/core/components/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/primitives/select';
import { Textarea } from '@/core/components/ui/primitives/textarea';
import { Badge } from '@/core/components/ui/primitives/badge';
import { Tank, PetrolProvider } from '@/core/api/types';
import { Calculator, AlertCircle, Fuel, DollarSign, Calendar, User, Truck, Clock } from 'lucide-react';
import { useShift } from '@/features/shifts/hooks/useShift';

export interface CreateSupplyData {
  provider_id: string;
  tank_id: string;
  quantity_liters: number;
  price_per_liter: number;
  delivery_date: string;
  payment_status: string;
  payment_method?: string;
  comments?: string;
  shift_id?: string;
  total_cost?: number;
}

interface CreateSupplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createSupplyData: CreateSupplyData;
  onCreateSupplyDataChange: (data: CreateSupplyData) => void;
  providers: PetrolProvider[];
  tanks: Tank[];
  onCreateSupply: () => void;
  isCreating: boolean;
}

// Enhanced form validation schema with better constraints
const createSupplySchema = z.object({
  provider_id: z.string().min(1, "Supplier selection is required"),
  tank_id: z.string().min(1, "Tank/fuel type selection is required"),
  quantity_liters: z.number()
    .min(0.1, "Minimum quantity is 0.1 liters")
    .max(50000, "Maximum quantity is 50,000 liters")
    .multipleOf(0.1, "Quantity must be in 0.1 liter increments"),
  price_per_liter: z.number()
    .min(0.001, "Minimum price is 0.001 per liter")
    .max(1000, "Maximum price is 1,000 per liter")
    .multipleOf(0.001, "Price must have maximum 3 decimal places"),
  delivery_date: z.string().min(1, "Delivery date and time is required"),
  payment_status: z.enum(["pending", "paid", "overdue", "cancelled"], {
    required_error: "Payment status is required",
  }),
  payment_method: z.string().optional(),
  comments: z.string().max(500, "Comments must be less than 500 characters").optional(),
  shift_id: z.string().max(50, "Shift ID must be less than 50 characters").optional(),
});

type CreateSupplyFormData = z.infer<typeof createSupplySchema>;

export const CreateSupplyDialog: React.FC<CreateSupplyDialogProps> = ({
  open,
  onOpenChange,
  createSupplyData,
  onCreateSupplyDataChange,
  providers,
  tanks,
  onCreateSupply,
  isCreating,
}) => {
  // Get active shift information
  const { activeShift } = useShift();

  // Better default values - include active shift ID if available
  const defaultValues: CreateSupplyFormData = {
    provider_id: createSupplyData.provider_id || '',
    tank_id: createSupplyData.tank_id || '',
    quantity_liters: createSupplyData.quantity_liters || 1000, // Reasonable default
    price_per_liter: createSupplyData.price_per_liter || 1.5, // Reasonable default
    delivery_date: createSupplyData.delivery_date || new Date().toISOString().slice(0, 16),
    payment_status: (createSupplyData.payment_status || 'pending') as "pending" | "paid" | "overdue" | "cancelled",
    payment_method: createSupplyData.payment_method || 'not_specified',
    comments: createSupplyData.comments || '',
    shift_id: activeShift?.id || createSupplyData.shift_id || '', // Always prioritize active shift
  };

  const handleSubmit = async (data: CreateSupplyFormData): Promise<boolean> => {
    try {
      // Calculate total cost with proper rounding
      const totalCost = Math.round(data.quantity_liters * data.price_per_liter * 100) / 100;
      
      // Update the parent state with form data
      onCreateSupplyDataChange({
        ...data,
        total_cost: totalCost,
      });
      
      // Call the create function
      await onCreateSupply();
      return true;
    } catch (error) {
      console.error('Error creating supply:', error);
      return false;
    }
  };

  // Calculate total cost for preview using default values
  const currentQuantity = defaultValues.quantity_liters;
  const currentPrice = defaultValues.price_per_liter;
  const estimatedTotal = Math.round(currentQuantity * currentPrice * 100) / 100;

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Fuel Supply Entry"
      description="Record a new fuel delivery with complete details and accurate measurements"
      schema={createSupplySchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitText={isCreating ? "Creating..." : "Create Supply Entry"}
      isSubmitting={isCreating}
      size="lg"
      className="sm:max-w-[600px] bg-background border shadow-xl"
      formClassName="space-y-3"
    >
      {({ control }) => {
        return (
          <>
            {/* Enhanced Header with Better Contrast */}
            <div className="bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-primary dark:text-primary">
                  <Calculator className="h-4 w-4" />
                  <span className="font-semibold text-sm">Total: ${estimatedTotal.toLocaleString()}</span>
                </div>
                <span className="text-primary/80 dark:text-primary/90 text-xs font-medium">
                  {currentQuantity.toLocaleString()} L × ${currentPrice.toFixed(3)}/L
                </span>
              </div>
              {activeShift && (
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-xs">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">
                    Recording for active shift: {activeShift.id.slice(-8)}
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    • Started {new Date(activeShift.start_time).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Supplier and Tank Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Supplier */}
              <FormField
                control={control}
                name="provider_id"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-foreground dark:text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Fuel Supplier
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5">Required</Badge>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9 bg-background dark:bg-background border-2 border-border dark:border-border hover:border-blue-500 dark:hover:border-blue-400 focus:border-blue-600 dark:focus:border-blue-500 text-foreground dark:text-foreground">
                          <SelectValue placeholder="Choose supplier..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background dark:bg-background border-2 border-border dark:border-border">
                        {providers.length > 0 ? (
                          providers.map((provider) => (
                            <SelectItem 
                              key={provider.id} 
                              value={provider.id}
                              className="hover:bg-accent dark:hover:bg-accent text-foreground dark:text-foreground focus:bg-accent dark:focus:bg-accent"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                                <span className="font-medium">{provider.name}</span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="loading" disabled className="text-muted-foreground dark:text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Loading suppliers...
                            </div>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              {/* Tank */}
              <FormField
                control={control}
                name="tank_id"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-foreground dark:text-foreground flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Tank & Fuel Type
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5">Required</Badge>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9 bg-background dark:bg-background border-2 border-border dark:border-border hover:border-green-500 dark:hover:border-green-400 focus:border-green-600 dark:focus:border-green-500 text-foreground dark:text-foreground">
                          <SelectValue placeholder="Select tank..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background dark:bg-background border-2 border-border dark:border-border">
                        {tanks.length > 0 ? (
                          tanks.map((tank) => {
                            const fuelTypeName = tank.fuel_type?.name || 'Unknown';
                            const fuelTypeCode = tank.fuel_type?.code ? ` (${tank.fuel_type.code})` : '';
                            return (
                              <SelectItem 
                                key={tank.id} 
                                value={tank.id}
                                className="hover:bg-accent dark:hover:bg-accent text-foreground dark:text-foreground focus:bg-accent dark:focus:bg-accent"
                              >
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                                    <span className="font-medium">{tank.name}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground dark:text-muted-foreground ml-4">
                                    {fuelTypeName}{fuelTypeCode}
                                  </span>
                                </div>
                              </SelectItem>
                            );
                          })
                        ) : (
                          <SelectItem value="loading" disabled className="text-muted-foreground dark:text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Loading tanks...
                            </div>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
            </div>

            {/* Quantity and Price Row */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={control}
                name="quantity_liters"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-foreground dark:text-foreground flex items-center gap-2">
                      <Truck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      Quantity (L)
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5">Required</Badge>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="50000"
                          placeholder="1000"
                          className="h-9 bg-background dark:bg-background border-2 border-border dark:border-border hover:border-orange-500 dark:hover:border-orange-400 focus:border-orange-600 dark:focus:border-orange-500 text-foreground dark:text-foreground pr-10"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-muted-foreground text-sm font-medium">
                          L
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="price_per_liter"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-foreground dark:text-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Price/L
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5">Required</Badge>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.001"
                          min="0.001"
                          max="1000"
                          placeholder="1.500"
                          className="h-9 bg-background dark:bg-background border-2 border-border dark:border-border hover:border-green-500 dark:hover:border-green-400 focus:border-green-600 dark:focus:border-green-500 text-foreground dark:text-foreground pl-7"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-muted-foreground text-sm font-medium">
                          $
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
            </div>

            {/* Date and Payment Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={control}
                name="delivery_date"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-foreground dark:text-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Delivery Date
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5">Required</Badge>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="h-9 bg-background dark:bg-background border-2 border-border dark:border-border hover:border-purple-500 dark:hover:border-purple-400 focus:border-purple-600 dark:focus:border-purple-500 text-foreground dark:text-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="payment_status"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-foreground dark:text-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-red-600 dark:text-red-400" />
                      Payment Status
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5">Required</Badge>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9 bg-background dark:bg-background border-2 border-border dark:border-border hover:border-red-500 dark:hover:border-red-400 focus:border-red-600 dark:focus:border-red-500 text-foreground dark:text-foreground">
                          <SelectValue placeholder="Status..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background dark:bg-background border-2 border-border dark:border-border">
                        <SelectItem value="pending" className="hover:bg-yellow-50 dark:hover:bg-yellow-950/50 text-foreground dark:text-foreground focus:bg-yellow-50 dark:focus:bg-yellow-950/50">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
                            <span className="font-medium">Pending</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="paid" className="hover:bg-green-50 dark:hover:bg-green-950/50 text-foreground dark:text-foreground focus:bg-green-50 dark:focus:bg-green-950/50">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                            <span className="font-medium">Paid</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="overdue" className="hover:bg-red-50 dark:hover:bg-red-950/50 text-foreground dark:text-foreground focus:bg-red-50 dark:focus:bg-red-950/50">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full"></div>
                            <span className="font-medium">Overdue</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="cancelled" className="hover:bg-gray-50 dark:hover:bg-gray-950/50 text-foreground dark:text-foreground focus:bg-gray-50 dark:focus:bg-gray-950/50">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
                            <span className="font-medium">Cancelled</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Method and Shift Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-foreground dark:text-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Payment Method
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">Optional</Badge>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9 bg-background dark:bg-background border-2 border-border dark:border-border hover:border-blue-500 dark:hover:border-blue-400 focus:border-blue-600 dark:focus:border-blue-500 text-foreground dark:text-foreground">
                          <SelectValue placeholder="Method..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background dark:bg-background border-2 border-border dark:border-border">
                        <SelectItem value="not_specified" className="hover:bg-accent dark:hover:bg-accent text-foreground dark:text-foreground focus:bg-accent dark:focus:bg-accent">
                          <span className="text-muted-foreground dark:text-muted-foreground">Not specified</span>
                        </SelectItem>
                        <SelectItem value="Cash" className="hover:bg-accent dark:hover:bg-accent text-foreground dark:text-foreground focus:bg-accent dark:focus:bg-accent font-medium">Cash</SelectItem>
                        <SelectItem value="Credit Card" className="hover:bg-accent dark:hover:bg-accent text-foreground dark:text-foreground focus:bg-accent dark:focus:bg-accent font-medium">Credit Card</SelectItem>
                        <SelectItem value="Bank Transfer" className="hover:bg-accent dark:hover:bg-accent text-foreground dark:text-foreground focus:bg-accent dark:focus:bg-accent font-medium">Bank Transfer</SelectItem>
                        <SelectItem value="Check" className="hover:bg-accent dark:hover:bg-accent text-foreground dark:text-foreground focus:bg-accent dark:focus:bg-accent font-medium">Check</SelectItem>
                        <SelectItem value="Credit" className="hover:bg-accent dark:hover:bg-accent text-foreground dark:text-foreground focus:bg-accent dark:focus:bg-accent font-medium">Company Credit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="shift_id"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-foreground dark:text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      Shift ID
                      {activeShift ? (
                        <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-green-600 hover:bg-green-600">Active Shift</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">Optional</Badge>
                      )}
                    </FormLabel>
                    {activeShift ? (
                      <>
                        <FormControl>
                          <Input
                            type="text"
                            value={activeShift.id}
                            readOnly
                            className="h-9 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 text-foreground dark:text-foreground font-mono"
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                        <div className="text-xs text-muted-foreground dark:text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>
                            Active shift started {new Date(activeShift.start_time).toLocaleDateString()} at{' '}
                            {new Date(activeShift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter shift reference (optional)..."
                            maxLength={50}
                            className="h-9 bg-background dark:bg-background border-2 border-border dark:border-border hover:border-indigo-500 dark:hover:border-indigo-400 focus:border-indigo-600 dark:focus:border-indigo-500 text-foreground dark:text-foreground"
                            {...field}
                          />
                        </FormControl>
                        <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                          No active shift detected. You can manually enter a shift reference if needed.
                        </div>
                      </>
                    )}
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
            </div>

            {/* Comments */}
            <FormField
              control={control}
              name="comments"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-foreground dark:text-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    Notes & Comments
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">Optional</Badge>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Special notes, delivery conditions, quality observations..."
                      maxLength={500}
                      className="min-h-[70px] bg-background dark:bg-background border-2 border-border dark:border-border hover:border-gray-400 dark:hover:border-gray-500 focus:border-gray-600 dark:focus:border-gray-400 text-foreground dark:text-foreground resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />
          </>
        );
      }}
    </FormDialog>
  );
}; 