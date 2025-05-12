import { Shift } from "@/types";
import { shiftsApi } from "@/services/api";
import { PaymentMethodItem } from "@/components/shared/MultiPaymentMethodFormStandardized";

export async function startShift(openingCash: number, employeeIds: string[] = []): Promise<Shift> {
  try {
    console.log("Starting shift using Edge Function...");
    
    const { data, error } = await shiftsApi.start(openingCash, employeeIds);
    
    if (error) {
      throw new Error(`Failed to start shift: ${error}`);
    }
    
    if (!data) {
      throw new Error("No data returned after starting shift");
    }
    
    console.log("Started shift:", data);
    return data as Shift;
  } catch (error) {
    console.error("Error in startShift:", error);
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
    
    const { data, error } = await shiftsApi.close(shiftId, closingCash, paymentMethods);
    
    if (error) {
      throw new Error(`Failed to close shift: ${error}`);
    }
    
    if (!data) {
      throw new Error("No data returned after closing shift");
    }
    
    console.log("Closed shift:", data);
    return data as Shift;
  } catch (error: any) {
    console.error("Error in closeShift service:", error);
    
    // Check if it's a network error
    if (error.message?.includes("Failed to fetch") || 
        !navigator.onLine || 
        error.message?.includes("offline")) {
      throw new Error("Network error: Cannot close shift while offline");
    }
    
    throw error;
  }
}

export async function getActiveShift(): Promise<Shift | null> {
  try {
    console.log("Getting active shift using Edge Function...");
    
    const { data, error } = await shiftsApi.getActive();
    
    if (error) {
      console.error("Error fetching active shift:", error);
      return null;
    }
    
    if (!data) {
      console.log("No active shift found");
      return null;
    }
    
    console.log("Found active shift:", data);
    return data as Shift;
  } catch (e) {
    console.error("Exception fetching active shift:", e);
    return null;
  }
}

export async function addShiftPaymentMethods(
  shiftId: string,
  methods: PaymentMethodItem[]
): Promise<void> {
  try {
    console.log("Adding payment methods to shift using Edge Function...");
    
    // Transform PaymentMethodItem to the format expected by the API
    const paymentData = methods.map((method) => ({
      payment_method: method.payment_method,
      amount: method.amount,
      reference: method.reference || "",
    }));
    
    const { error } = await shiftsApi.addPaymentMethods(shiftId, paymentData);
    
    if (error) {
      throw new Error(`Failed to add payment methods: ${error}`);
    }
    
    console.log("Added payment methods to shift:", shiftId);
  } catch (error) {
    console.error("Error adding payment methods:", error);
    throw error;
  }
}

export async function deleteShiftPaymentMethods(shiftId: string): Promise<void> {
  try {
    console.log("Deleting payment methods from shift using Edge Function...");
    
    const { error } = await shiftsApi.deletePaymentMethods(shiftId);
    
    if (error) {
      throw new Error(`Failed to delete payment methods: ${error}`);
    }
    
    console.log("Deleted payment methods from shift:", shiftId);
  } catch (error) {
    console.error("Error deleting payment methods:", error);
    throw error;
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
    
    const { data, error } = await shiftsApi.getSystemActive();
    
    if (error) {
      console.error("Error fetching system active shift:", error);
      return null;
    }
    
    if (!data) {
      console.log("No system-wide active shift found");
      return null;
    }
    
    console.log("Found system-wide active shift:", data);
    return data as Shift;
  } catch (e) {
    console.error("Exception fetching system-wide active shift:", e);
    return null;
  }
}

export async function getActiveShiftForUser(userId: string): Promise<Shift | null> {
  try {
    console.log(`Getting active shift for user ${userId} using Edge Function...`);
    
    const { data, error } = await shiftsApi.getActiveForUser(userId);
    
    if (error) {
      console.error(`Error fetching active shift for user ${userId}:`, error);
      return null;
    }
    
    if (!data) {
      console.log(`No active shift found for user ${userId}`);
      return null;
    }
    
    console.log(`Found active shift for user ${userId}:`, data);
    return data as Shift;
  } catch (e) {
    console.error(`Exception fetching active shift for user ${userId}:`, e);
    return null;
  }
}

export async function getShiftSalesTotal(shiftId: string): Promise<{ total: number }> {
  try {
    console.log(`Getting sales total for shift ${shiftId} using Edge Function...`);
    
    const { data, error } = await shiftsApi.getSalesTotal(shiftId);
    
    if (error) {
      console.error(`Error fetching sales total for shift ${shiftId}:`, error);
      return { total: 0 };
    }
    
    if (!data) {
      console.log(`No sales total found for shift ${shiftId}`);
      return { total: 0 };
    }
    
    console.log(`Found sales total for shift ${shiftId}:`, data);
    return data as { total: number };
  } catch (e) {
    console.error(`Exception fetching sales total for shift ${shiftId}:`, e);
    return { total: 0 };
  }
}
