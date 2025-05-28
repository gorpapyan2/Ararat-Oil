import { format } from "date-fns";
import {
  Expense,
  PaymentMethod,
  PaymentStatus,
  ExpenseCategory,
} from "@/types";
import { ApiExpense } from "../types/expense-types";

/**
 * Converts API expense data format to the application's expense data format
 */
function fromApiData(data: ApiExpense): Expense;
function fromApiData(data: ApiExpense[]): Expense[];
function fromApiData(data: ApiExpense | ApiExpense[]): Expense | Expense[] {
  if (Array.isArray(data)) {
    return data.map((item) => fromApiData(item));
  }

  return {
    id: data.id,
    amount: data.amount,
    expenseDate: data.expense_date ? new Date(data.expense_date) : new Date(),
    category: data.expense_category as ExpenseCategory,
    description: data.description,
    paymentMethod: data.payment_method as PaymentMethod,
    paymentStatus: data.payment_status as PaymentStatus,
    receiptUrl: data.receipt_url,
    vendorName: data.vendor_name,
    notes: data.notes,
    createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
  };
}

/**
 * Converts application's expense data format to the API expense data format
 */
function toApiData(data: Expense): ApiExpense;
function toApiData(data: Expense[]): ApiExpense[];
function toApiData(data: Expense | Expense[]): ApiExpense | ApiExpense[] {
  if (Array.isArray(data)) {
    return data.map((item) => toApiData(item));
  }

  return {
    id: data.id,
    amount: data.amount,
    expense_date: data.expenseDate
      ? format(data.expenseDate, "yyyy-MM-dd")
      : "",
    expense_category: data.category,
    description: data.description,
    payment_method: data.paymentMethod,
    payment_status: data.paymentStatus,
    receipt_url: data.receiptUrl,
    vendor_name: data.vendorName,
    notes: data.notes,
    created_at: data.createdAt
      ? format(data.createdAt, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      : "",
    updated_at: data.updatedAt
      ? format(data.updatedAt, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      : null,
  };
}

export const expensesAdapter = {
  fromApiData,
  toApiData,
};
