import { transactionsApi } from "@/services/api";
import { Transaction, PaymentMethod, PaymentStatus } from "@/types";

export const fetchTransactions = async (
  filters?: { 
    entity_type?: string; 
    entity_id?: string; 
    start_date?: string; 
    end_date?: string 
  }
): Promise<Transaction[]> => {
  try {
    const { data, error } = await transactionsApi.getAll(filters);

    if (error) {
      console.error("Error fetching transactions:", error);
      throw new Error(error);
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch transactions:", err);
    throw err;
  }
};

export const fetchTransactionById = async (id: string): Promise<Transaction | null> => {
  try {
    const { data, error } = await transactionsApi.getById(id);

    if (error) {
      console.error(`Error fetching transaction with ID ${id}:`, error);
      throw new Error(error);
    }

    return data || null;
  } catch (err) {
    console.error(`Failed to fetch transaction with ID ${id}:`, err);
    throw err;
  }
};

export const createTransaction = async (
  transaction: Omit<Transaction, "id" | "created_at" | "updated_at">,
): Promise<Transaction> => {
  try {
    // Ensure payment_method is a valid enum value
    const validPaymentMethods = [
      "cash",
      "card",
      "bank_transfer",
      "mobile_payment"
    ];
    const paymentMethod = validPaymentMethods.includes(transaction.payment_method)
      ? transaction.payment_method
      : "cash"; // Default to cash if invalid

    const transactionData = {
      ...transaction,
      payment_method: paymentMethod
    };

    const { data, error } = await transactionsApi.create(transactionData);

    if (error) {
      console.error("Error creating transaction:", error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error("Failed to create transaction:", err);
    throw err;
  }
};

export const updateTransaction = async (
  id: string,
  updates: Partial<Omit<Transaction, "id" | "created_at" | "updated_at">>,
): Promise<Transaction> => {
  try {
    // Validate payment method if it's being updated
    if (updates.payment_method) {
      const validPaymentMethods = [
        "cash",
        "card",
        "bank_transfer",
        "mobile_payment"
      ];
      if (!validPaymentMethods.includes(updates.payment_method)) {
        updates.payment_method = "cash"; // Default to cash if invalid
      }
    }

    const { data, error } = await transactionsApi.update(id, updates);

    if (error) {
      console.error(`Error updating transaction with ID ${id}:`, error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error(`Failed to update transaction with ID ${id}:`, err);
    throw err;
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const { error } = await transactionsApi.delete(id);

    if (error) {
      console.error(`Error deleting transaction with ID ${id}:`, error);
      throw new Error(error);
    }
  } catch (err) {
    console.error(`Failed to delete transaction with ID ${id}:`, err);
    throw err;
  }
};
