// Re-export from centralized API for compatibility
import { 
  getShifts,
  getShiftById,
  getShiftPaymentMethods,
  addShiftPaymentMethods,
  deleteShiftPaymentMethods,
  startShift as apiStartShift,
  closeShift as apiCloseShift,
  getActiveShift as apiGetActiveShift
} from "@/core/api/endpoints/shifts";
import { useCentralizedEntity } from "@/hooks/useCentralizedEntity";
import type { Shift, ShiftPaymentMethod } from "@/core/api/types";
import { PaymentMethodItem } from "@/shared/components/shared/MultiPaymentMethodFormStandardized";

// Modern hook-based approach
export const useShifts = (options?: Parameters<typeof useCentralizedEntity>[1]) => 
  useCentralizedEntity<Shift>('shifts', options);

// Legacy API re-exports for backward compatibility
export {
  getShifts,
  getShiftById,
  getShiftPaymentMethods,
  addShiftPaymentMethods,
  deleteShiftPaymentMethods,
};

export async function startShift(
  openingCash: number,
  employeeIds: string[] = []
): Promise<Shift> {
  try {
    console.log("Starting shift using modern API...");

    const response = await apiStartShift(openingCash, employeeIds);
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    if (!response.data) {
      throw new Error('No data returned from start operation');
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
    console.log("Closing shift using modern API...");

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

    const response = await apiCloseShift(shiftId, closingCash, shiftPaymentMethods);
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    if (!response.data) {
      throw new Error('No data returned from close operation');
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
    console.log("Getting active shift using modern API...");

    const response = await apiGetActiveShift();
    if (response.error) {
      console.error("Error getting active shift:", response.error.message);
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

// Updated function to get the employees associated with a shift - now supports multiple employees
export async function getShiftEmployees(shiftId: string): Promise<string[]> {
  try {
    const response = await getShiftById(shiftId);
    if (response.data) {
      // First try the new employees array
      if (response.data.employees && response.data.employees.length > 0) {
        return response.data.employees.map(emp => emp.employee_id);
      }
      
      // Fallback to single employee_id for backward compatibility
      if (response.data.employee_id) {
        return [response.data.employee_id];
      }
    }
    
    // Fallback to local storage for backward compatibility
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
    console.log("Getting system-wide active shift using modern API...");
    return await getActiveShift();
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
      `Getting active shift for user ${userId} using modern API...`
    );

    // Get shifts by employee and find active ones
    const userShifts = await getShiftsByEmployee(userId);
    const activeShift = userShifts.find(shift => shift.is_active);

    if (!activeShift) {
      console.log(`No active shift found for user ${userId}`);
      return null;
    }

    console.log(`Found active shift for user ${userId}:`, activeShift);
    return activeShift;
  } catch (error: unknown) {
    console.error(`Error fetching active shift for user ${userId}:`, error);
    return null;
  }
}

// Updated function to get shifts by employee - now supports multiple employees per shift
export async function getShiftsByEmployee(employeeId: string): Promise<Shift[]> {
  try {
    const response = await getShifts();
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    const data = response.data;
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Filter shifts that include the specific employee
    return data.filter(shift => {
      // Check if employee is in the new employees array
      if (shift.employees && shift.employees.length > 0) {
        return shift.employees.some(emp => emp.employee_id === employeeId);
      }
      
      // Fallback to single employee_id for backward compatibility
      return shift.employee_id === employeeId;
    });
  } catch (error) {
    console.error("Error getting shifts by employee:", error);
    return [];
  }
}

export async function getShiftSalesTotal(
  shiftId: string
): Promise<{ total: number }> {
  try {
    const summary = await getShiftSummary(shiftId);
    return { total: summary.totalSales };
  } catch (error) {
    console.error("Error getting shift sales total:", error);
    throw error;
  }
}

export async function getShiftSummary(shiftId: string): Promise<{ totalSales: number }> {
  // TODO: Implement shift summary functionality
  console.warn('Shift summary functionality needs to be implemented');
  return { totalSales: 0 };
} 