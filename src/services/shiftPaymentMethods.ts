import { supabase } from "@/integrations/supabase/client";
import { ShiftPaymentMethod, PaymentMethod } from "@/types";
import { PaymentMethodItem } from "@/components/shared/MultiPaymentMethodForm";

export async function addShiftPaymentMethods(
  shiftId: string,
  paymentMethods: PaymentMethodItem[]
): Promise<ShiftPaymentMethod[]> {
  try {
    // Format the payment methods for insertion
    const formattedPayments = paymentMethods.map(method => ({
      shift_id: shiftId,
      payment_method: method.payment_method,
      amount: method.amount,
      reference: method.reference || null
    }));

    // Insert all payment methods in a single call
    const { data, error } = await supabase
      .from("shift_payment_methods")
      .insert(formattedPayments)
      .select();

    if (error) throw error;
    if (!data) throw new Error("Failed to add shift payment methods");

    return data as ShiftPaymentMethod[];
  } catch (error) {
    console.error("Error in addShiftPaymentMethods:", error);
    throw error;
  }
}

export async function getShiftPaymentMethods(shiftId: string): Promise<ShiftPaymentMethod[]> {
  try {
    const { data, error } = await supabase
      .from("shift_payment_methods")
      .select("*")
      .eq("shift_id", shiftId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as ShiftPaymentMethod[];
  } catch (error) {
    console.error("Error fetching shift payment methods:", error);
    return [];
  }
}

export async function deleteShiftPaymentMethods(shiftId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("shift_payment_methods")
      .delete()
      .eq("shift_id", shiftId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting shift payment methods:", error);
    throw error;
  }
}

// Calculate total amount from payment methods
export function calculateTotalFromPaymentMethods(paymentMethods: ShiftPaymentMethod[]): number {
  return paymentMethods.reduce((total, method) => total + method.amount, 0);
}

// Get amount for a specific payment method
export function getAmountByPaymentMethod(
  paymentMethods: ShiftPaymentMethod[], 
  method: PaymentMethod
): number {
  return paymentMethods
    .filter(pm => pm.payment_method === method)
    .reduce((sum, pm) => sum + pm.amount, 0);
} 