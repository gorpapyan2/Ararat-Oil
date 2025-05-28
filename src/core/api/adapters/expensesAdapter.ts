/**
 * Expenses Type Adapter
 *
 * This file provides adapter functions to convert between the core API Expense type
 * and the application's Expense type as defined in src/types/index.ts.
 */

import { Expense as ApiExpense } from "@/core/api/types";
import {
  Expense as AppExpense,
  ExpenseCategory,
  PaymentStatus,
  PaymentMethod,
} from "@/types";

/**
 * Converts a core API Expense to the application Expense type
 */
export function adaptApiExpenseToAppExpense(
  apiExpense: ApiExpense
): AppExpense {
  // Map API category to app ExpenseCategory enum
  const categoryMap: Record<string, ExpenseCategory> = {
    utilities: "utilities",
    rent: "rent",
    salaries: "salaries",
    maintenance: "maintenance",
    supplies: "supplies",
    taxes: "taxes",
    insurance: "insurance",
    other: "other",
  };

  // Map API payment status to app PaymentStatus enum
  const paymentStatusMap: Record<string, PaymentStatus> = {
    paid: "completed",
    pending: "pending",
    cancelled: "failed",
  };

  // Default to "other" if category doesn't match
  const mappedCategory =
    categoryMap[apiExpense.category.toLowerCase()] || "other";

  // Default to "pending" if status doesn't match
  const mappedStatus = paymentStatusMap[apiExpense.payment_status] || "pending";

  return {
    id: apiExpense.id,
    date: apiExpense.payment_date || apiExpense.created_at,
    amount: apiExpense.amount,
    category: mappedCategory,
    description: apiExpense.description || "",
    payment_status: mappedStatus,
    payment_method: (apiExpense.payment_status === "paid"
      ? "cash"
      : undefined) as PaymentMethod | undefined,
    invoice_number: apiExpense.receipt_number,
    notes: "",
    created_at: apiExpense.created_at,
  };
}

/**
 * Converts an array of core API Expenses to application Expense types
 */
export function adaptApiExpensesToAppExpenses(
  apiExpenses: ApiExpense[]
): AppExpense[] {
  return apiExpenses.map(adaptApiExpenseToAppExpense);
}

/**
 * Converts an application Expense to the core API Expense type
 */
export function adaptAppExpenseToApiExpense(
  appExpense: AppExpense
): Omit<ApiExpense, "created_at" | "updated_at"> {
  // Map app ExpenseCategory to API category string
  const categoryMap: Record<ExpenseCategory, string> = {
    utilities: "Utilities",
    rent: "Rent",
    salaries: "Salaries",
    maintenance: "Maintenance",
    supplies: "Supplies",
    taxes: "Taxes",
    insurance: "Insurance",
    other: "Other",
  };

  // Map app PaymentStatus to API payment_status
  const paymentStatusMap: Record<
    PaymentStatus,
    "paid" | "pending" | "cancelled"
  > = {
    pending: "pending",
    completed: "paid",
    failed: "cancelled",
    refunded: "cancelled",
  };

  return {
    id: appExpense.id,
    category: categoryMap[appExpense.category],
    amount: appExpense.amount,
    description: appExpense.description,
    payment_status: paymentStatusMap[appExpense.payment_status],
    payment_date: appExpense.date,
    receipt_number: appExpense.invoice_number,
    created_by: "", // This field is required but may not be in the app type
  };
}

/**
 * Converts an array of application Expenses to core API Expense types
 */
export function adaptAppExpensesToApiExpenses(
  appExpenses: AppExpense[]
): Omit<ApiExpense, "created_at" | "updated_at">[] {
  return appExpenses.map(adaptAppExpenseToApiExpense);
}
