import { shiftsApi, Shift, ShiftPaymentMethod } from "@/core/api";
import { PaymentMethodItem } from "@/shared/components/shared/MultiPaymentMethodFormStandardized";

export async function startShift(
  openingCash: number,
  employeeIds: string[] = []
): Promise<Shift> {
  try {
    console.log("Starting shift using Edge Function...");

    const response = await shiftsApi.startShift(openingCash, employeeIds);

    if (response.error) {
      throw new Error(`Failed to start shift: ${response.error.message}`);
    }

    if (!response.data) {
      throw new Error("Failed to start shift: No data returned");
    }

    console.log("Shift started successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error starting shift:", error);
    throw error;
  }
}

export async function closeShift(
  shiftId: string,
  closingCash: number,
  paymentMethods?: PaymentMethodItem[]
): Promise<Shift> {
  try {
    console.log("Closing shift using Edge Function...");

    // Transform PaymentMethodItem to ShiftPaymentMethod if needed
    let shiftPaymentMethods: ShiftPaymentMethod[] | undefined;
    if (paymentMethods && paymentMethods.length > 0) {
      shiftPaymentMethods = paymentMethods.map((method) => ({
        id: "", // Will be set by the server
        shift_id: shiftId,
        payment_method: method.payment_method,
        amount: method.amount,
        notes: method.reference || "",
        created_at: "",
        updated_at: "",
      }));
    }

    const response = await shiftsApi.closeShift(
      shiftId,
      closingCash,
      shiftPaymentMethods
    );

    if (response.error) {
      throw new Error(`Failed to close shift: ${response.error.message}`);
    }

    if (!response.data) {
      throw new Error("Failed to close shift: No data returned");
    }

    console.log("Shift closed successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error closing shift:", error);
    throw error;
  }
}

export async function getActiveShift(): Promise<Shift | null> {
  try {
    console.log("Getting active shift using Edge Function...");

    const response = await shiftsApi.getActiveShift();

    if (response.error) {
      console.error("Error fetching active shift:", response.error);
      return null;
    }

    if (!response.data) {
      console.log("No active shift found");
      return null;
    }

    console.log("Found active shift:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Exception fetching active shift:", error);
    return null;
  }
}

// Function to get the employees associated with a shift
export async function getShiftEmployees(shiftId: string): Promise<string[]> {
  try {
    // This could be implemented by retrieving from an API or local storage
    const storedData = localStorage.getItem(`shift_${shiftId}_employees`);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return [];
  } catch (error) {
    console.error("Error retrieving shift employees:", error);
    return [];
  }
}

export async function getSystemActiveShift(): Promise<Shift | null> {
  try {
    console.log("Getting system-wide active shift using Edge Function...");

    const response = await shiftsApi.getSystemActiveShift();

    if (response.error) {
      console.error("Error fetching system active shift:", response.error);
      return null;
    }

    if (!response.data) {
      console.log("No system-wide active shift found");
      return null;
    }

    console.log("Found system-wide active shift:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching system-wide active shift:", error);
    return null;
  }
}

export async function getActiveShiftForUser(
  userId: string
): Promise<Shift | null> {
  try {
    console.log(
      `Getting active shift for user ${userId} using Edge Function...`
    );

    const response = await shiftsApi.getActiveShiftForUser(userId);

    if (response.error) {
      console.error(
        `Error fetching active shift for user ${userId}:`,
        response.error
      );
      return null;
    }

    if (!response.data) {
      console.log(`No active shift found for user ${userId}`);
      return null;
    }

    console.log(`Found active shift for user ${userId}:`, response.data);
    return response.data;
  } catch (error: unknown) {
    console.error(`Error fetching active shift for user ${userId}:`, error);
    return null;
  }
}

export async function getShiftSalesTotal(
  shiftId: string
): Promise<{ total: number }> {
  try {
    const response = await shiftsApi.getShiftSalesTotal(shiftId);

    if (response.error) {
      throw new Error(
        `Failed to get shift sales total: ${response.error.message}`
      );
    }

    return { total: response.data?.total || 0 };
  } catch (error) {
    console.error("Error getting shift sales total:", error);
    throw error;
  }
} 