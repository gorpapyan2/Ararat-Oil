import { shiftsApi, ShiftPaymentMethod } from "@/core/api";
import { PaymentMethodItem } from "@/shared/components/shared/MultiPaymentMethodFormStandardized";

// Type that matches what the edge function expects
type CreateShiftPaymentMethod = Omit<ShiftPaymentMethod, 'id' | 'created_at' | 'shift_id'> & {
  reference?: string;
};

export async function addShiftPaymentMethods(
  shiftId: string,
  paymentMethods: PaymentMethodItem[]
): Promise<ShiftPaymentMethod[]> {
  try {
    // Validate shiftId
    if (!shiftId || typeof shiftId !== "string" || shiftId.trim() === "") {
      throw new Error("Invalid shift ID provided");
    }

    // Validate payment methods array
    if (!Array.isArray(paymentMethods) || paymentMethods.length === 0) {
      throw new Error("No payment methods provided");
    }

    // Validate each payment method and prepare data for API
    const validatedPayments: CreateShiftPaymentMethod[] = paymentMethods.map((method) => {
      // Validate payment_method
      if (
        !method.payment_method ||
        !["cash", "card", "bank_transfer", "mobile_payment"].includes(
          method.payment_method
        )
      ) {
        throw new Error(`Invalid payment method: ${method.payment_method}`);
      }

      // Validate amount
      if (
        typeof method.amount !== "number" ||
        isNaN(method.amount) ||
        method.amount <= 0
      ) {
        throw new Error(
          `Invalid amount for ${method.payment_method}: ${method.amount}`
        );
      }

      return {
        payment_method: method.payment_method,
        amount: method.amount,
        reference: method.reference || undefined,
        updated_at: "",
      };
    });

    const response = await shiftsApi.addShiftPaymentMethods(
      shiftId,
      validatedPayments as ShiftPaymentMethod[]
    );

    if (response.error) {
      console.error("Error adding shift payment methods:", response.error);
      throw new Error(response.error.message);
    }

    return response.data || [];
  } catch (err: unknown) {
    console.error("Error adding payment methods:", err);
    throw err instanceof Error ? err : new Error("Failed to add payment methods");
  }
}

export async function getShiftPaymentMethods(
  shiftId: string
): Promise<ShiftPaymentMethod[]> {
  try {
    // Validate shiftId
    if (!shiftId || typeof shiftId !== "string" || shiftId.trim() === "") {
      throw new Error("Invalid shift ID provided");
    }

    const response = await shiftsApi.getShiftPaymentMethods(shiftId);

    if (response.error) {
      console.error("Error fetching shift payment methods:", response.error);
      throw new Error(response.error.message);
    }

    return response.data || [];
  } catch (err: unknown) {
    console.error("Error fetching payment methods:", err);
    throw err instanceof Error ? err : new Error("Failed to fetch payment methods");
  }
}

export async function deleteShiftPaymentMethods(
  shiftId: string
): Promise<void> {
  try {
    // Validate shiftId
    if (!shiftId || typeof shiftId !== "string" || shiftId.trim() === "") {
      throw new Error("Invalid shift ID provided");
    }

    const response = await shiftsApi.deleteShiftPaymentMethods(shiftId);

    if (response.error) {
      console.error("Error deleting shift payment methods:", response.error);
      throw new Error(response.error.message);
    }

    console.log(`Payment methods deleted for shift: ${shiftId}`);
  } catch (err: unknown) {
    console.error("Error deleting payment methods:", err);
    throw err instanceof Error ? err : new Error("Failed to delete payment methods");
  }
}

/**
 * Calculate total amount from payment methods array
 */
export function calculateTotalFromPaymentMethods(
  paymentMethods: PaymentMethodItem[]
): number {
  if (!Array.isArray(paymentMethods)) {
    return 0;
  }

  return paymentMethods.reduce((total, method) => {
    const amount = parseFloat(method.amount?.toString() || "0");
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);
}

/**
 * Get amount for a specific payment method from array
 */
export function getAmountByPaymentMethod(
  paymentMethods: PaymentMethodItem[],
  paymentMethod: string
): number {
  if (!Array.isArray(paymentMethods)) {
    return 0;
  }

  return paymentMethods
    .filter((method) => method.payment_method === paymentMethod)
    .reduce((total, method) => {
      const amount = parseFloat(method.amount?.toString() || "0");
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
} 