import { shiftsApi, ShiftPaymentMethod } from "@/core/api";
import { PaymentMethod } from "@/types";
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
        payment_method: method.payment_method,
        amount: method.amount,
        reference: method.reference || null
      };
    });

    const response = await shiftsApi.addShiftPaymentMethods(shiftId, validatedPayments as any);

    if (response.error) {
      console.error("Error adding shift payment methods:", response.error);
      throw new Error(response.error.message);
    }
    
    return response.data || [];
  } catch (err: any) {
    console.error("Error in addShiftPaymentMethods:", err);
    throw new Error(err.message || "Failed to add shift payment methods");
  }
}

export async function getShiftPaymentMethods(shiftId: string): Promise<ShiftPaymentMethod[]> {
  try {
    const response = await shiftsApi.getShiftPaymentMethods(shiftId);

    if (response.error) {
      console.error("Error fetching shift payment methods:", response.error);
      throw new Error(response.error.message);
    }
    
    return response.data || [];
  } catch (err: any) {
    console.error("Error fetching shift payment methods:", err);
    throw new Error(err.message || "Failed to fetch shift payment methods");
  }
}

export async function deleteShiftPaymentMethods(shiftId: string): Promise<void> {
  try {
    // Validate shiftId
    if (!shiftId || typeof shiftId !== 'string' || shiftId.trim() === '') {
      throw new Error("Invalid shift ID provided for deletion");
    }
    
    const response = await shiftsApi.deleteShiftPaymentMethods(shiftId);

    if (response.error) {
      console.error("Error deleting shift payment methods:", response.error);
      throw new Error(response.error.message);
    }
    
    console.log(`Successfully deleted payment methods for shift: ${shiftId}`);
  } catch (err: any) {
    console.error("Error deleting shift payment methods:", err);
    throw new Error(err.message || "Failed to delete shift payment methods");
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