import { supabase } from "@/services/supabase";
import { ShiftPaymentMethod, PaymentMethod } from "@/types";
import { PaymentMethodItem } from "@/components/shared/MultiPaymentMethodFormStandardized";

export async function addShiftPaymentMethods(
  shiftId: string,
  paymentMethods: PaymentMethodItem[]
): Promise<ShiftPaymentMethod[]> {
  try {
    // Validate shiftId
    if (!shiftId || typeof shiftId !== 'string' || shiftId.trim() === '') {
      throw new Error("Invalid shift ID provided");
    }

    // Validate payment methods array
    if (!Array.isArray(paymentMethods) || paymentMethods.length === 0) {
      throw new Error("No payment methods provided");
    }

    // Check if we're offline
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    console.log(`Adding shift payment methods. Offline mode: ${isOffline}`);

    if (isOffline) {
      console.log("Using offline mode for adding shift payment methods");
      
      // Create mock payment methods
      const mockPaymentMethods: ShiftPaymentMethod[] = paymentMethods.map((method, index) => ({
        id: `offline-payment-${shiftId}-${index}`,
        shift_id: shiftId,
        payment_method: method.payment_method,
        amount: method.amount,
        reference: method.reference || null,
        created_at: new Date().toISOString()
      }));

      console.log("Created mock payment methods:", mockPaymentMethods);
      return mockPaymentMethods;
    }

    // Validate each payment method
    const validatedPayments = paymentMethods.map(method => {
      // Validate payment_method
      if (!method.payment_method || 
          !['cash', 'card', 'bank_transfer', 'mobile_payment'].includes(method.payment_method)) {
        throw new Error(`Invalid payment method: ${method.payment_method}`);
      }
      
      // Validate amount
      if (typeof method.amount !== 'number' || isNaN(method.amount) || method.amount <= 0) {
        throw new Error(`Invalid amount for ${method.payment_method}: ${method.amount}`);
      }
      
      return {
        shift_id: shiftId,
        payment_method: method.payment_method,
        amount: method.amount,
        reference: method.reference || null
      };
    });

    // Insert all payment methods in a single call
    const { data, error } = await supabase
      .from("shift_payment_methods")
      .insert(validatedPayments)
      .select();

    if (error) {
      console.error("Supabase error adding shift payment methods:", error);
      throw new Error(`Failed to add shift payment methods: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      throw new Error("Failed to add shift payment methods: No data returned");
    }

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
    // Validate shiftId
    if (!shiftId || typeof shiftId !== 'string' || shiftId.trim() === '') {
      throw new Error("Invalid shift ID provided for deletion");
    }
    
    // Check if we're offline
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    console.log(`Deleting shift payment methods. Offline mode: ${isOffline}`);

    if (isOffline) {
      console.log("Using offline mode for deleting shift payment methods");
      // In offline mode, we don't need to actually delete anything from the database
      return;
    }

    // Delete existing payment methods for this shift
    const { error } = await supabase
      .from("shift_payment_methods")
      .delete()
      .eq("shift_id", shiftId);

    if (error) {
      console.error("Supabase error deleting shift payment methods:", error);
      throw new Error(`Failed to delete shift payment methods: ${error.message}`);
    }
    
    console.log(`Successfully deleted payment methods for shift: ${shiftId}`);
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