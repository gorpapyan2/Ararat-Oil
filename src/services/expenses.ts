import { supabase } from "@/services/supabase";
import { Expense } from "@/types";

export async function fetchExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data as Expense[];
}

export async function createExpense(expense: Omit<Expense, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("expenses")
    .insert(expense)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateExpense(id: string, expense: Partial<Expense>) {
  const { data, error } = await supabase
    .from("expenses")
    .update(expense)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteExpense(id: string) {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
