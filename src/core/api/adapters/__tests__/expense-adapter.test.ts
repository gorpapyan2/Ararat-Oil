import { describe, it, expect } from "vitest";
import { expensesAdapter } from "@/core/api/adapters/expenses-adapter";
import { ApiExpense } from "@/core/api/types/expense-types";
import { Expense, PaymentMethod, PaymentStatus } from "@/types";

describe("Expenses Adapter", () => {
  describe("fromApiData", () => {
    it("should convert API expense data to application expense data", () => {
      const apiExpense: ApiExpense = {
        id: "123",
        amount: 150.5,
        expense_date: "2023-05-15",
        expense_category: "maintenance",
        description: "Equipment repair",
        payment_method: "cash" as PaymentMethod,
        payment_status: "paid" as PaymentStatus,
        receipt_url: "https://example.com/receipt.pdf",
        vendor_name: "ABC Repairs",
        notes: "Emergency repair",
        created_at: "2023-05-15T10:30:00Z",
        updated_at: "2023-05-15T10:30:00Z",
      };

      const applicationExpense = expensesAdapter.fromApiData(apiExpense);

      expect(applicationExpense).toEqual({
        id: "123",
        amount: 150.5,
        expenseDate: new Date("2023-05-15"),
        category: "maintenance",
        description: "Equipment repair",
        paymentMethod: "cash",
        paymentStatus: "paid",
        receiptUrl: "https://example.com/receipt.pdf",
        vendorName: "ABC Repairs",
        notes: "Emergency repair",
        createdAt: new Date("2023-05-15T10:30:00Z"),
        updatedAt: new Date("2023-05-15T10:30:00Z"),
      });
    });

    it("should handle missing optional fields", () => {
      const apiExpense: ApiExpense = {
        id: "123",
        amount: 150.5,
        expense_date: "2023-05-15",
        expense_category: "maintenance",
        description: "Equipment repair",
        payment_method: "cash" as PaymentMethod,
        payment_status: "paid" as PaymentStatus,
        created_at: "2023-05-15T10:30:00Z",
        updated_at: "2023-05-15T10:30:00Z",
      };

      const applicationExpense = expensesAdapter.fromApiData(apiExpense);

      expect(applicationExpense).toEqual({
        id: "123",
        amount: 150.5,
        expenseDate: new Date("2023-05-15"),
        category: "maintenance",
        description: "Equipment repair",
        paymentMethod: "cash",
        paymentStatus: "paid",
        receiptUrl: undefined,
        vendorName: undefined,
        notes: undefined,
        createdAt: new Date("2023-05-15T10:30:00Z"),
        updatedAt: new Date("2023-05-15T10:30:00Z"),
      });
    });

    it("should properly convert date strings to Date objects", () => {
      const apiExpense: ApiExpense = {
        id: "123",
        amount: 150.5,
        expense_date: "2023-05-15",
        expense_category: "maintenance",
        description: "Equipment repair",
        payment_method: "cash" as PaymentMethod,
        payment_status: "paid" as PaymentStatus,
        created_at: "2023-05-15T10:30:00Z",
        updated_at: null,
      };

      const applicationExpense = expensesAdapter.fromApiData(apiExpense);

      expect(applicationExpense.expenseDate).toBeInstanceOf(Date);
      expect(applicationExpense.expenseDate.toISOString().split("T")[0]).toBe(
        "2023-05-15"
      );
      expect(applicationExpense.createdAt).toBeInstanceOf(Date);
      expect(applicationExpense.updatedAt).toBeNull();
    });

    it("should convert an array of API expenses", () => {
      const apiExpenses: ApiExpense[] = [
        {
          id: "123",
          amount: 150.5,
          expense_date: "2023-05-15",
          expense_category: "maintenance",
          description: "Equipment repair",
          payment_method: "cash" as PaymentMethod,
          payment_status: "paid" as PaymentStatus,
          created_at: "2023-05-15T10:30:00Z",
          updated_at: "2023-05-15T10:30:00Z",
        },
        {
          id: "124",
          amount: 200.75,
          expense_date: "2023-05-16",
          expense_category: "supplies",
          description: "Office supplies",
          payment_method: "credit_card" as PaymentMethod,
          payment_status: "pending" as PaymentStatus,
          created_at: "2023-05-16T09:15:00Z",
          updated_at: "2023-05-16T09:15:00Z",
        },
      ];

      const applicationExpenses = expensesAdapter.fromApiData(apiExpenses);

      expect(applicationExpenses).toHaveLength(2);
      expect(applicationExpenses[0].id).toBe("123");
      expect(applicationExpenses[1].id).toBe("124");
      expect(applicationExpenses[0].category).toBe("maintenance");
      expect(applicationExpenses[1].category).toBe("supplies");
    });
  });

  describe("toApiData", () => {
    it("should convert application expense data to API expense data", () => {
      const applicationExpense: Expense = {
        id: "123",
        amount: 150.5,
        expenseDate: new Date("2023-05-15"),
        category: "maintenance",
        description: "Equipment repair",
        paymentMethod: "cash" as PaymentMethod,
        paymentStatus: "paid" as PaymentStatus,
        receiptUrl: "https://example.com/receipt.pdf",
        vendorName: "ABC Repairs",
        notes: "Emergency repair",
        createdAt: new Date("2023-05-15T10:30:00Z"),
        updatedAt: new Date("2023-05-15T10:30:00Z"),
      };

      const apiExpense = expensesAdapter.toApiData(applicationExpense);

      expect(apiExpense).toEqual({
        id: "123",
        amount: 150.5,
        expense_date: "2023-05-15",
        expense_category: "maintenance",
        description: "Equipment repair",
        payment_method: "cash",
        payment_status: "paid",
        receipt_url: "https://example.com/receipt.pdf",
        vendor_name: "ABC Repairs",
        notes: "Emergency repair",
        created_at: "2023-05-15T10:30:00Z",
        updated_at: "2023-05-15T10:30:00Z",
      });
    });

    it("should handle missing optional fields", () => {
      const applicationExpense: Expense = {
        id: "123",
        amount: 150.5,
        expenseDate: new Date("2023-05-15"),
        category: "maintenance",
        description: "Equipment repair",
        paymentMethod: "cash" as PaymentMethod,
        paymentStatus: "paid" as PaymentStatus,
        createdAt: new Date("2023-05-15T10:30:00Z"),
        updatedAt: null,
      };

      const apiExpense = expensesAdapter.toApiData(applicationExpense);

      expect(apiExpense).toEqual({
        id: "123",
        amount: 150.5,
        expense_date: "2023-05-15",
        expense_category: "maintenance",
        description: "Equipment repair",
        payment_method: "cash",
        payment_status: "paid",
        receipt_url: undefined,
        vendor_name: undefined,
        notes: undefined,
        created_at: "2023-05-15T10:30:00Z",
        updated_at: null,
      });
    });

    it("should properly convert Date objects to date strings", () => {
      const applicationExpense: Expense = {
        id: "123",
        amount: 150.5,
        expenseDate: new Date("2023-05-15T00:00:00Z"),
        category: "maintenance",
        description: "Equipment repair",
        paymentMethod: "cash" as PaymentMethod,
        paymentStatus: "paid" as PaymentStatus,
        createdAt: new Date("2023-05-15T10:30:00Z"),
        updatedAt: null,
      };

      const apiExpense = expensesAdapter.toApiData(applicationExpense);

      expect(typeof apiExpense.expense_date).toBe("string");
      expect(apiExpense.expense_date).toBe("2023-05-15");
      expect(typeof apiExpense.created_at).toBe("string");
      expect(apiExpense.updated_at).toBeNull();
    });

    it("should convert an array of application expenses", () => {
      const applicationExpenses: Expense[] = [
        {
          id: "123",
          amount: 150.5,
          expenseDate: new Date("2023-05-15"),
          category: "maintenance",
          description: "Equipment repair",
          paymentMethod: "cash" as PaymentMethod,
          paymentStatus: "paid" as PaymentStatus,
          createdAt: new Date("2023-05-15T10:30:00Z"),
          updatedAt: new Date("2023-05-15T10:30:00Z"),
        },
        {
          id: "124",
          amount: 200.75,
          expenseDate: new Date("2023-05-16"),
          category: "supplies",
          description: "Office supplies",
          paymentMethod: "credit_card" as PaymentMethod,
          paymentStatus: "pending" as PaymentStatus,
          createdAt: new Date("2023-05-16T09:15:00Z"),
          updatedAt: new Date("2023-05-16T09:15:00Z"),
        },
      ];

      const apiExpenses = expensesAdapter.toApiData(applicationExpenses);

      expect(apiExpenses).toHaveLength(2);
      expect(apiExpenses[0].id).toBe("123");
      expect(apiExpenses[1].id).toBe("124");
      expect(apiExpenses[0].expense_category).toBe("maintenance");
      expect(apiExpenses[1].expense_category).toBe("supplies");
    });
  });
});
